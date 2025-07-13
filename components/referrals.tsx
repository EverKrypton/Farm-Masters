"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Users, Copy, Share2 } from "lucide-react"
import type { User as GameUser } from "@/lib/storage"

interface ReferralsProps {
  user: GameUser
}

export default function Referrals({ user }: ReferralsProps) {
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    totalEarned: 0,
    recentReferrals: [],
  })
  const [copied, setCopied] = useState(false)

  const referralLink = `https://t.me/your_bot_username?start=${user.referral_code}` // Replace 'your_bot_username'

  useEffect(() => {
    fetchReferralStats()
  }, [user.id])

  const fetchReferralStats = async () => {
    try {
      const response = await fetch(`/api/referrals?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setReferralStats(data)
      } else {
        console.error("Failed to fetch referral stats:", data.error)
      }
    } catch (error) {
      console.error("Referral stats fetch error:", error)
    }
  }

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
      }
    } catch (error) {
      console.error("Copy failed:", error)
    }
  }

  const shareReferralLink = () => {
    const shareText = `🎮 Join GameCoin and earn tokens! Use my referral code: ${user.referral_code}\n\n🎁 Get 1000 bonus points when you join!\n\n${referralLink}`

    if (window.Telegram?.WebApp) {
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`,
        "_blank",
      )
    }
  }

  return (
    <div className="space-y-4">
      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{referralStats.totalReferrals}</div>
            <div className="text-sm text-white/70">Friends Invited</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{referralStats.totalEarned.toLocaleString()}</div>
            <div className="text-sm text-white/70">Points Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Invite Friends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-white/70 text-sm mb-2 block">Your Referral Code</label>
            <div className="flex gap-2">
              <Input value={user.referral_code} readOnly className="bg-black/20 border-white/20 text-white" />
              <Button
                onClick={copyReferralLink}
                variant="outline"
                size="icon"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            {copied && <p className="text-green-400 text-xs mt-1">Copied to clipboard!</p>}
          </div>

          <div className="space-y-2">
            <Button onClick={shareReferralLink} className="w-full bg-green-600 hover:bg-green-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share Referral Link
            </Button>
            <Button
              onClick={copyReferralLink}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <div className="text-center text-white/70 text-sm">
            <p>🎁 You and your friend both get 1000 points!</p>
            <p>💰 Earn 1000 points for each successful referral</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      {referralStats.recentReferrals.length > 0 && (
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {referralStats.recentReferrals.map((referral: any, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-white">{referral.displayName}</span>
                  <span className="text-green-400">+1000</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
