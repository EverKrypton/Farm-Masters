"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, TrendingUp, Sprout, DollarSign } from "lucide-react"

interface GameStatsProps {
  farmTokens: number
  usdtBalance: number
  gameStats: {
    totalHarvested: number
    activeFarms: number
    totalInvested: number
    dailyEarnings: number
    referralEarnings: number
  }
  contractStats?: {
    totalUsdtInPools: number
    currentFarmPrice: number
    totalFarmSupply: number
    dailyFarmDistribution: number
  }
  loading: boolean
}

export default function GameStats({
  farmTokens,
  usdtBalance,
  gameStats,
  contractStats = {
    totalUsdtInPools: 0,
    currentFarmPrice: 0,
    totalFarmSupply: 0,
    dailyFarmDistribution: 0,
  },
  loading,
}: GameStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* User Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FARM Tokens</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmTokens > 0 ? farmTokens.toFixed(2) : "N/A"}</div>
            <p className="text-xs text-muted-foreground">Your FARM balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">USDT Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usdtBalance > 0 ? usdtBalance.toFixed(2) : "N/A"}</div>
            <p className="text-xs text-muted-foreground">Available for farming</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Farms</CardTitle>
            <Sprout className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameStats.activeFarms > 0 ? gameStats.activeFarms : "N/A"}</div>
            <p className="text-xs text-muted-foreground">Currently growing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gameStats.dailyEarnings > 0 ? gameStats.dailyEarnings.toFixed(2) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">FARM tokens per day</p>
          </CardContent>
        </Card>
      </div>

      {/* Contract Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FARM Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${contractStats.currentFarmPrice > 0 ? contractStats.currentFarmPrice.toFixed(4) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Current FARM/USDT price</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total USDT in Pools</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractStats.totalUsdtInPools > 0 ? contractStats.totalUsdtInPools.toFixed(0) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Total liquidity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FARM Supply</CardTitle>
            <Coins className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractStats.totalFarmSupply > 0 ? (contractStats.totalFarmSupply / 1000000).toFixed(1) + "M" : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Total FARM tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Distribution</CardTitle>
            <Sprout className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractStats.dailyFarmDistribution > 0 ? contractStats.dailyFarmDistribution.toFixed(0) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">FARM tokens per day</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
