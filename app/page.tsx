"use client"

import { useEffect, useState } from "react"
import { useTelegram } from "@/lib/telegram"
import { tonConnect } from "@/lib/ton-connect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Users, Trophy, Wallet, TrendingUp, Calendar, Share2, Zap } from "lucide-react"
import DailyReward from "@/components/daily-reward"
import Leaderboard from "@/components/leaderboard"
import Referrals from "@/components/referrals"
import PreSale from "@/components/presale"
import Staking from "@/components/staking"
import type { User as GameUser } from "@/lib/storage" // Alias to avoid conflict with Telegram.WebApp.User

export default function GameApp() {
  const { tg, user: telegramUser, startParam, ready, expand } = useTelegram()
  const [user, setUser] = useState<GameUser | null>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("home")

  // TGE Date - Set your actual TGE date
  const TGE_DATE = new Date("2025-12-31T00:00:00Z") // Example TGE date
  const timeUntilTGE = TGE_DATE.getTime() - new Date().getTime()
  const daysUntilTGE = Math.max(0, Math.ceil(timeUntilTGE / (1000 * 60 * 60 * 24)))

  useEffect(() => {
    if (tg) {
      ready()
      expand()
    }
  }, [tg, ready, expand])

  useEffect(() => {
    initializeUserAndWallet()
  }, [telegramUser, startParam])

  const initializeUserAndWallet = async () => {
    if (!telegramUser) {
      setLoading(false)
      return
    }

    try {
      // Initialize user
      const userResponse = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramData: {
            initData: tg?.initData || "",
            initDataUnsafe: { user: telegramUser, start_param: startParam },
          },
          referralCode: startParam,
        }),
      })

      const userData = await userResponse.json()
      if (userData.user) {
        setUser(userData.user)
      } else {
        console.error("Failed to initialize user:", userData.error)
      }

      // Initialize wallet
      const walletInfo = await tonConnect.getWallets()
      if (tonConnect.wallet) {
        setWallet(tonConnect.wallet)
      }
    } catch (error) {
      console.error("Initialization error:", error)
    } finally {
      setLoading(false)
    }
  }

  const connectWallet = async () => {
    try {
      const walletConnectionSource = {
        universalLink: "https://app.tonkeeper.com/ton-connect",
        bridgeUrl: "https://bridge.tonapi.io/bridge",
      }

      await tonConnect.connect(walletConnectionSource)
      setWallet(tonConnect.wallet)

      if (user && tonConnect.wallet) {
        // Update user's wallet address
        await fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            walletAddress: tonConnect.wallet.account.address,
          }),
        })
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
    }
  }

  const shareGame = () => {
    if (!user) return

    const shareUrl = `https://t.me/your_bot_username?start=${user.referral_code}` // Replace 'your_bot_username'
    const shareText = `🎮 Join GameCoin and earn tokens! Use my referral code: ${user.referral_code}\n\n🎁 Get 1000 bonus points when you join!\n\n${shareUrl}`

    if (tg) {
      // Telegram WebApp's MainButton is not ideal for direct sharing.
      // It's better to open a share link directly.
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
        "_blank",
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading GameCoin...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to GameCoin</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Please open this app through Telegram to continue</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      <div className="container mx-auto p-4 max-w-md">
        {/* Header */}
        <div className="text-center mb-6 text-white">
          <h1 className="text-3xl font-bold mb-2">🎮 GameCoin</h1>
          <div className="flex items-center justify-center gap-4 text-sm">
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              <Coins className="w-4 h-4 mr-1" />
              {user.total_points.toLocaleString()} Points
            </Badge>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              <Calendar className="w-4 h-4 mr-1" />
              TGE in {daysUntilTGE} days
            </Badge>
          </div>
        </div>

        {/* Wallet Connection */}
        {!wallet && (
          <Card className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-purple-300" />
              <p className="text-white mb-3">Connect your TON wallet to participate in pre-sale and staking</p>
              <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="home" className="text-xs">
              <Coins className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs">
              <Trophy className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="referrals" className="text-xs">
              <Users className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="presale" className="text-xs">
              <TrendingUp className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="staking" className="text-xs">
              <Zap className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4 mt-4">
            {/* Daily Reward */}
            <DailyReward
              user={user}
              onRewardClaimed={(points) => {
                setUser((prev) => (prev ? { ...prev, total_points: prev.total_points + points } : null))
              }}
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{user.daily_streak}</div>
                  <div className="text-sm text-white/70">Day Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">#{user.total_points > 0 ? "???" : "N/A"}</div>
                  <div className="text-sm text-white/70">Global Rank</div>
                </CardContent>
              </Card>
            </div>

            {/* Share Button */}
            <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Share2 className="w-8 h-8 mx-auto mb-2 text-green-300" />
                <h3 className="text-white font-semibold mb-2">Invite Friends</h3>
                <p className="text-white/70 text-sm mb-3">Get 1000 points for each friend you invite!</p>
                <Button onClick={shareGame} className="bg-green-600 hover:bg-green-700 w-full">
                  Share Game
                </Button>
              </CardContent>
            </Card>

            {/* TGE Countdown */}
            <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-300" />
                <h3 className="text-white font-semibold mb-2">Token Generation Event</h3>
                <div className="text-2xl font-bold text-orange-400 mb-1">{daysUntilTGE}</div>
                <div className="text-sm text-white/70">Days Remaining</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Leaderboard userId={user.id} />
          </TabsContent>

          <TabsContent value="referrals" className="mt-4">
            <Referrals user={user} />
          </TabsContent>

          <TabsContent value="presale" className="mt-4">
            <PreSale user={user} wallet={wallet} />
          </TabsContent>

          <TabsContent value="staking" className="mt-4">
            <Staking user={user} wallet={wallet} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
