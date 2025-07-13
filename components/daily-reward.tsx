"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Clock } from "lucide-react"
import type { User as GameUser } from "@/lib/storage"

interface DailyRewardProps {
  user: GameUser
  onRewardClaimed: (points: number) => void
}

function calcRewardPoints(streak: number) {
  const base = 100
  const bonus = Math.min((streak + 1) * 50, 900)
  return base + bonus
}

export default function DailyReward({ user, onRewardClaimed }: DailyRewardProps) {
  const [canClaim, setCanClaim] = useState(false)
  const [timeUntilNext, setTimeUntilNext] = useState("")
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    checkClaimStatus()
    const interval = setInterval(checkClaimStatus, 1000)
    return () => clearInterval(interval)
  }, [user])

  const checkClaimStatus = () => {
    if (!user.last_daily_claim) {
      setCanClaim(true)
      return
    }

    const lastClaim = new Date(user.last_daily_claim)
    const now = new Date()
    const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60)

    if (hoursSinceLastClaim >= 24) {
      setCanClaim(true)
      setTimeUntilNext("")
    } else {
      setCanClaim(false)
      const nextClaimTime = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000)
      const timeLeft = nextClaimTime.getTime() - now.getTime()

      const hours = Math.floor(timeLeft / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

      setTimeUntilNext(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }
  }

  const claimReward = async () => {
    setClaiming(true)
    try {
      const response = await fetch("/api/daily-reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()
      if (data.success) {
        onRewardClaimed(data.pointsEarned)
        setCanClaim(false)

        // Show success feedback
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
        }
      } else {
        console.error("Claim reward failed:", data.error)
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
        }
      }
    } catch (error) {
      console.error("Claim reward error:", error)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
      }
    } finally {
      setClaiming(false)
    }
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
      <CardContent className="p-4 text-center">
        <Gift className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
        <h3 className="text-white font-semibold mb-2">Daily Reward</h3>

        {canClaim ? (
          <>
            <p className="text-white/70 text-sm mb-3">
              Claim your daily reward: {calcRewardPoints(user.daily_streak)} points
            </p>
            <p className="text-yellow-300 text-xs mb-3">Streak Day {user.daily_streak + 1}</p>
            <Button onClick={claimReward} disabled={claiming} className="bg-yellow-600 hover:bg-yellow-700 w-full">
              {claiming ? "Claiming..." : "Claim Reward"}
            </Button>
          </>
        ) : (
          <>
            <Clock className="w-6 h-6 mx-auto mb-2 text-white/50" />
            <p className="text-white/70 text-sm mb-2">Next reward in:</p>
            <div className="text-xl font-mono text-yellow-300">{timeUntilNext}</div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
