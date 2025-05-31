// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FarmToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 10 million tokens
    
    constructor() ERC20("Farm Token", "FARM") {
        _mint(address(this), MAX_SUPPLY);
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        return super.transfer(to, amount);
    }
}

contract EnhancedFarmingGame is ReentrancyGuard, Ownable {
    using SafeMath for uint256;
    
    IERC20 public immutable usdtToken;
    FarmToken public immutable farmToken;
    address public treasuryWallet;
    
    // Fee structure
    uint256 public constant DEPOSIT_FEE = 1000; // 10% in basis points
    uint256 public constant WITHDRAWAL_FEE = 1 * 10**18; // 1 USDT
    uint256 public constant REFERRAL_COMMISSION = 1000; // 10% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // Price management
    uint256 public baseFarmPrice = 1 * 10**18; // 1 USDT base price
    uint256 public totalUsdtInPools;
    uint256 public constant PRICE_MULTIPLIER = 10**18;
    uint256 public lastPriceUpdate;
    uint256 public constant PRICE_UPDATE_INTERVAL = 1 hours; // Anti-MEV protection
    
    struct FarmingPool {
        uint256 minDeposit;
        uint256 maxDeposit;
        uint256 dailyRewardPercentage; // Daily reward percentage in basis points
        uint256 duration; // Duration in days
        uint256 totalDeposited;
        uint256 poolRewardPercentage; // Percentage of daily FARM distribution
        bool active;
    }
    
    struct UserFarm {
        uint256 poolId;
        uint256 depositAmount;
        uint256 startTime;
        uint256 lastHarvestTime;
        uint256 totalHarvested;
        bool active;
    }
    
    struct ReferralData {
        address referrer;
        uint256 totalReferrals;
        uint256 totalEarnings;
        uint256 availableEarnings;
    }
    
    struct UserStats {
        uint256 totalInvested;
        uint256 totalHarvested;
        uint256 activeFarms;
        bool hasInvested;
    }
    
    mapping(uint256 => FarmingPool) public farmingPools;
    mapping(address => mapping(uint256 => UserFarm)) public userFarms;
    mapping(address => uint256[]) public userFarmIds;
    mapping(address => uint256) public userBalances;
    mapping(address => ReferralData) public referralData;
    mapping(address => address[]) public userReferrals;
    mapping(address => UserStats) public userStats;
    
    uint256 public nextPoolId = 1;
    uint256 public nextFarmId = 1;
    uint256 public constant DAILY_FARM_DISTRIBUTION = 27397 * 10**18; // ~10M tokens per year
    
    event Deposited(address indexed user, uint256 amount, uint256 fee, address indexed referrer);
    event Withdrawn(address indexed user, uint256 amount, uint256 fee);
    event FarmStarted(address indexed user, uint256 farmId, uint256 poolId, uint256 amount);
    event Harvested(address indexed user, uint256 farmId, uint256 reward);
    event TokensSwapped(address indexed user, bool usdtToFarm, uint256 inputAmount, uint256 outputAmount);
    event ReferralEarned(address indexed referrer, address indexed referee, uint256 amount);
    event ReferralWithdrawn(address indexed user, uint256 amount);
    event PriceUpdated(uint256 newPrice, uint256 totalUsdtInPools);
    
    constructor(address _usdtToken, address _treasuryWallet) {
        usdtToken = IERC20(_usdtToken);
        farmToken = new FarmToken();
        treasuryWallet = _treasuryWallet;
        lastPriceUpdate = block.timestamp;
        
        // Initialize farming pools with shorter durations and daily rewards
        _createFarmingPool(10 * 10**18, 500 * 10**18, 100, 7, 1000); // Starter: 1% daily, 7 days, 10% of distribution
        _createFarmingPool(25 * 10**18, 1000 * 10**18, 150, 10, 2000); // Growth: 1.5% daily, 10 days, 20% of distribution
        _createFarmingPool(50 * 10**18, 5000 * 10**18, 200, 14, 3000); // Premium: 2% daily, 14 days, 30% of distribution
        _createFarmingPool(100 * 10**18, 50000 * 10**18, 300, 21, 4000); // Whale: 3% daily, 21 days, 40% of distribution
    }
    
    function _createFarmingPool(
        uint256 _minDeposit,
        uint256 _maxDeposit,
        uint256 _dailyRewardPercentage,
        uint256 _duration,
        uint256 _poolRewardPercentage
    ) internal {
        farmingPools[nextPoolId] = FarmingPool({
            minDeposit: _minDeposit,
            maxDeposit: _maxDeposit,
            dailyRewardPercentage: _dailyRewardPercentage,
            duration: _duration,
            totalDeposited: 0,
            poolRewardPercentage: _poolRewardPercentage,
            active: true
        });
        nextPoolId++;
    }
    
    function setReferrer(address _referrer) external {
        require(_referrer != msg.sender, "Cannot refer yourself");
        require(referralData[msg.sender].referrer == address(0), "Referrer already set");
        require(_referrer != address(0), "Invalid referrer address");
        
        referralData[msg.sender].referrer = _referrer;
        referralData[_referrer].totalReferrals++;
        userReferrals[_referrer].push(msg.sender);
    }
    
    function depositUSDT(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Calculate fees
        uint256 fee = amount.mul(DEPOSIT_FEE).div(BASIS_POINTS);
        uint256 netAmount = amount.sub(fee);
        
        // Send fee to treasury
        require(usdtToken.transfer(treasuryWallet, fee), "Fee transfer failed");
        
        // Handle referral commission
        address referrer = referralData[msg.sender].referrer;
        if (referrer != address(0)) {
            uint256 referralCommission = netAmount.mul(REFERRAL_COMMISSION).div(BASIS_POINTS);
            referralData[referrer].totalEarnings = referralData[referrer].totalEarnings.add(referralCommission);
            referralData[referrer].availableEarnings = referralData[referrer].availableEarnings.add(referralCommission);
            netAmount = netAmount.sub(referralCommission);
            
            emit ReferralEarned(referrer, msg.sender, referralCommission);
        }
        
        userBalances[msg.sender] = userBalances[msg.sender].add(netAmount);
        userStats[msg.sender].hasInvested = true;
        
        emit Deposited(msg.sender, amount, fee, referrer);
    }
    
    function withdrawUSDT(uint256 amount) external nonReentrant {
        require(userStats[msg.sender].hasInvested, "Must invest before withdrawing");
        require(amount > WITHDRAWAL_FEE, "Amount must be greater than withdrawal fee");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] = userBalances[msg.sender].sub(amount);
        
        // Deduct withdrawal fee
        uint256 netAmount = amount.sub(WITHDRAWAL_FEE);
        
        // Send fee to treasury
        require(usdtToken.transfer(treasuryWallet, WITHDRAWAL_FEE), "Fee transfer failed");
        
        // Send net amount to user
        require(usdtToken.transfer(msg.sender, netAmount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount, WITHDRAWAL_FEE);
    }
    
    function startFarming(uint256 poolId, uint256 amount) external nonReentrant {
        require(farmingPools[poolId].active, "Pool not active");
        require(amount >= farmingPools[poolId].minDeposit, "Below minimum deposit");
        require(amount <= farmingPools[poolId].maxDeposit, "Above maximum deposit");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] = userBalances[msg.sender].sub(amount);
        totalUsdtInPools = totalUsdtInPools.add(amount);
        farmingPools[poolId].totalDeposited = farmingPools[poolId].totalDeposited.add(amount);
        
        uint256 farmId = nextFarmId++;
        userFarms[msg.sender][farmId] = UserFarm({
            poolId: poolId,
            depositAmount: amount,
            startTime: block.timestamp,
            lastHarvestTime: block.timestamp,
            totalHarvested: 0,
            active: true
        });
        
        userFarmIds[msg.sender].push(farmId);
        userStats[msg.sender].totalInvested = userStats[msg.sender].totalInvested.add(amount);
        userStats[msg.sender].activeFarms++;
        
        _updateFarmPrice();
        
        emit FarmStarted(msg.sender, farmId, poolId, amount);
    }
    
    function harvest(uint256 farmId) external nonReentrant {
        UserFarm storage farm = userFarms[msg.sender][farmId];
        require(farm.active, "Farm not active");
        
        uint256 reward = calculateReward(msg.sender, farmId);
        require(reward > 0, "No reward available");
        
        farm.lastHarvestTime = block.timestamp;
        farm.totalHarvested = farm.totalHarvested.add(reward);
        userStats[msg.sender].totalHarvested = userStats[msg.sender].totalHarvested.add(reward);
        
        // If farming period is complete, return principal and close farm
        if (block.timestamp >= farm.startTime.add(farmingPools[farm.poolId].duration.mul(1 days))) {
            userBalances[msg.sender] = userBalances[msg.sender].add(farm.depositAmount);
            totalUsdtInPools = totalUsdtInPools.sub(farm.depositAmount);
            farmingPools[farm.poolId].totalDeposited = farmingPools[farm.poolId].totalDeposited.sub(farm.depositAmount);
            farm.active = false;
            userStats[msg.sender].activeFarms--;
            _updateFarmPrice();
        }
        
        farmToken.transfer(msg.sender, reward);
        emit Harvested(msg.sender, farmId, reward);
    }
    
    function calculateReward(address user, uint256 farmId) public view returns (uint256) {
        UserFarm memory farm = userFarms[user][farmId];
        if (!farm.active) return 0;
        
        FarmingPool memory pool = farmingPools[farm.poolId];
        uint256 timeElapsed = block.timestamp.sub(farm.lastHarvestTime);
        uint256 daysElapsed = timeElapsed.div(1 days);
        
        if (daysElapsed == 0) return 0;
        
        // Calculate daily reward based on pool percentage and user's share
        uint256 dailyPoolReward = DAILY_FARM_DISTRIBUTION.mul(pool.poolRewardPercentage).div(BASIS_POINTS);
        uint256 userShare = farm.depositAmount.mul(PRICE_MULTIPLIER).div(pool.totalDeposited > 0 ? pool.totalDeposited : 1);
        uint256 userDailyReward = dailyPoolReward.mul(userShare).div(PRICE_MULTIPLIER);
        
        return userDailyReward.mul(daysElapsed);
    }
    
    function swapFarmToUSDT(uint256 farmAmount) external nonReentrant {
        require(farmAmount > 0, "Amount must be greater than 0");
        require(farmToken.balanceOf(msg.sender) >= farmAmount, "Insufficient FARM balance");
        
        uint256 currentPrice = getCurrentFarmPrice();
        uint256 usdtAmount = farmAmount.mul(currentPrice).div(PRICE_MULTIPLIER);
        
        require(farmToken.transferFrom(msg.sender, address(this), farmAmount), "FARM transfer failed");
        userBalances[msg.sender] = userBalances[msg.sender].add(usdtAmount);
        
        emit TokensSwapped(msg.sender, false, farmAmount, usdtAmount);
    }
    
    function withdrawReferralEarnings() external nonReentrant {
        uint256 amount = referralData[msg.sender].availableEarnings;
        require(amount > 0, "No referral earnings available");
        
        referralData[msg.sender].availableEarnings = 0;
        require(usdtToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit ReferralWithdrawn(msg.sender, amount);
    }
    
    function _updateFarmPrice() internal {
        if (block.timestamp >= lastPriceUpdate.add(PRICE_UPDATE_INTERVAL)) {
            uint256 newPrice = calculateFarmPrice();
            baseFarmPrice = newPrice;
            lastPriceUpdate = block.timestamp;
            emit PriceUpdated(newPrice, totalUsdtInPools);
        }
    }
    
    function calculateFarmPrice() public view returns (uint256) {
        if (totalUsdtInPools == 0) return baseFarmPrice;
        
        // Price increases with more USDT in pools, decreases with less
        // Base price * (1 + (totalUsdtInPools / 1M USDT) * 0.5)
        uint256 priceMultiplier = PRICE_MULTIPLIER.add(
            totalUsdtInPools.mul(5 * 10**17).div(1_000_000 * 10**18)
        );
        
        return baseFarmPrice.mul(priceMultiplier).div(PRICE_MULTIPLIER);
    }
    
    function getCurrentFarmPrice() public view returns (uint256) {
        return calculateFarmPrice();
    }
    
    // View functions
    function getUserFarms(address user) external view returns (uint256[] memory) {
        return userFarmIds[user];
    }
    
    function getFarmDetails(address user, uint256 farmId) external view returns (
        uint256 poolId,
        uint256 depositAmount,
        uint256 startTime,
        uint256 lastHarvestTime,
        bool active,
        uint256 pendingReward,
        uint256 totalHarvested
    ) {
        UserFarm memory farm = userFarms[user][farmId];
        return (
            farm.poolId,
            farm.depositAmount,
            farm.startTime,
            farm.lastHarvestTime,
            farm.active,
            calculateReward(user, farmId),
            farm.totalHarvested
        );
    }
    
    function getReferralData(address user) external view returns (
        address referrer,
        uint256 totalReferrals,
        uint256 totalEarnings,
        uint256 availableEarnings
    ) {
        ReferralData memory data = referralData[user];
        return (
            data.referrer,
            data.totalReferrals,
            data.totalEarnings,
            data.availableEarnings
        );
    }
    
    function getUserStats(address user) external view returns (
        uint256 totalInvested,
        uint256 totalHarvested,
        uint256 activeFarms,
        bool hasInvested,
        uint256 farmTokenBalance,
        uint256 usdtBalance
    ) {
        UserStats memory stats = userStats[user];
        return (
            stats.totalInvested,
            stats.totalHarvested,
            stats.activeFarms,
            stats.hasInvested,
            farmToken.balanceOf(user),
            userBalances[user]
        );
    }
    
    function getPoolStats(uint256 poolId) external view returns (
        uint256 totalDeposited,
        uint256 dailyRewardPercentage,
        uint256 poolRewardPercentage,
        uint256 minDeposit,
        uint256 maxDeposit,
        uint256 duration,
        bool active
    ) {
        FarmingPool memory pool = farmingPools[poolId];
        return (
            pool.totalDeposited,
            pool.dailyRewardPercentage,
            pool.poolRewardPercentage,
            pool.minDeposit,
            pool.maxDeposit,
            pool.duration,
            pool.active
        );
    }
    
    function getContractStats() external view returns (
        uint256 totalUsdtInPools,
        uint256 currentFarmPrice,
        uint256 totalFarmSupply,
        uint256 dailyFarmDistribution,
        uint256 totalUsers
    ) {
        return (
            totalUsdtInPools,
            getCurrentFarmPrice(),
            farmToken.totalSupply(),
            DAILY_FARM_DISTRIBUTION,
            0 // Would need to track this separately
        );
    }
    
    // Admin functions
    function updateTreasuryWallet(address _treasuryWallet) external onlyOwner {
        treasuryWallet = _treasuryWallet;
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        usdtToken.transfer(owner(), balance);
    }
}
