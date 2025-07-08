"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard } from "./animated-card"
import { useSound } from "./sound-manager"
import { motion } from "framer-motion"
import { ArrowUpDown, Coins, DollarSign, TrendingUp, Wallet, AlertTriangle } from "lucide-react"

interface MarketData {
  price: number
  volume24h: number
  priceChange24h: number
  lastUpdate: number
  totalSupply: number
  circulatingSupply: number
}

interface ServerSwapSystemProps {
  realmBalance: number
  usdtBalance: number
  canWithdraw: boolean
  marketData: MarketData | null
  onSwapUSDTToREALM: (amount: number) => void
  onSwapREALMToUSDT: (amount: number) => void
}

export function ServerSwapSystem({
  realmBalance,
  usdtBalance,
  canWithdraw,
  marketData,
  onSwapUSDTToREALM,
  onSwapREALMToUSDT,
}: ServerSwapSystemProps) {
  const [swapDirection, setSwapDirection] = useState<"usdt-to-realm" | "realm-to-usdt">("usdt-to-realm")
  const [inputAmount, setInputAmount] = useState("")
  const { playSound } = useSound()

  const currentPrice = marketData?.price || 0.01
  const swapFee = 0.01 // 1%

  const calculateOutput = (amount: number) => {
    if (swapDirection === "usdt-to-realm") {
      const afterFee = amount * (1 - swapFee)
      return afterFee / currentPrice
    } else {
      const usdtAmount = amount * currentPrice
      return usdtAmount * (1 - swapFee)
    }
  }

  const handleSwap = () => {
    const amount = Number.parseFloat(inputAmount)
    if (isNaN(amount) || amount <= 0) return

    if (!canWithdraw) {
      return
    }

    playSound("click")

    if (swapDirection === "usdt-to-realm") {
      onSwapUSDTToREALM(amount)
    } else {
      onSwapREALMToUSDT(amount)
    }

    setInputAmount("")
  }

  const toggleSwapDirection = () => {
    playSound("click")
    setSwapDirection((prev) => (prev === "usdt-to-realm" ? "realm-to-usdt" : "usdt-to-realm"))
    setInputAmount("")
  }

  const inputBalance = swapDirection === "usdt-to-realm" ? usdtBalance : realmBalance
  const outputAmount = inputAmount ? calculateOutput(Number.parseFloat(inputAmount)) : 0
  const fee = inputAmount ? Number.parseFloat(inputAmount) * swapFee : 0

  const priceChange = marketData?.priceChange24h || 0
  const priceChangeColor = priceChange >= 0 ? "text-green-400" : "text-red-400"
  const priceChangeIcon = priceChange >= 0 ? "↗" : "↘"

  return (
    <div className="space-y-6">
      {/* Market Info */}
      <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            REALM Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Current Price</p>
              <p className="text-white font-bold text-lg">${currentPrice.toFixed(6)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">24h Change</p>
              <p className={`font-bold text-lg ${priceChangeColor}`}>
                {priceChangeIcon} {Math.abs(priceChange).toFixed(2)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">24h Volume</p>
              <p className="text-white font-bold text-lg">${(marketData?.volume24h || 0).toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Circulating Supply</p>
              <p className="text-white font-bold text-lg">{(marketData?.circulatingSupply || 0).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Swap Interface */}
      <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <ArrowUpDown className="w-5 h-5 text-blue-400" />
            </motion.div>
            Token Swap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Withdrawal Warning */}
          {!canWithdraw && (
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-medium">Withdrawal Restricted</span>
              </div>
              <p className="text-yellow-400 text-sm">
                You must purchase an NFT or make a deposit to enable swapping and withdrawals.
              </p>
            </div>
          )}

          {/* Current Balances */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium text-sm">USDT</span>
              </div>
              <p className="text-green-400 font-bold">{usdtBalance.toFixed(4)}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium text-sm">REALM</span>
              </div>
              <p className="text-yellow-400 font-bold">{realmBalance.toFixed(2)}</p>
            </div>
          </div>

          {/* Swap Interface */}
          <div className="space-y-4">
            {/* From Token */}
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white">From</Label>
                <Badge className="bg-blue-600 text-white">
                  Balance: {inputBalance.toFixed(swapDirection === "usdt-to-realm" ? 4 : 2)}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  {swapDirection === "usdt-to-realm" ? (
                    <>
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">USDT</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">REALM</span>
                    </>
                  )}
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  className="bg-transparent border-none text-white text-lg font-bold flex-1 text-right"
                  disabled={!canWithdraw}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-400 text-sm">Available</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputAmount(inputBalance.toString())}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  disabled={!canWithdraw}
                >
                  MAX
                </Button>
              </div>
            </div>

            {/* Swap Direction Button */}
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSwapDirection}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2"
                disabled={!canWithdraw}
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To Token */}
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white">To</Label>
                <Badge className="bg-green-600 text-white">
                  Rate: 1 {swapDirection === "usdt-to-realm" ? "USDT" : "REALM"} ={" "}
                  {swapDirection === "usdt-to-realm" ? (1 / currentPrice).toFixed(2) : currentPrice.toFixed(6)}{" "}
                  {swapDirection === "usdt-to-realm" ? "REALM" : "USDT"}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                  {swapDirection === "realm-to-usdt" ? (
                    <>
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">USDT</span>
                    </>
                  ) : (
                    <>
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">REALM</span>
                    </>
                  )}
                </div>
                <div className="text-white text-lg font-bold flex-1 text-right">
                  {outputAmount.toFixed(swapDirection === "usdt-to-realm" ? 2 : 6)}
                </div>
              </div>
            </div>
          </div>

          {/* Swap Details */}
          {inputAmount && (
            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-white">
                  <span>Exchange Rate</span>
                  <span>
                    1 {swapDirection === "usdt-to-realm" ? "USDT" : "REALM"} ={" "}
                    {swapDirection === "usdt-to-realm" ? (1 / currentPrice).toFixed(2) : currentPrice.toFixed(6)}{" "}
                    {swapDirection === "usdt-to-realm" ? "REALM" : "USDT"}
                  </span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Swap Fee (1%)</span>
                  <span>
                    {fee.toFixed(swapDirection === "usdt-to-realm" ? 4 : 2)}{" "}
                    {swapDirection === "usdt-to-realm" ? "USDT" : "REALM"}
                  </span>
                </div>
                <div className="flex justify-between text-green-400 font-bold">
                  <span>You Receive</span>
                  <span>
                    {outputAmount.toFixed(swapDirection === "usdt-to-realm" ? 2 : 6)}{" "}
                    {swapDirection === "usdt-to-realm" ? "REALM" : "USDT"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={
              !canWithdraw ||
              !inputAmount ||
              Number.parseFloat(inputAmount) <= 0 ||
              Number.parseFloat(inputAmount) > inputBalance
            }
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {!canWithdraw ? "Purchase NFT to Enable" : "Swap Tokens"}
          </Button>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
