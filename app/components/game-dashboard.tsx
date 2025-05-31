"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Coins, Sprout, ArrowUpDown, TrendingUp, Users } from "lucide-react"
import WalletConnection from "./wallet-connection"
import FarmingPools from "./farming-pools"
import TokenSwap from "./token-swap"
import DepositWithdraw from "./deposit-withdraw"
import GameStats from "./game-stats"
import ReferralSystem from "./referral-system"
import { useWallet } from "../hooks/use-wallet"
import { useGameData } from "../hooks/use-game-data"

export default function GameDashboard() {
  const { address } = useWallet()
  const { gameStats, farmTokens, usdtBalance, loading } = useGameData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
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

        {/* Game Stats Overview */}
        <GameStats farmTokens={farmTokens} usdtBalance={usdtBalance} gameStats={gameStats} loading={loading} />

        {/* Main Game Interface */}
        <Tabs defaultValue="farming" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
            <TabsTrigger value="farming" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Sprout className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Farming</span>
              <span className="sm:hidden">Farm</span>
            </TabsTrigger>
            <TabsTrigger value="swap" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Swap</span>
              <span className="sm:hidden">Swap</span>
            </TabsTrigger>
            <TabsTrigger value="deposit" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Deposit</span>
              <span className="sm:hidden">Dep</span>
            </TabsTrigger>
            <TabsTrigger value="referral" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Referral</span>
              <span className="sm:hidden">Ref</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Stats</span>
              <span className="sm:hidden">Stats</span>
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

          <TabsContent value="referral" className="mt-6">
            <ReferralSystem />
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
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Referral Earnings</span>
                      <span className="font-semibold">{gameStats.referralEarnings} USDT</span>
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
