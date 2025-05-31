"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Coins } from "lucide-react"
import { useSwap } from "../hooks/use-swap"

export default function TokenSwap() {
  const { swapTokens, getSwapRate, loading } = useSwap()
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState<"USDT" | "FARM">("USDT")
  const [toToken, setToToken] = useState<"USDT" | "FARM">("FARM")

  const handleSwapDirection = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && Number.parseFloat(value) > 0) {
      const rate = getSwapRate(fromToken, toToken)
      setToAmount((Number.parseFloat(value) * rate).toFixed(6))
    } else {
      setToAmount("")
    }
  }

  const handleSwap = async () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) return
    await swapTokens(fromToken, toToken, Number.parseFloat(fromAmount))
    setFromAmount("")
    setToAmount("")
  }

  const swapRate = getSwapRate(fromToken, toToken)

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            Token Swap
          </CardTitle>
          <CardDescription>Exchange between USDT and FARM tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* From Token */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-sm font-medium text-gray-600">{fromToken}</span>
              </div>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={handleSwapDirection} className="rounded-full">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label>To</Label>
            <div className="relative">
              <Input type="number" placeholder="0.0" value={toAmount} readOnly className="pr-20 bg-gray-50" />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="text-sm font-medium text-gray-600">{toToken}</span>
              </div>
            </div>
          </div>

          {/* Swap Rate */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-medium">
                1 {fromToken} = {swapRate} {toToken}
              </span>
            </div>
          </div>

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={loading || !fromAmount || Number.parseFloat(fromAmount) <= 0}
            className="w-full"
          >
            <Coins className="w-4 h-4 mr-2" />
            {loading ? "Swapping..." : "Swap Tokens"}
          </Button>

          {/* Swap Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• FARM tokens are earned through farming activities</p>
            <p>• USDT can be used to start new farming pools</p>
            <p>• Exchange rates are dynamic based on supply and demand</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
