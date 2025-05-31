"use client"

export const FARMING_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000" // Replace with your deployed contract address
export const USDT_CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955" // USDT BEP20 on BSC
export const TREASURY_WALLET = "0x0000000000000000000000000000000000000000" // Replace with your treasury wallet

export const FARMING_CONTRACT_ABI = [
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
  {
    inputs: [{ internalType: "uint256", name: "farmAmount", type: "uint256" }],
    name: "swapFarmToUSDT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "distributeDailyTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
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
      { internalType: "uint256", name: "farmTokensEarned", type: "uint256" },
      { internalType: "uint256", name: "startTime", type: "uint256" },
      { internalType: "uint256", name: "lastHarvestTime", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
      { internalType: "uint256", name: "pendingReward", type: "uint256" },
      { internalType: "uint256", name: "totalHarvested", type: "uint256" },
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
      { internalType: "uint256", name: "totalFarmTokensEarned", type: "uint256" },
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
      { internalType: "uint256", name: "farmTokensPerUSDT", type: "uint256" },
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
      { internalType: "uint256", name: "totalUsdtVolume", type: "uint256" },
      { internalType: "uint256", name: "currentFarmPrice", type: "uint256" },
      { internalType: "uint256", name: "totalFarmSupply", type: "uint256" },
      { internalType: "uint256", name: "circulatingFarmSupply", type: "uint256" },
      { internalType: "uint256", name: "totalBurned", type: "uint256" },
      { internalType: "uint256", name: "dailyFarmDistribution", type: "uint256" },
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
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "userBalances",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "farmToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_treasuryWallet", type: "address" }],
    name: "updateTreasuryWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_priceImpactFactor", type: "uint256" }],
    name: "updatePriceImpactFactor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "poolId", type: "uint256" },
      { internalType: "bool", name: "active", type: "bool" },
    ],
    name: "updatePoolStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyUnpause",
    outputs: [],
    stateMutability: "nonpayable",
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
  {
    inputs: [],
    name: "getCirculatingSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalBurned",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

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

    try {
      const maxUint256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      await this.usdtContract.methods.approve(FARMING_CONTRACT_ADDRESS, maxUint256).send({ from: userAddress })
      return await this.contract.methods.depositUSDT(amountWei).send({ from: userAddress })
    } catch (error) {
      console.error("Error in depositUSDT:", error)
      throw error
    }
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

  async distributeDailyTokens(userAddress: string) {
    return await this.contract.methods.distributeDailyTokens().send({ from: userAddress })
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

  async isContractDeployed() {
    try {
      const code = await this.web3.eth.getCode(FARMING_CONTRACT_ADDRESS)
      return code !== "0x" && code !== "0x0"
    } catch (error) {
      console.error("Error checking if contract is deployed:", error)
      return false
    }
  }

  // Owner functions
  async updateTreasuryWallet(newTreasuryWallet: string, userAddress: string) {
    return await this.contract.methods.updateTreasuryWallet(newTreasuryWallet).send({ from: userAddress })
  }

  async updatePriceImpactFactor(factor: number, userAddress: string) {
    return await this.contract.methods.updatePriceImpactFactor(factor).send({ from: userAddress })
  }

  async updatePoolStatus(poolId: number, active: boolean, userAddress: string) {
    return await this.contract.methods.updatePoolStatus(poolId, active).send({ from: userAddress })
  }

  async emergencyWithdraw(userAddress: string) {
    return await this.contract.methods.emergencyWithdraw().send({ from: userAddress })
  }

  async emergencyPause(userAddress: string) {
    return await this.contract.methods.emergencyPause().send({ from: userAddress })
  }

  async emergencyUnpause(userAddress: string) {
    return await this.contract.methods.emergencyUnpause().send({ from: userAddress })
  }
}
