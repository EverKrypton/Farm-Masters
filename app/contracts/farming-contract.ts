"use client"

// Smart Contract addresses and ABIs
export const FARMING_CONTRACT_ADDRESS = "0x..." // Your deployed contract address
export const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955" // USDT BEP20 on BSC
export const TREASURY_WALLET = "0x..." // Treasury wallet address

export const FARMING_CONTRACT_ABI = [
  // Deposit and Withdraw functions
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "depositUSDT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "withdrawUSDT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Farming functions
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "startFarming",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "farmId", type: "uint256" }],
    name: "harvest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Referral functions
  {
    inputs: [{ internalType: "address", name: "referrer", type: "address" }],
    name: "setReferrer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawReferralEarnings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // View functions
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserFarms",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "farmId", type: "uint256" },
    ],
    name: "getFarmDetails",
    outputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "uint256", name: "depositAmount", type: "uint256" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "lastHarvestTime", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
      { internalType: "uint256", name: "pendingReward", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getReferralData",
    outputs: [
      { internalType: "address", name: "referrer", type: "address" },
      { internalType: "uint256", name: "totalReferrals", type: "uint256" },
      { internalType: "uint256", name: "totalEarnings", type: "uint256" },
      { internalType: "uint256", name: "availableEarnings", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserStats",
    outputs: [
      { internalType: "uint256", name: "totalInvested", type: "uint256" },
      { internalType: "uint256", name: "totalHarvested", type: "uint256" },
      { internalType: "uint256", name: "activeFarms", type: "uint256" },
      { internalType: "bool", name: "hasInvested", type: "bool" },
      { internalType: "uint256", name: "farmTokenBalance", type: "uint256" },
      { internalType: "uint256", name: "usdtBalance", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "poolId", type: "uint256" }],
    name: "getPoolStats",
    outputs: [
      { internalType: "uint256", name: "totalDeposited", type: "uint256" },
      { internalType: "uint256", name: "dailyRewardPercentage", type: "uint256" },
      { internalType: "uint256", name: "poolRewardPercentage", type: "uint256" },
      { internalType: "uint256", name: "minDeposit", type: "uint256" },
      { internalType: "uint256", name: "maxDeposit", type: "uint256" },
      { internalType: "uint256", name: "duration", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractStats",
    outputs: [
      { internalType: "uint256", name: "totalUsdtInPools", type: "uint256" },
      { internalType: "uint256", name: "currentFarmPrice", type: "uint256" },
      { internalType: "uint256", name: "totalFarmSupply", type: "uint256" },
      { internalType: "uint256", name: "dailyFarmDistribution", type: "uint256" },
      { internalType: "uint256", name: "totalUsers", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentFarmPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

export const USDT_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

export const FARM_TOKEN_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
]

// Web3 interaction class
export class FarmingContract {
  private web3: any
  private contract: any
  private usdtContract: any
  private farmTokenContract: any

  constructor(web3: any) {
    this.web3 = web3
    this.contract = new web3.eth.Contract(FARMING_CONTRACT_ABI, FARMING_CONTRACT_ADDRESS)
    this.usdtContract = new web3.eth.Contract(USDT_CONTRACT_ABI, USDT_CONTRACT_ADDRESS)
  }

  async depositUSDT(amount: number, userAddress: string) {
    const amountWei = this.web3.utils.toWei(amount.toString(), "ether")

    // First approve USDT spending
    await this.usdtContract.methods.approve(FARMING_CONTRACT_ADDRESS, amountWei).send({ from: userAddress })

    // Then deposit to farming contract
    return await this.contract.methods.depositUSDT(amountWei).send({ from: userAddress })
  }

  async withdrawUSDT(amount: number, userAddress: string) {
    const amountWei = this.web3.utils.toWei(amount.toString(), "ether")
    return await this.contract.methods.withdrawUSDT(amountWei).send({ from: userAddress })
  }

  async startFarming(poolId: number, amount: number, userAddress: string) {
    const amountWei = this.web3.utils.toWei(amount.toString(), "ether")
    return await this.contract.methods.startFarming(poolId, amountWei).send({ from: userAddress })
  }

  async harvestFarm(farmId: number, userAddress: string) {
    return await this.contract.methods.harvest(farmId).send({ from: userAddress })
  }

  async setReferrer(referrerAddress: string, userAddress: string) {
    return await this.contract.methods.setReferrer(referrerAddress).send({ from: userAddress })
  }

  async withdrawReferralEarnings(userAddress: string) {
    return await this.contract.methods.withdrawReferralEarnings().send({ from: userAddress })
  }

  async swapFarmToUSDT(farmAmount: number, userAddress: string) {
    const amountWei = this.web3.utils.toWei(farmAmount.toString(), "ether")
    return await this.contract.methods.swapFarmToUSDT(amountWei).send({ from: userAddress })
  }

  // View functions
  async getUserFarms(userAddress: string) {
    return await this.contract.methods.getUserFarms(userAddress).call()
  }

  async getFarmDetails(userAddress: string, farmId: number) {
    return await this.contract.methods.getFarmDetails(userAddress, farmId).call()
  }

  async getReferralData(userAddress: string) {
    return await this.contract.methods.getReferralData(userAddress).call()
  }

  async getUSDTBalance(userAddress: string) {
    const balance = await this.usdtContract.methods.balanceOf(userAddress).call()
    return this.web3.utils.fromWei(balance, "ether")
  }

  async getUserBalance(userAddress: string) {
    const balance = await this.contract.methods.userBalances(userAddress).call()
    return this.web3.utils.fromWei(balance, "ether")
  }

  async getFarmTokenBalance(userAddress: string) {
    const farmTokenAddress = await this.contract.methods.farmToken().call()
    this.farmTokenContract = new this.web3.eth.Contract(FARM_TOKEN_ABI, farmTokenAddress)
    const balance = await this.farmTokenContract.methods.balanceOf(userAddress).call()
    return this.web3.utils.fromWei(balance, "ether")
  }

  async getUserTotalInvested(userAddress: string) {
    // This would need to be implemented in the smart contract
    return 500 // Mock data
  }

  async getUserDailyEarnings(userAddress: string) {
    // This would need to be implemented in the smart contract
    return 12.5 // Mock data
  }

  async getUserStats(userAddress: string) {
    return await this.contract.methods.getUserStats(userAddress).call()
  }

  async getPoolStats(poolId: number) {
    return await this.contract.methods.getPoolStats(poolId).call()
  }

  async getContractStats() {
    return await this.contract.methods.getContractStats().call()
  }

  async getCurrentFarmPrice() {
    const price = await this.contract.methods.getCurrentFarmPrice().call()
    return this.web3.utils.fromWei(price, "ether")
  }
}
