"use client"

// Game Economy Configuration
export const GAME_CONFIG = {
  // Revenue sharing
  ADMIN_REVENUE_SHARE: 0.15, // 15% of all transactions
  PLATFORM_FEE: 0.025, // 2.5% platform fee

  // Battle costs and rewards
  BATTLE_ENERGY_COST: 20,
  PVP_BATTLE_COST: 0.001, // ETH cost for PVP battles
  BATTLE_WIN_REWARD_MIN: 50,
  BATTLE_WIN_REWARD_MAX: 200,

  // Resource generation rates (per hour)
  RESOURCE_RATES: {
    sunflower: 5,
    crystal: 2,
    wood: 8,
    gold: 1,
  },

  // NFT minting costs
  MINT_COSTS: {
    common: 0.05,
    rare: 0.1,
    epic: 0.25,
    legendary: 0.5,
  },

  // Staking rewards (daily %)
  STAKING_DAILY_RATE: 0.001, // 0.1% daily = ~36.5% APY

  // Referral system
  REFERRAL_BONUS: 0.1, // 10% bonus for referrer
  REFEREE_BONUS: 0.05, // 5% bonus for new user

  // Swap rates (USDT to REALM)
  USDT_TO_REALM_RATE: 100, // 1 USDT = 100 REALM
  REALM_TO_USDT_RATE: 0.01, // 1 REALM = 0.01 USDT
  SWAP_FEE: 0.01, // 1% swap fee
}

export interface GameEconomyState {
  totalRevenue: number
  adminRevenue: number
  totalBattles: number
  totalSwaps: number
  totalStaked: number
  dailyActiveUsers: number
}

export class GameEconomy {
  private static instance: GameEconomy
  private state: GameEconomyState

  private constructor() {
    this.state = {
      totalRevenue: 0,
      adminRevenue: 0,
      totalBattles: 0,
      totalSwaps: 0,
      totalStaked: 0,
      dailyActiveUsers: 0,
    }
  }

  static getInstance(): GameEconomy {
    if (!GameEconomy.instance) {
      GameEconomy.instance = new GameEconomy()
    }
    return GameEconomy.instance
  }

  // Calculate admin revenue from transaction
  calculateAdminRevenue(amount: number): number {
    return amount * GAME_CONFIG.ADMIN_REVENUE_SHARE
  }

  // Process battle payment and revenue sharing
  processBattlePayment(amount: number): { adminRevenue: number; playerReward: number } {
    const adminRevenue = this.calculateAdminRevenue(amount)
    const playerReward = amount - adminRevenue

    this.state.totalRevenue += amount
    this.state.adminRevenue += adminRevenue
    this.state.totalBattles += 1

    return { adminRevenue, playerReward }
  }

  // Process swap transaction
  processSwap(amount: number): { adminFee: number; userAmount: number } {
    const adminFee = amount * GAME_CONFIG.SWAP_FEE
    const userAmount = amount - adminFee

    this.state.totalRevenue += adminFee
    this.state.adminRevenue += adminFee
    this.state.totalSwaps += 1

    return { adminFee, userAmount }
  }

  // Calculate staking rewards
  calculateStakingRewards(stakedAmount: number, days: number): number {
    return stakedAmount * GAME_CONFIG.STAKING_DAILY_RATE * days
  }

  // Process referral bonus
  processReferralBonus(amount: number): { referrerBonus: number; refereeBonus: number } {
    const referrerBonus = amount * GAME_CONFIG.REFERRAL_BONUS
    const refereeBonus = amount * GAME_CONFIG.REFEREE_BONUS

    return { referrerBonus, refereeBonus }
  }

  getState(): GameEconomyState {
    return { ...this.state }
  }

  updateDailyActiveUsers(count: number): void {
    this.state.dailyActiveUsers = count
  }
}
