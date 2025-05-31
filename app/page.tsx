"use client"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins, Sprout, ArrowUpDown, TrendingUp, Users, Gift } from "lucide-react"
import WalletConnection from "./components/wallet-connection"
import FarmingPools from "./components/farming-pools"
import TokenSwap from "./components/token-swap"
import DepositWithdraw from "./components/deposit-withdraw"
import GameStats from "./components/game-stats"
import WelcomePage from "./components/welcome-page"
import ContractStatus from "./components/contract-status"
import ReferralSystem from "./components/referral-system"
import WeeklyAirdrop from "./components/weekly-airdrop"
import { useWallet } from "./hooks/use-wallet"
import { useGameData } from "./hooks/use-game-data"

export default function FarmingGame() {
  const { isConnected, address } = useWallet()
  const { gameStats, farmTokens, usdtBalance, contractStats, loading } = useGameData()
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
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
      <div className="container mx-auto p-2 sm:p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CryptoFarm</h1>
              <p className="text-xs sm:text-sm text-gray-600">BSC Farming Game</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Badge variant="outline" className="px-2 py-1 text-xs sm:text-sm">
              <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <span className="sm:hidden">
                {address?.slice(0, 4)}...{address?.slice(-2)}
              </span>
            </Badge>
            <WalletConnection />
          </div>
        </div>

        {/* Contract Status */}
        <ContractStatus />

        {/* Game Stats Overview */}
        <GameStats
          farmTokens={farmTokens}
          usdtBalance={usdtBalance}
          gameStats={gameStats}
          contractStats={contractStats}
          loading={loading}
        />

        {/* Main Game Interface */}
        <Tabs defaultValue="farming" className="mt-4 sm:mt-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto">
            <TabsTrigger value="farming" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <Sprout className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Farm</span>
            </TabsTrigger>
            <TabsTrigger value="swap" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Swap</span>
            </TabsTrigger>
            <TabsTrigger value="deposit" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Deposit</span>
              <span className="sm:hidden">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="airdrop" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Airdrop</span>
              <span className="sm:hidden">Air</span>
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Referral</span>
              <span className="sm:hidden">Ref</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="farming" className="mt-4 sm:mt-6">
            <FarmingPools />
          </TabsContent>

          <TabsContent value="swap" className="mt-4 sm:mt-6">
            <TokenSwap />
          </TabsContent>

          <TabsContent value="deposit" className="mt-4 sm:mt-6">
            <DepositWithdraw />
          </TabsContent>

          <TabsContent value="airdrop" className="mt-4 sm:mt-6">
            <WeeklyAirdrop />
          </TabsContent>

          <TabsContent value="referral" className="mt-4 sm:mt-6">
            <ReferralSystem />
          </TabsContent>

          <TabsContent value="stats" className="mt-4 sm:mt-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Farming History</CardTitle>
                  <CardDescription>Your farming performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Referral Earnings</span>
                      <span className="font-semibold">{gameStats.referralEarnings} USDT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Achievements</CardTitle>
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
                    <div className="flex items-center gap-3">
                      <Badge variant={gameStats.referralEarnings >= 100 ? "default" : "secondary"}>Referral King</Badge>
                      <span className="text-sm text-gray-600">Earn 100 USDT from referrals</span>
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
