"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Coins, AlertCircle, TrendingUp } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSwap } from "../hooks/use-swap"

export default function TokenSwap() {
  const { swapTokens, getCurrentPrice, loading, farmTokenBalance, contractStats } = useSwap()
  const [farmAmount, setFarmAmount] = useState("")
  const [estimatedUSDT, setEstimatedUSDT] = useState("")

  const handleFarmAmountChange = (value: string) => {
    setFarmAmount(value)
    if (value && Number.parseFloat(value) > 0) {
      const currentPrice = getCurrentPrice()
      const grossUSDT = Number.parseFloat(value) * currentPrice
      const swapFee = grossUSDT * 0.01 // 1% swap fee
      const netUSDT = grossUSDT - swapFee
      setEstimatedUSDT(netUSDT.toFixed(6))
    } else {
      setEstimatedUSDT("")
    }
  }

  const handleSwap = async () => {
    if (!farmAmount || Number.parseFloat(farmAmount) <= 0) return
    await swapTokens(Number.parseFloat(farmAmount))
    setFarmAmount("")
    setEstimatedUSDT("")
  }

  const currentPrice = getCurrentPrice()
  const maxSwappable = farmTokenBalance

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5" />
            FARM to USDT Swap
          </CardTitle>
          <CardDescription>Convert your FARM tokens to USDT (tokens will be burned)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Current Price Info */}
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">Current FARM Price</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              ${currentPrice > 0 ? currentPrice.toFixed(6) : "N/A"} USDT
            </div>
            <div className="text-xs sm:text-sm text-blue-700 mt-1">
              Price updates based on supply, demand, and liquidity
            </div>
          </div>

          {/* From Token (FARM) */}
          <div className="space-y-2">
            <Label>From (FARM Tokens)</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={farmAmount}
                onChange={(e) => handleFarmAmountChange(e.target.value)}
                className="pr-16 sm:pr-20"
                max={maxSwappable}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-sm font-medium text-gray-600">FARM</span>
              </div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <span>Available: {maxSwappable.toFixed(2)} FARM</span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => handleFarmAmountChange(maxSwappable.toString())}
              >
                Use Max
              </Button>
            </div>
          </div>

          {/* To Token (USDT) */}
          <div className="space-y-2">
            <Label>To (USDT)</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={estimatedUSDT}
                readOnly
                className="pr-16 sm:pr-20 bg-gray-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-sm font-medium text-gray-600">USDT</span>
              </div>
            </div>
          </div>

          {/* Swap Details */}
          {farmAmount && Number.parseFloat(farmAmount) > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Gross USDT Amount</span>
                <span className="font-medium">{(Number.parseFloat(farmAmount) * currentPrice).toFixed(6)} USDT</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Swap Fee (1%)</span>
                <span className="font-medium text-orange-600">
                  -{(Number.parseFloat(farmAmount) * currentPrice * 0.01).toFixed(6)} USDT
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-t pt-2">
                <span className="text-gray-600 font-medium">Net USDT Received</span>
                <span className="font-bold text-green-600">{estimatedUSDT} USDT</span>
              </div>
            </div>
          )}

          {/* Important Alerts */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Important:</strong> FARM tokens will be permanently burned from circulation. 1% swap fee + $1 USDT
              withdrawal fee applies.
            </AlertDescription>
          </Alert>

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={loading || !farmAmount || Number.parseFloat(farmAmount) <= 0 || farmTokenBalance <= 0}
            className="w-full"
          >
            <Coins className="w-4 h-4 mr-2" />
            {loading ? "Swapping..." : "Swap & Burn FARM Tokens"}
          </Button>

          {/* Contract Stats */}
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">Token Economics</h4>
            <div className="text-xs sm:text-sm text-purple-700 space-y-1">
              <div className="flex justify-between">
                <span>Circulating Supply:</span>
                <span>{contractStats.circulatingFarmSupply.toLocaleString()} FARM</span>
              </div>
              <div className="flex justify-between">
                <span>Total Burned:</span>
                <span>{contractStats.totalBurned.toLocaleString()} FARM</span>
              </div>
              <div className="flex justify-between">
                <span>Total Volume:</span>
                <span>${contractStats.totalUsdtVolume.toLocaleString()} USDT</span>
              </div>
            </div>
          </div>

          {/* Swap Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Price is dynamic based on supply, demand, and liquidity</p>
            <p>• Swapped tokens are permanently burned from circulation</p>
            <p>• Higher volume and lower supply = higher FARM price</p>
            <p>• USDT goes to your internal balance for withdrawal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
