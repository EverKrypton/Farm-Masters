// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract FarmToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18; // 10 million tokens
    uint256 public totalBurned;
    
    event TokensBurned(uint256 amount, uint256 totalBurned);
    
    constructor() ERC20("Farm Token", "FARM") {
        // Initial supply will be minted by the farming contract as needed
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external onlyOwner {
        _burn(address(this), amount);
        totalBurned = totalBurned.add(amount);
        emit TokensBurned(amount, totalBurned);
    }
    
    function burnFrom(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
        totalBurned = totalBurned.add(amount);
        emit TokensBurned(amount, totalBurned);
    }
    
    function getCirculatingSupply() external view returns (uint256) {
        return totalSupply().sub(balanceOf(address(this)));
    }
    
    function getTotalBurned() external view returns (uint256) {
        return totalBurned;
    }
}

contract EnhancedFarmingGame is ReentrancyGuard, Ownable, Pausable {
    using SafeMath for uint256;
    
    IERC20 public immutable usdtToken;
    FarmToken public immutable farmToken;
    address public treasuryWallet;
    
    // Enhanced Fee structure
    uint256 public constant DEPOSIT_FEE = 1000; // 10% in basis points
    uint256 public constant WITHDRAWAL_FEE = 1 * 10**18; // 1 USDT
    uint256 public constant SWAP_FEE = 100; // 1% in basis points for FARM to USDT swaps
    uint256 public constant REFERRAL_COMMISSION = 1000; // 10% in basis points
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant EARLY_HARVEST_PENALTY = 5000; // 50% penalty for early harvest
    uint256 public constant EARLY_HARVEST_PERIOD = 7 days; // First week penalty period
    
    // Enhanced Price management
    uint256 public baseFarmPrice = 5 * 10**14; // 0.0005 USDT initial price
    uint256 public totalUsdtInPools;
    uint256 public totalUsdtVolume; // Total volume for price calculation
    uint256 public constant PRICE_MULTIPLIER = 10**18;
    uint256 public lastPriceUpdate;
    uint256 public constant PRICE_UPDATE_INTERVAL = 1 hours;
    uint256 public priceImpactFactor = 1000; // 10% price impact per 100k USDT volume
    
    // Daily distribution and minting
    uint256 public constant DAILY_FARM_DISTRIBUTION = 27397 * 10**18; // ~10M tokens per year
    uint256 public lastDistributionTime;
    uint256 public totalDistributedToday;
    
    // Weekly airdrop system
    uint256 public weeklyDepositTotal;
    uint256 public lastWeeklyAirdrop;
    uint256 public constant WEEKLY_AIRDROP_PERCENTAGE = 100; // 1% in basis points
    uint256 public constant MIN_DEPOSIT_FOR_AIRDROP = 500 * 10**18; // 500 USDT
    address[] public airdropEligibleUsers;
    mapping(address => bool) public isEligibleForAirdrop;
    mapping(address => uint256) public weeklyDepositAmount;
    
    // Owner withdrawal tracking
    uint256 public totalOwnerWithdrawals;
    uint256 public lastOwnerWithdrawal;
    
    struct FarmingPool {
        uint256 minDeposit;
        uint256 maxDeposit;
        uint256 dailyRewardPercentage; // Daily reward percentage in basis points
        uint256 duration; // Duration in days
        uint256 totalDeposited;
        uint256 poolRewardPercentage; // Percentage of daily FARM distribution
        uint256 completionBonusPercentage; // Percentage bonus in FARM tokens (in basis points)
        bool active;
    }
    
    struct UserFarm {
        uint256 poolId;
        uint256 depositAmount;
        uint256 startTime;
        uint256 lastHarvestTime;
        uint256 totalHarvested;
        uint256 farmTokensEarned; // Total FARM tokens earned but not yet transferred
        bool active;
        bool completed;
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
        uint256 weeklyDeposits;
        bool hasInvested;
    }
    
    mapping(uint256 => FarmingPool) public farmingPools;
    mapping(address => mapping(uint256 => UserFarm)) public userFarms;
    mapping(address => uint256[]) public userFarmIds;
    mapping(address => uint256) public userBalances; // Game USDT balance
    mapping(address => ReferralData) public referralData;
    mapping(address => address[]) public userReferrals;
    mapping(address => UserStats) public userStats;
    
    uint256 public nextPoolId = 1;
    uint256 public nextFarmId = 1;
    
    event Deposited(address indexed user, uint256 amount, uint256 fee, address indexed referrer);
    event Withdrawn(address indexed user, uint256 amount, uint256 fee);
    event FarmStarted(address indexed user, uint256 farmId, uint256 poolId, uint256 amount);
    event Harvested(address indexed user, uint256 farmId, uint256 reward, uint256 penalty);
    event FarmCompleted(address indexed user, uint256 farmId, uint256 totalFarmTokens);
    event TokensSwapped(address indexed user, uint256 farmAmount, uint256 usdtAmount, uint256 fee);
    event TokensBurned(uint256 amount);
    event ReferralEarned(address indexed referrer, address indexed referee, uint256 amount);
    event ReferralWithdrawn(address indexed user, uint256 amount);
    event PriceUpdated(uint256 newPrice, uint256 totalUsdtInPools, uint256 totalVolume);
    event DailyDistribution(uint256 amount, uint256 timestamp);
    event WeeklyAirdrop(uint256 totalAmount, uint256 eligibleUsers, uint256 timestamp);
    event AirdropClaimed(address indexed user, uint256 amount);
    event OwnerWithdrawal(address indexed owner, uint256 amount, uint256 timestamp);
    event EmergencyWithdrawal(address indexed owner, uint256 amount, uint256 timestamp);
    
    modifier onlyInvested() {
        require(userStats[msg.sender].hasInvested, "Must invest before using this function");
        _;
    }
    
    modifier validPool(uint256 poolId) {
        require(poolId > 0 && poolId < nextPoolId, "Invalid pool ID");
        require(farmingPools[poolId].active, "Pool not active");
        _;
    }
    
    constructor(address _usdtToken, address _treasuryWallet) {
        require(_usdtToken != address(0), "Invalid USDT address");
        require(_treasuryWallet != address(0), "Invalid treasury address");
        
        usdtToken = IERC20(_usdtToken);
        farmToken = new FarmToken();
        treasuryWallet = _treasuryWallet;
        lastPriceUpdate = block.timestamp;
        lastDistributionTime = block.timestamp;
        lastWeeklyAirdrop = block.timestamp;
        
        // Initialize farming pools with percentage-based completion bonuses
        _createFarmingPool(10 * 10**18, 500 * 10**18, 100, 7, 1000, 500); // Starter: 1% daily, 7 days, 5% completion bonus
        _createFarmingPool(25 * 10**18, 1000 * 10**18, 150, 10, 2000, 800); // Growth: 1.5% daily, 10 days, 8% completion bonus
        _createFarmingPool(50 * 10**18, 5000 * 10**18, 200, 14, 3000, 1200); // Premium: 2% daily, 14 days, 12% completion bonus
        _createFarmingPool(100 * 10**18, 50000 * 10**18, 300, 21, 4000, 1800); // Whale: 3% daily, 21 days, 18% completion bonus
    }
    
    function _createFarmingPool(
        uint256 _minDeposit,
        uint256 _maxDeposit,
        uint256 _dailyRewardPercentage,
        uint256 _duration,
        uint256 _poolRewardPercentage,
        uint256 _completionBonusPercentage
    ) internal {
        farmingPools[nextPoolId] = FarmingPool({
            minDeposit: _minDeposit,
            maxDeposit: _maxDeposit,
            dailyRewardPercentage: _dailyRewardPercentage,
            duration: _duration,
            totalDeposited: 0,
            poolRewardPercentage: _poolRewardPercentage,
            completionBonusPercentage: _completionBonusPercentage,
            active: true
        });
        nextPoolId++;
    }
    
    function setReferrer(address _referrer) external {
        require(_referrer != msg.sender, "Cannot refer yourself");
        require(referralData[msg.sender].referrer == address(0), "Referrer already set");
        require(_referrer != address(0), "Invalid referrer address");
        require(!userStats[msg.sender].hasInvested, "Cannot set referrer after investing");
        
        referralData[msg.sender].referrer = _referrer;
        referralData[_referrer].totalReferrals++;
        userReferrals[_referrer].push(msg.sender);
    }
    
    function depositUSDT(uint256 amount) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(amount >= 10 * 10**18, "Minimum deposit is 10 USDT");
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
        userStats[msg.sender].totalInvested = userStats[msg.sender].totalInvested.add(amount);
        
        // Track weekly deposits for airdrop eligibility
        _updateWeeklyDeposits(msg.sender, amount);
        
        // Update volume for price calculation
        totalUsdtVolume = totalUsdtVolume.add(amount);
        _updateFarmPrice();
        
        emit Deposited(msg.sender, amount, fee, referrer);
    }
    
    function _updateWeeklyDeposits(address user, uint256 amount) internal {
        // Reset weekly tracking if a week has passed
        if (block.timestamp >= lastWeeklyAirdrop.add(7 days)) {
            _resetWeeklyTracking();
        }
        
        weeklyDepositAmount[user] = weeklyDepositAmount[user].add(amount);
        weeklyDepositTotal = weeklyDepositTotal.add(amount);
        
        // Check if user becomes eligible for airdrop
        if (weeklyDepositAmount[user] >= MIN_DEPOSIT_FOR_AIRDROP && !isEligibleForAirdrop[user]) {
            isEligibleForAirdrop[user] = true;
            airdropEligibleUsers.push(user);
        }
    }
    
    function _resetWeeklyTracking() internal {
        // Reset weekly deposit tracking
        for (uint256 i = 0; i < airdropEligibleUsers.length; i++) {
            address user = airdropEligibleUsers[i];
            weeklyDepositAmount[user] = 0;
            isEligibleForAirdrop[user] = false;
        }
        delete airdropEligibleUsers;
        weeklyDepositTotal = 0;
        lastWeeklyAirdrop = block.timestamp;
    }
    
    function withdrawUSDT(uint256 amount) external nonReentrant onlyInvested whenNotPaused {
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
    
    function startFarming(uint256 poolId, uint256 amount) external nonReentrant onlyInvested validPool(poolId) whenNotPaused {
        require(amount >= farmingPools[poolId].minDeposit, "Below minimum deposit");
        require(amount <= farmingPools[poolId].maxDeposit, "Above maximum deposit");
        require(userBalances[msg.sender] >= amount, "Insufficient game balance");
        
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
            farmTokensEarned: 0,
            active: true,
            completed: false
        });
        
        userFarmIds[msg.sender].push(farmId);
        userStats[msg.sender].activeFarms++;
        
        _updateFarmPrice();
        
        emit FarmStarted(msg.sender, farmId, poolId, amount);
    }
    
    function harvest(uint256 farmId) external nonReentrant whenNotPaused {
        UserFarm storage farm = userFarms[msg.sender][farmId];
        require(farm.active, "Farm not active");
        require(!farm.completed, "Farm already completed");
        
        uint256 reward = calculateReward(msg.sender, farmId);
        require(reward > 0, "No reward available");
        
        uint256 penalty = 0;
        uint256 netReward = reward;
        
        // Check for early harvest penalty (first week)
        if (block.timestamp < farm.startTime.add(EARLY_HARVEST_PERIOD)) {
            penalty = reward.mul(EARLY_HARVEST_PENALTY).div(BASIS_POINTS);
            netReward = reward.sub(penalty);
            
            // Send penalty to treasury as USDT equivalent
            uint256 currentPrice = getCurrentFarmPrice();
            uint256 penaltyUsdtValue = penalty.mul(currentPrice).div(PRICE_MULTIPLIER);
            if (penaltyUsdtValue > 0 && usdtToken.balanceOf(address(this)) >= penaltyUsdtValue) {
                usdtToken.transfer(treasuryWallet, penaltyUsdtValue);
            }
        }
        
        farm.lastHarvestTime = block.timestamp;
        farm.totalHarvested = farm.totalHarvested.add(netReward);
        farm.farmTokensEarned = farm.farmTokensEarned.add(netReward);
        userStats[msg.sender].totalHarvested = userStats[msg.sender].totalHarvested.add(netReward);
        
        // Check if farming period is complete
        if (block.timestamp >= farm.startTime.add(farmingPools[farm.poolId].duration.mul(1 days))) {
            _completeFarm(msg.sender, farmId);
        }
        
        emit Harvested(msg.sender, farmId, netReward, penalty);
    }
    
    function _completeFarm(address user, uint256 farmId) internal {
        UserFarm storage farm = userFarms[user][farmId];
        require(farm.active, "Farm not active");
        require(!farm.completed, "Farm already completed");
        
        // Return principal to user balance
        userBalances[user] = userBalances[user].add(farm.depositAmount);
        totalUsdtInPools = totalUsdtInPools.sub(farm.depositAmount);
        farmingPools[farm.poolId].totalDeposited = farmingPools[farm.poolId].totalDeposited.sub(farm.depositAmount);
        
        // Calculate and add completion bonus
        uint256 currentPrice = getCurrentFarmPrice();
        uint256 bonusUsdtValue = farm.depositAmount.mul(farmingPools[farm.poolId].completionBonusPercentage).div(BASIS_POINTS);
        uint256 bonusFarmTokens = bonusUsdtValue.mul(PRICE_MULTIPLIER).div(currentPrice);
        
        farm.farmTokensEarned = farm.farmTokensEarned.add(bonusFarmTokens);
        
        // Transfer all earned FARM tokens to user
        uint256 totalFarmTokens = farm.farmTokensEarned;
        farmToken.mint(user, totalFarmTokens);
        
        // Mark farm as completed and inactive
        farm.active = false;
        farm.completed = true;
        farm.farmTokensEarned = 0; // Reset to 0 as tokens are now transferred
        userStats[user].activeFarms--;
        
        _updateFarmPrice();
        
        emit FarmCompleted(user, farmId, totalFarmTokens);
    }
    
    function calculateReward(address user, uint256 farmId) public view returns (uint256) {
        UserFarm memory farm = userFarms[user][farmId];
        if (!farm.active || farm.completed) return 0;
        
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
    
    function swapFarmToUSDT(uint256 farmAmount) external nonReentrant whenNotPaused {
        require(farmAmount > 0, "Amount must be greater than 0");
        require(farmToken.balanceOf(msg.sender) >= farmAmount, "Insufficient FARM balance");
        
        uint256 currentPrice = getCurrentFarmPrice();
        uint256 grossUsdtAmount = farmAmount.mul(currentPrice).div(PRICE_MULTIPLIER);
        
        // Calculate swap fee
        uint256 swapFee = grossUsdtAmount.mul(SWAP_FEE).div(BASIS_POINTS);
        uint256 netUsdtAmount = grossUsdtAmount.sub(swapFee);
        
        // Ensure contract has enough USDT
        require(usdtToken.balanceOf(address(this)) >= grossUsdtAmount, "Insufficient contract USDT balance");
        
        // Burn the FARM tokens (remove from circulation)
        require(farmToken.transferFrom(msg.sender, address(this), farmAmount), "FARM transfer failed");
        farmToken.burn(farmAmount);
        
        // Send swap fee to treasury
        require(usdtToken.transfer(treasuryWallet, swapFee), "Fee transfer failed");
        
        // Add net amount to user's game balance
        userBalances[msg.sender] = userBalances[msg.sender].add(netUsdtAmount);
        
        // Update volume and price
        totalUsdtVolume = totalUsdtVolume.add(grossUsdtAmount);
        _updateFarmPrice();
        
        emit TokensSwapped(msg.sender, farmAmount, netUsdtAmount, swapFee);
        emit TokensBurned(farmAmount);
    }
    
    function processWeeklyAirdrop() external whenNotPaused {
        require(block.timestamp >= lastWeeklyAirdrop.add(7 days), "Weekly airdrop not ready");
        require(airdropEligibleUsers.length > 0, "No eligible users");
        require(weeklyDepositTotal > 0, "No deposits this week");
        
        uint256 totalAirdropAmount = weeklyDepositTotal.mul(WEEKLY_AIRDROP_PERCENTAGE).div(BASIS_POINTS);
        uint256 airdropPerUser = totalAirdropAmount.div(airdropEligibleUsers.length);
        
        // Convert USDT to FARM tokens at current price
        uint256 currentPrice = getCurrentFarmPrice();
        uint256 farmTokensPerUser = airdropPerUser.mul(PRICE_MULTIPLIER).div(currentPrice);
        
        // Distribute airdrop to eligible users
        for (uint256 i = 0; i < airdropEligibleUsers.length; i++) {
            address user = airdropEligibleUsers[i];
            farmToken.mint(user, farmTokensPerUser);
            emit AirdropClaimed(user, farmTokensPerUser);
        }
        
        emit WeeklyAirdrop(totalAirdropAmount, airdropEligibleUsers.length, block.timestamp);
        
        // Reset weekly tracking
        _resetWeeklyTracking();
    }
    
    function withdrawReferralEarnings() external nonReentrant whenNotPaused {
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
            emit PriceUpdated(newPrice, totalUsdtInPools, totalUsdtVolume);
        }
    }
    
    function calculateFarmPrice() public view returns (uint256) {
        if (totalUsdtVolume == 0) return baseFarmPrice;
        
        uint256 liquidityFactor = totalUsdtInPools.mul(PRICE_MULTIPLIER).div(1_000_000 * 10**18);
        uint256 volumeFactor = totalUsdtVolume.mul(priceImpactFactor).div(100_000 * 10**18);
        
        uint256 circulatingSupply = farmToken.totalSupply().sub(farmToken.balanceOf(address(this)));
        uint256 supplyFactor = circulatingSupply > 0 ? 
            (10_000_000 * 10**18).mul(PRICE_MULTIPLIER).div(circulatingSupply) : PRICE_MULTIPLIER;
        
        uint256 priceMultiplier = PRICE_MULTIPLIER
            .add(liquidityFactor.mul(5).div(10))
            .add(volumeFactor.mul(3).div(10));
        
        uint256 newPrice = baseFarmPrice.mul(priceMultiplier).div(PRICE_MULTIPLIER);
        return newPrice.mul(supplyFactor).div(PRICE_MULTIPLIER);
    }
    
    function getCurrentFarmPrice() public view returns (uint256) {
        return calculateFarmPrice();
    }
    
    function distributeDailyTokens() external whenNotPaused {
        require(block.timestamp >= lastDistributionTime.add(1 days), "Daily distribution already done");
        
        uint256 tokensToMint = DAILY_FARM_DISTRIBUTION;
        farmToken.mint(address(this), tokensToMint);
        
        lastDistributionTime = block.timestamp;
        totalDistributedToday = tokensToMint;
        
        emit DailyDistribution(tokensToMint, block.timestamp);
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
        uint256 totalHarvested,
        uint256 farmTokensEarned,
        bool completed,
        uint256 completionBonusPercentage
    ) {
        UserFarm memory farm = userFarms[user][farmId];
        return (
            farm.poolId,
            farm.depositAmount,
            farm.startTime,
            farm.lastHarvestTime,
            farm.active,
            calculateReward(user, farmId),
            farm.totalHarvested,
            farm.farmTokensEarned,
            farm.completed,
            farmingPools[farm.poolId].completionBonusPercentage
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
        uint256 weeklyDeposits,
        bool hasInvested,
        uint256 farmTokenBalance,
        uint256 usdtBalance
    ) {
        UserStats memory stats = userStats[user];
        return (
            stats.totalInvested,
            stats.totalHarvested,
            stats.activeFarms,
            weeklyDepositAmount[user],
            stats.hasInvested,
            farmToken.balanceOf(user),
            userBalances[user]
        );
    }
    
    function getPoolStats(uint256 poolId) external view returns (
        uint256 totalDeposited,
        uint256 dailyRewardPercentage,
        uint256 poolRewardPercentage,
        uint256 completionBonusPercentage,
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
            pool.completionBonusPercentage,
            pool.minDeposit,
            pool.maxDeposit,
            pool.duration,
            pool.active
        );
    }
    
    function getContractStats() external view returns (
        uint256 totalUsdtInPools,
        uint256 totalUsdtVolume,
        uint256 currentFarmPrice,
        uint256 totalFarmSupply,
        uint256 circulatingFarmSupply,
        uint256 totalBurned,
        uint256 dailyFarmDistribution
    ) {
        return (
            totalUsdtInPools,
            totalUsdtVolume,
            getCurrentFarmPrice(),
            farmToken.totalSupply(),
            farmToken.getCirculatingSupply(),
            farmToken.getTotalBurned(),
            DAILY_FARM_DISTRIBUTION
        );
    }
    
    function getWeeklyAirdropInfo() external view returns (
        uint256 weeklyDepositTotal,
        uint256 eligibleUsersCount,
        uint256 timeUntilNextAirdrop,
        bool isUserEligible
    ) {
        uint256 timeUntilNext = lastWeeklyAirdrop.add(7 days) > block.timestamp ? 
            lastWeeklyAirdrop.add(7 days).sub(block.timestamp) : 0;
            
        return (
            weeklyDepositTotal,
            airdropEligibleUsers.length,
            timeUntilNext,
            isEligibleForAirdrop[msg.sender]
        );
    }
    
    function getOwnerWithdrawalInfo() external view returns (
        uint256 totalWithdrawals,
        uint256 lastWithdrawal,
        uint256 contractBalance,
        uint256 availableForWithdrawal
    ) {
        uint256 contractBalance = usdtToken.balanceOf(address(this));
        
        // Calculate total user balances (funds that belong to users)
        uint256 totalUserFunds = 0;
        // Note: In a production environment, you'd need to track this more efficiently
        // This is a simplified calculation
        
        // Available for withdrawal = contract balance - total user obligations
        uint256 availableForWithdrawal = contractBalance > totalUsdtInPools ? 
            contractBalance.sub(totalUsdtInPools) : 0;
            
        return (
            totalOwnerWithdrawals,
            lastOwnerWithdrawal,
            contractBalance,
            availableForWithdrawal
        );
    }
    
    // Owner functions
    function updateTreasuryWallet(address _treasuryWallet) external onlyOwner {
        require(_treasuryWallet != address(0), "Invalid treasury wallet");
        treasuryWallet = _treasuryWallet;
    }
    
    function updatePriceImpactFactor(uint256 _priceImpactFactor) external onlyOwner {
        require(_priceImpactFactor <= 5000, "Price impact factor too high");
        priceImpactFactor = _priceImpactFactor;
    }
    
    function updatePoolStatus(uint256 poolId, bool active) external onlyOwner {
        require(poolId > 0 && poolId < nextPoolId, "Invalid pool ID");
        farmingPools[poolId].active = active;
    }
    
    function updatePoolCompletionBonus(uint256 poolId, uint256 completionBonusPercentage) external onlyOwner {
        require(poolId > 0 && poolId < nextPoolId, "Invalid pool ID");
        require(completionBonusPercentage <= 5000, "Bonus too high");
        farmingPools[poolId].completionBonusPercentage = completionBonusPercentage;
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Owner can withdraw USDT from the contract
     * @param amount Amount of USDT to withdraw
     * @notice This function allows the owner to withdraw excess USDT that is not allocated to active farms
     * Only withdraws funds that are not committed to user farming activities
     */
    function ownerWithdrawUSDT(uint256 amount) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 contractBalance = usdtToken.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient contract balance");
        
        // Ensure we don't withdraw funds that are committed to active farms
        // totalUsdtInPools represents USDT currently locked in active farming
        uint256 availableForWithdrawal = contractBalance > totalUsdtInPools ? 
            contractBalance.sub(totalUsdtInPools) : 0;
            
        require(availableForWithdrawal >= amount, "Cannot withdraw funds committed to active farms");
        
        // Update tracking
        totalOwnerWithdrawals = totalOwnerWithdrawals.add(amount);
        lastOwnerWithdrawal = block.timestamp;
        
        // Transfer USDT to owner
        require(usdtToken.transfer(owner(), amount), "Transfer failed");
        
        emit OwnerWithdrawal(owner(), amount, block.timestamp);
    }
    
    /**
     * @dev Emergency withdrawal function - withdraws all USDT to owner
     * @notice This is an emergency function that should only be used in critical situations
     * It withdraws all USDT regardless of active farms (use with extreme caution)
     */
    function emergencyWithdrawUSDT() external onlyOwner nonReentrant {
        uint256 balance = usdtToken.balanceOf(address(this));
        require(balance > 0, "No USDT to withdraw");
        
        // Update tracking
        totalOwnerWithdrawals = totalOwnerWithdrawals.add(balance);
        lastOwnerWithdrawal = block.timestamp;
        
        // Transfer all USDT to owner
        require(usdtToken.transfer(owner(), balance), "Transfer failed");
        
        emit EmergencyWithdrawal(owner(), balance, block.timestamp);
    }
    
    /**
     * @dev Get the maximum amount the owner can safely withdraw
     * @return The amount of USDT available for owner withdrawal without affecting active farms
     */
    function getMaxOwnerWithdrawal() external view returns (uint256) {
        uint256 contractBalance = usdtToken.balanceOf(address(this));
        
        if (contractBalance <= totalUsdtInPools) {
            return 0;
        }
        
        return contractBalance.sub(totalUsdtInPools);
    }
    
    /**
     * @dev Rescue tokens accidentally sent to the contract (except USDT and FARM)
     * @param token Address of the token to rescue
     * @param amount Amount of tokens to rescue
     */
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        require(token != address(usdtToken), "Cannot rescue USDT - use ownerWithdrawUSDT");
        require(token != address(farmToken), "Cannot rescue FARM tokens");
        require(token != address(0), "Invalid token address");
        
        IERC20(token).transfer(owner(), amount);
    }
}
