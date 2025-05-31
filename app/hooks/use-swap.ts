"use client"

import { useState } from "react"

export function useSwap() {
  const [loading, setLoading] = useState(false)

  // Mock exchange rates
  const exchangeRates = {
    "USDT-FARM": 1.25, // 1 USDT = 1.25 FARM
    "FARM-USDT": 0.8, // 1 FARM = 0.8 USDT
  }

  const getSwapRate = (fromToken: "USDT" | "FARM", toToken: "USDT" | "FARM") => {
    if (fromToken === toToken) return 1
    return exchangeRates[`${fromToken}-${toToken}` as keyof typeof exchangeRates] || 1
  }

  const swapTokens = async (fromToken: "USDT" | "FARM", toToken: "USDT" | "FARM", amount: number) => {
    setLoading(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const rate = getSwapRate(fromToken, toToken)
      const outputAmount = amount * rate

      console.log(`Swapped ${amount} ${fromToken} for ${outputAmount} ${toToken}`)
    } catch (error) {
      console.error("Error swapping tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    swapTokens,
    getSwapRate,
    loading,
  }
}
