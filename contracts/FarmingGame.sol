// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FarmToken is ERC20, Ownable {
    constructor() ERC20("Farm Token", "FARM") {}
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

contract FarmingGame is ReentrancyGuard, Ownable {
    IERC20 public immutable usdtToken;
    FarmToken public immutable farmToken;
    
    struct FarmingPool {
        uint256 minDeposit;
        uint256 maxDeposit;
        uint256 apy; // Annual percentage yield (in basis points, 1000 = 10%)
        uint256 duration; // Duration in seconds
        bool active;
    }
    
    struct UserFarm {
        uint256 poolId;
        uint256 depositAmount;
        uint256 startTime;
        uint256 lastHarvestTime;
        bool active;
    }
    
    mapping(uint256 => FarmingPool) public farmingPools;
    mapping(address => mapping(uint256 => UserFarm)) public userFarms;
    mapping(address => uint256[]) public userFarmIds;
    mapping(address => uint256) public userBalances;
    
    uint256 public nextPoolId = 1;
    uint256 public nextFarmId = 1;
    
    // Exchange rates (FARM per USDT)
    uint256 public farmToUsdtRate = 800; // 1 FARM = 0.8 USDT (in basis points)
    uint256 public usdtToFarmRate = 1250; // 1 USDT = 1.25 FARM (in basis points)
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event FarmStarted(address indexed user, uint256 farmId, uint256 poolId, uint256 amount);
    event Harvested(address indexed user, uint256 farmId, uint256 reward);
    event TokensSwapped(address indexed user, bool usdtToFarm, uint256 inputAmount, uint256 outputAmount);
    
    constructor(address _usdtToken) {
        usdtToken = IERC20(_usdtToken);
        farmToken = new FarmToken();
        
        // Initialize farming pools
        _createFarmingPool(10 * 10**18, 1000 * 10**18, 1200, 30 days); // Wheat Farm: 12% APY, 30 days
        _createFarmingPool(50 * 10**18, 5000 * 10**18, 1800, 45 days); // Corn Field: 18% APY, 45 days
        _createFarmingPool(100 * 10**18, 10000 * 10**18, 2500, 60 days); // Fruit Orchard: 25% APY, 60 days
        _createFarmingPool(500 * 10**18, 50000 * 10**18, 3500, 90 days); // Exotic Garden: 35% APY, 90 days
    }
    
    function _createFarmingPool(
        uint256 _minDeposit,
        uint256 _maxDeposit,
        uint256 _apy,
        uint256 _duration
    ) internal {
        farmingPools[nextPoolId] = FarmingPool({
            minDeposit: _minDeposit,
            maxDeposit: _maxDeposit,
            apy: _apy,
            duration: _duration,
            active: true
        });
        nextPoolId++;
    }
    
    function depositUSDT(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(usdtToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        userBalances[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }
    
    function withdrawUSDT(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] -= amount;
        require(usdtToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    function startFarming(uint256 poolId, uint256 amount) external nonReentrant {
        require(farmingPools[poolId].active, "Pool not active");
        require(amount >= farmingPools[poolId].minDeposit, "Below minimum deposit");
        require(amount <= farmingPools[poolId].maxDeposit, "Above maximum deposit");
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        
        userBalances[msg.sender] -= amount;
        
        uint256 farmId = nextFarmId++;
        userFarms[msg.sender][farmId] = UserFarm({
            poolId: poolId,
            depositAmount: amount,
            startTime: block.timestamp,
            lastHarvestTime: block.timestamp,
            active: true
        });
        
        userFarmIds[msg.sender].push(farmId);
        
        emit FarmStarted(msg.sender, farmId, poolId, amount);
    }
    
    function harvest(uint256 farmId) external nonReentrant {
        UserFarm storage farm = userFarms[msg.sender][farmId];
        require(farm.active, "Farm not active");
        
        uint256 reward = calculateReward(msg.sender, farmId);
        require(reward > 0, "No reward available");
        
        farm.lastHarvestTime = block.timestamp;
        
        // If farming period is complete, return principal and close farm
        if (block.timestamp >= farm.startTime + farmingPools[farm.poolId].duration) {
            userBalances[msg.sender] += farm.depositAmount;
            farm.active = false;
        }
        
        farmToken.mint(msg.sender, reward);
        emit Harvested(msg.sender, farmId, reward);
    }
    
    function calculateReward(address user, uint256 farmId) public view returns (uint256) {
        UserFarm memory farm = userFarms[user][farmId];
        if (!farm.active) return 0;
        
        FarmingPool memory pool = farmingPools[farm.poolId];
        uint256 timeElapsed = block.timestamp - farm.lastHarvestTime;
        
        // Calculate reward based on APY
        uint256 reward = (farm.depositAmount * pool.apy * timeElapsed) / (10000 * 365 days);
        return reward;
    }
    
    function swapUSDTToFarm(uint256 usdtAmount) external nonReentrant {
        require(usdtAmount > 0, "Amount must be greater than 0");
        require(userBalances[msg.sender] >= usdtAmount, "Insufficient USDT balance");
        
        uint256 farmAmount = (usdtAmount * usdtToFarmRate) / 1000;
        userBalances[msg.sender] -= usdtAmount;
        farmToken.mint(msg.sender, farmAmount);
        
        emit TokensSwapped(msg.sender, true, usdtAmount, farmAmount);
    }
    
    function swapFarmToUSDT(uint256 farmAmount) external nonReentrant {
        require(farmAmount > 0, "Amount must be greater than 0");
        require(farmToken.balanceOf(msg.sender) >= farmAmount, "Insufficient FARM balance");
        
        uint256 usdtAmount = (farmAmount * farmToUsdtRate) / 1000;
        require(usdtToken.balanceOf(address(this)) >= usdtAmount, "Insufficient contract USDT balance");
        
        farmToken.transferFrom(msg.sender, address(this), farmAmount);
        userBalances[msg.sender] += usdtAmount;
        
        emit TokensSwapped(msg.sender, false, farmAmount, usdtAmount);
    }
    
    function getUserFarms(address user) external view returns (uint256[] memory) {
        return userFarmIds[user];
    }
    
    function getFarmDetails(address user, uint256 farmId) external view returns (
        uint256 poolId,
        uint256 depositAmount,
        uint256 startTime,
        uint256 lastHarvestTime,
        bool active,
        uint256 pendingReward
    ) {
        UserFarm memory farm = userFarms[user][farmId];
        return (
            farm.poolId,
            farm.depositAmount,
            farm.startTime,
            farm.lastHarvestTime,
            farm.active,
            calculateReward(user, farmId)
        );
    }
    
    function updateExchangeRates(uint256 _farmToUsdtRate, uint256 _usdtToFarmRate) external onlyOwner {
        farmToUsdtRate = _farmToUsdtRate;
        usdtToFarmRate = _usdtToFarmRate;
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        usdtToken.transfer(owner(), balance);
    }
}
