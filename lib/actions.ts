"use server"

import {
  getData,
  saveData,
  generateId,
  generateReferralCode,
  type User,
  type DailyRewardEntry,
  type ReferralEntry,
  type TransactionEntry,
  type StakingPositionEntry,
} from "./storage"
import { revalidatePath } from "next/cache"

const PRESALE_RATE = 1000 // 1000 tokens per 1 TON
const MIN_PRESALE_PURCHASE = 0.1 // Minimum 0.1 TON
const STAKING_APY = 0.12 // 12% APY
const MIN_STAKE = 1 // Minimum 1 TON

// --- User Actions ---
export async function initializeUser(telegramUser: any, startParam?: string | null) {
  try {
    const users = await getData<User>("users")

    // Check if user exists
    const user = users.find((u) => u.telegram_id === telegramUser.id)

    if (user) {
      // Update last active time
      user.updated_at = new Date().toISOString()
      await saveData("users", users)
      return { success: true, user }
    }

    // Handle referral
    let referredByUserId: string | null = null
    if (startParam) {
      const referrer = users.find((u) => u.referral_code === startParam)
      if (referrer) {
        referredByUserId = referrer.id
      }
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      telegram_id: telegramUser.id,
      username: telegramUser.username || null,
      first_name: telegramUser.first_name || null,
      last_name: telegramUser.last_name || null,
      wallet_address: null,
      total_points: 0,
      daily_streak: 0,
      last_daily_claim: null,
      referral_code: generateReferralCode(),
      referred_by: referredByUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    users.push(newUser)
    await saveData("users", users)

    // If user was referred, create referral record and give points
    if (referredByUserId) {
      const referrals = await getData<ReferralEntry>("referrals")
      referrals.push({
        id: generateId(),
        referrer_id: referredByUserId,
        referred_id: newUser.id,
        points_earned: 1000, // Referral bonus
        created_at: new Date().toISOString(),
      })
      await saveData("referrals", referrals)

      // Give referral bonus to referrer
      const referrerIndex = users.findIndex((u) => u.id === referredByUserId)
      if (referrerIndex !== -1) {
        users[referrerIndex].total_points += 1000
        users[referrerIndex].updated_at = new Date().toISOString()
        await saveData("users", users) // Save users again after updating referrer points
      }
    }

    revalidatePath("/")
    return { success: true, user: newUser }
  } catch (error) {
    console.error("User initialization error:", error)
    return { success: false, error: "Failed to initialize user" }
  }
}

export async function updateUserWallet(userId: string, walletAddress: string) {
  try {
    const users = await getData<User>("users")
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return { success: false, error: "User not found" }
    }

    users[userIndex].wallet_address = walletAddress
    users[userIndex].updated_at = new Date().toISOString()
    await saveData("users", users)

    revalidatePath("/")
    return { success: true, user: users[userIndex] }
  } catch (error) {
    console.error("User wallet update error:", error)
    return { success: false, error: "Failed to update wallet" }
  }
}

// --- Daily Reward Actions ---
export async function claimDailyReward(userId: string) {
  try {
    const users = await getData<User>("users")
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return { success: false, error: "User not found" }
    }

    const user = users[userIndex]
    const now = new Date()
    const lastClaim = user.last_daily_claim ? new Date(user.last_daily_claim) : null

    // Check if user can claim (24 hours since last claim)
    if (lastClaim) {
      const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60)
      if (hoursSinceLastClaim < 24) {
        const nextClaimTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000)
        return {
          success: false,
          error: "Already claimed today",
          nextClaimTime: nextClaimTime.toISOString(),
        }
      }
    }

    // Calculate new streak
    let newStreak = 1
    if (lastClaim) {
      const daysSinceLastClaim = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceLastClaim === 1) {
        newStreak = user.daily_streak + 1
      }
    }

    // Calculate points based on streak (base 100 + 50 per streak day, max 1000)
    const basePoints = 100
    const streakBonus = Math.min(newStreak * 50, 900)
    const totalPointsEarned = basePoints + streakBonus

    // Update user
    user.daily_streak = newStreak
    user.last_daily_claim = now.toISOString()
    user.total_points += totalPointsEarned
    user.updated_at = now.toISOString()
    await saveData("users", users)

    // Record the reward
    const dailyRewards = await getData<DailyRewardEntry>("daily_rewards")
    dailyRewards.push({
      id: generateId(),
      user_id: userId,
      points_earned: totalPointsEarned,
      streak_day: newStreak,
      claimed_at: now.toISOString(),
    })
    await saveData("daily_rewards", dailyRewards)

    revalidatePath("/")
    return {
      success: true,
      pointsEarned: totalPointsEarned,
      newStreak,
      nextClaimTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    }
  } catch (error) {
    console.error("Daily reward error:", error)
    return { success: false, error: "Failed to claim daily reward" }
  }
}

// --- Leaderboard Actions ---
export async function getLeaderboard(currentUserId?: string) {
  try {
    const users = await getData<User>("users")

    const sortedUsers = users
      .sort((a, b) => b.total_points - a.total_points)
      .map((user, index) => ({
        id: user.id,
        displayName: user.username || user.first_name || "Anonymous",
        total_points: user.total_points,
        rank: index + 1,
      }))

    let userRank = null
    if (currentUserId) {
      const currentUserEntry = sortedUsers.find((u) => u.id === currentUserId)
      if (currentUserEntry) {
        userRank = currentUserEntry.rank
      }
    }

    return { success: true, leaderboard: sortedUsers.slice(0, 100), userRank }
  } catch (error) {
    console.error("Leaderboard fetch error:", error)
    return { success: false, error: "Failed to fetch leaderboard", leaderboard: [], userRank: null }
  }
}

// --- Referral Actions ---
export async function getReferralStats(userId: string) {
  try {
    const referrals = await getData<ReferralEntry>("referrals")
    const users = await getData<User>("users")

    const userReferrals = referrals.filter((ref) => ref.referrer_id === userId)

    const totalReferrals = userReferrals.length
    const totalEarned = userReferrals.reduce((sum, ref) => sum + ref.points_earned, 0)

    const recentReferrals = userReferrals.slice(0, 10).map((ref) => {
      const referredUser = users.find((u) => u.id === ref.referred_id)
      return {
        displayName: referredUser?.username || referredUser?.first_name || "Anonymous",
        createdAt: ref.created_at,
      }
    })

    return { success: true, totalReferrals, totalEarned, recentReferrals }
  } catch (error) {
    console.error("Referral stats fetch error:", error)
    return {
      success: false,
      error: "Failed to fetch referral stats",
      totalReferrals: 0,
      totalEarned: 0,
      recentReferrals: [],
    }
  }
}

// --- Pre-sale Actions ---
export async function handlePresalePurchase(userId: string, tonAmount: number, txHash: string) {
  try {
    if (tonAmount < MIN_PRESALE_PURCHASE) {
      return { success: false, error: `Minimum purchase is ${MIN_PRESALE_PURCHASE} TON` }
    }

    const tokenAmount = tonAmount * PRESALE_RATE

    const transactions = await getData<TransactionEntry>("transactions")
    transactions.push({
      id: generateId(),
      user_id: userId,
      type: "presale",
      ton_amount: tonAmount,
      token_amount: tokenAmount,
      tx_hash: txHash,
      status: "completed",
      created_at: new Date().toISOString(),
    })
    await saveData("transactions", transactions)

    // Add bonus points for presale participation
    const users = await getData<User>("users")
    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      const bonusPoints = Math.floor(tonAmount * 500) // 500 points per TON
      users[userIndex].total_points += bonusPoints
      users[userIndex].updated_at = new Date().toISOString()
      await saveData("users", users)
      revalidatePath("/")
      return { success: true, tokenAmount, bonusPoints }
    }

    return { success: true, tokenAmount, bonusPoints: 0 }
  } catch (error) {
    console.error("Presale purchase error:", error)
    return { success: false, error: "Failed to process presale purchase" }
  }
}

export async function getUserPresaleInvestments(userId: string) {
  try {
    const transactions = await getData<TransactionEntry>("transactions")
    const userPresaleTransactions = transactions.filter(
      (tx) => tx.user_id === userId && tx.type === "presale" && tx.status === "completed",
    )

    const totalInvested = userPresaleTransactions.reduce((sum, tx) => sum + (tx.ton_amount || 0), 0)
    const totalTokens = userPresaleTransactions.reduce((sum, tx) => sum + (tx.token_amount || 0), 0)

    return { success: true, transactions: userPresaleTransactions, totalInvested, totalTokens }
  } catch (error) {
    console.error("User presale investments fetch error:", error)
    return { success: false, error: "Failed to fetch investments", transactions: [], totalInvested: 0, totalTokens: 0 }
  }
}

// --- Staking Actions ---
export async function handleStakingAction(
  userId: string,
  action: "stake" | "unstake",
  amount?: number,
  positionId?: string,
  txHash?: string,
) {
  try {
    const users = await getData<User>("users")
    const transactions = await getData<TransactionEntry>("transactions")
    const stakingPositions = await getData<StakingPositionEntry>("staking_positions")

    if (action === "stake") {
      if (!amount || amount < MIN_STAKE) {
        return { success: false, error: `Minimum stake is ${MIN_STAKE} TON` }
      }

      const newPosition: StakingPositionEntry = {
        id: generateId(),
        user_id: userId,
        ton_amount: amount,
        start_date: new Date().toISOString(),
        last_reward_claim: new Date().toISOString(),
        is_active: true,
      }
      stakingPositions.push(newPosition)
      await saveData("staking_positions", stakingPositions)

      transactions.push({
        id: generateId(),
        user_id: userId,
        type: "stake",
        ton_amount: amount,
        tx_hash: txHash,
        status: "completed",
        created_at: new Date().toISOString(),
      })
      await saveData("transactions", transactions)

      revalidatePath("/")
      return { success: true, position: newPosition }
    } else if (action === "unstake") {
      if (!positionId) {
        return { success: false, error: "Position ID is required for unstake" }
      }

      const positionIndex = stakingPositions.findIndex(
        (pos) => pos.id === positionId && pos.user_id === userId && pos.is_active,
      )
      if (positionIndex === -1) {
        return { success: false, error: "Staking position not found or not active" }
      }

      const position = stakingPositions[positionIndex]
      const stakingDays = Math.floor(
        (new Date().getTime() - new Date(position.start_date).getTime()) / (1000 * 60 * 60 * 24),
      )
      const rewards = (position.ton_amount * STAKING_APY * stakingDays) / 365

      // Deactivate position
      stakingPositions[positionIndex].is_active = false
      await saveData("staking_positions", stakingPositions)

      transactions.push({
        id: generateId(),
        user_id: userId,
        type: "unstake",
        ton_amount: position.ton_amount + rewards, // Total returned amount
        tx_hash: txHash,
        status: "completed",
        created_at: new Date().toISOString(),
      })
      await saveData("transactions", transactions)

      revalidatePath("/")
      return { success: true, originalAmount: position.ton_amount, rewards, totalAmount: position.ton_amount + rewards }
    }
    return { success: false, error: "Invalid staking action" }
  } catch (error) {
    console.error("Staking action error:", error)
    return { success: false, error: "Failed to perform staking action" }
  }
}

export async function getUserStakingData(userId: string) {
  try {
    const stakingPositions = await getData<StakingPositionEntry>("staking_positions")
    const userActivePositions = stakingPositions.filter((pos) => pos.user_id === userId && pos.is_active)

    const totalStaked = userActivePositions.reduce((sum, pos) => sum + pos.ton_amount, 0)

    const totalRewards = userActivePositions.reduce((sum, pos) => {
      const stakingDays = Math.floor(
        (new Date().getTime() - new Date(pos.start_date).getTime()) / (1000 * 60 * 60 * 24),
      )
      return sum + (pos.ton_amount * STAKING_APY * stakingDays) / 365
    }, 0)

    return { success: true, positions: userActivePositions, totalStaked, totalRewards, apy: STAKING_APY }
  } catch (error) {
    console.error("User staking data fetch error:", error)
    return {
      success: false,
      error: "Failed to fetch staking data",
      positions: [],
      totalStaked: 0,
      totalRewards: 0,
      apy: STAKING_APY,
    }
  }
}

// Helper to calculate reward points for daily claim
export async function calculateDailyRewardPoints(currentStreak: number) {
  const basePoints = 100
  const streakBonus = Math.min((currentStreak + 1) * 50, 900)
  return basePoints + streakBonus
}
