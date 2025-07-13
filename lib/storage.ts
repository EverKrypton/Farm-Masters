import { put, list } from "@vercel/blob"

// --- Data Interfaces ---
export interface User {
  id: string
  telegram_id: number
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  wallet_address?: string | null
  total_points: number
  daily_streak: number
  last_daily_claim?: string | null
  referral_code: string
  referred_by?: string | null // User ID of referrer
  created_at: string
  updated_at: string
}

export interface DailyRewardEntry {
  id: string
  user_id: string
  points_earned: number
  streak_day: number
  claimed_at: string
}

export interface ReferralEntry {
  id: string
  referrer_id: string // User ID of referrer
  referred_id: string // User ID of referred user
  points_earned: number
  created_at: string
}

export interface TransactionEntry {
  id: string
  user_id: string
  type: "presale" | "stake" | "unstake" | "reward"
  ton_amount?: number | null
  token_amount?: number | null
  status: "pending" | "completed" | "failed"
  tx_hash?: string | null
  created_at: string
}

export interface StakingPositionEntry {
  id: string
  user_id: string
  ton_amount: number
  start_date: string
  last_reward_claim: string
  is_active: boolean
}

// --- Storage Configuration ---
const STORAGE_CONFIG = {
  users: "game_data/users.json",
  daily_rewards: "game_data/daily_rewards.json",
  referrals: "game_data/referrals.json",
  transactions: "game_data/transactions.json",
  staking_positions: "game_data/staking_positions.json",
}

// --- Generic Data Fetcher ---
export async function getData<T>(key: keyof typeof STORAGE_CONFIG): Promise<T[]> {
  try {
    const { blobs } = await list({ prefix: STORAGE_CONFIG[key] })

    if (blobs.length === 0) {
      // If file doesn't exist, return empty array and create it on first save
      return []
    }

    // Assuming only one file per key (e.g., users.json)
    const response = await fetch(blobs[0].url)
    if (!response.ok) {
      console.error(`Failed to fetch blob for ${key}: ${response.statusText}`)
      return []
    }
    const data = await response.json()
    return Array.isArray(data) ? data : [] // Ensure it's an array
  } catch (error) {
    console.error(`Error getting ${key} data:`, error)
    return []
  }
}

// --- Generic Data Saver ---
export async function saveData<T>(key: keyof typeof STORAGE_CONFIG, data: T[]): Promise<void> {
  try {
    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })

    await put(STORAGE_CONFIG[key], blob, {
      access: "public",
      addRandomSuffix: false, // We want to overwrite the same file
    })
  } catch (error) {
    console.error(`Error saving ${key} data:`, error)
    throw error
  }
}

// --- Utility Functions ---
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}
