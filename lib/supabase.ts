import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          telegram_id: number
          username: string | null
          first_name: string | null
          last_name: string | null
          wallet_address: string | null
          total_points: number
          daily_streak: number
          last_daily_claim: string | null
          referral_code: string | null
          referred_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          telegram_id: number
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          wallet_address?: string | null
          referred_by?: string | null
        }
        Update: {
          wallet_address?: string | null
          total_points?: number
          daily_streak?: number
          last_daily_claim?: string | null
        }
      }
      daily_rewards: {
        Row: {
          id: string
          user_id: string
          points_earned: number
          streak_day: number
          claimed_at: string
        }
        Insert: {
          user_id: string
          points_earned: number
          streak_day: number
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          points_earned: number
          created_at: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: "presale" | "stake" | "unstake" | "reward"
          ton_amount: number | null
          token_amount: number | null
          status: "pending" | "completed" | "failed"
          tx_hash: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          type: "presale" | "stake" | "unstake" | "reward"
          ton_amount?: number | null
          token_amount?: number | null
          tx_hash?: string | null
        }
      }
      staking_positions: {
        Row: {
          id: string
          user_id: string
          ton_amount: number
          start_date: string
          last_reward_claim: string
          is_active: boolean
        }
        Insert: {
          user_id: string
          ton_amount: number
        }
      }
    }
  }
}
