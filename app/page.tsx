"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins, Sprout, ArrowUpDown, TrendingUp } from "lucide-react"
import WalletConnection from "./components/wallet-connection"
import FarmingPools from "./components/farming-pools"
import TokenSwap from "./components/token-swap"
import DepositWithdraw from "./components/deposit-withdraw"
import GameStats from "./components/game-stats"
import { useWallet } from "./hooks/use-wallet"
import { useGameData } from "./hooks/use-game-data"
import WelcomePage from "./components/welcome-page"

export default function FarmingGame() {
  const { isConnected, address, balance } = useWallet()
  const { gameStats, farmTokens, usdtBalance, loading } = useGameData()
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem("cryptofarm-visited")
    if (hasVisited && isConnected) {
      setShowWelcome(false)
    }
  }, [isConnected])

  const handleEnterGame = () => {
    localStorage.setItem("cryptofarm-visited", "true")
    setShowWelcome(false)
  }

  if (showWelcome || !isConnected) {
    return <WelcomePage onEnterGame={handleEnterGame} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CryptoFarm</h1>
              <p className="text-sm text-gray-600">BSC Farming Game</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Wallet className="w-4 h-4 mr-2" />
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Badge>
            <WalletConnection />
          </div>
        </div>

        {/* Game Stats Overview */}
        <GameStats farmTokens={farmTokens} usdtBalance={usdtBalance} gameStats={gameStats} loading={loading} />

        {/* Main Game Interface */}
        <Tabs defaultValue="farming" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="farming" className="flex items-center gap-2">
              <Sprout className="w-4 h-4" />
              Farming
            </TabsTrigger>
            <TabsTrigger value="swap" className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4" />
              Swap
            </TabsTrigger>
            <TabsTrigger value="deposit" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Deposit/Withdraw
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farming" className="mt-6">
            <FarmingPools />
          </TabsContent>

          <TabsContent value="swap" className="mt-6">
            <TokenSwap />
          </TabsContent>

          <TabsContent value="deposit" className="mt-6">
            <DepositWithdraw />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Farming History</CardTitle>
                  <CardDescription>Your farming performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Harvested</span>
                      <span className="font-semibold">{gameStats.totalHarvested} FARM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Farms</span>
                      <span className="font-semibold">{gameStats.activeFarms}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Invested</span>
                      <span className="font-semibold">{gameStats.totalInvested} USDT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your farming milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant={gameStats.totalHarvested >= 100 ? "default" : "secondary"}>First Harvest</Badge>
                      <span className="text-sm text-gray-600">Harvest 100 FARM tokens</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={gameStats.activeFarms >= 5 ? "default" : "secondary"}>Farm Master</Badge>
                      <span className="text-sm text-gray-600">Manage 5 active farms</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={gameStats.totalInvested >= 1000 ? "default" : "secondary"}>Big Investor</Badge>
                      <span className="text-sm text-gray-600">Invest 1000 USDT total</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
