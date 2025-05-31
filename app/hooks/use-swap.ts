"use client"

import { useState } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

export function useSwap() {
  const { address, web3 } = useWallet()
  const [loading, setLoading] = useState(false)

  // Mock exchange rates - these would come from the smart contract
  const exchangeRates = {
    "USDT-FARM": 1.25, // 1 USDT = 1.25 FARM
    "FARM-USDT": 0.8, // 1 FARM = 0.8 USDT
  }

  const getSwapRate = (fromToken: "USDT" | "FARM", toToken: "USDT" | "FARM") => {
    if (fromToken === toToken) return 1
    return exchangeRates[`${fromToken}-${toToken}` as keyof typeof exchangeRates] || 1
  }

  const swapTokens = async (fromToken: "USDT" | "FARM", toToken: "USDT" | "FARM", amount: number) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)

      if (fromToken === "FARM" && toToken === "USDT") {
        await contract.swapFarmToUSDT(amount, address)
      } else if (fromToken === "USDT" && toToken === "FARM") {
        // This would be implemented in the contract if needed
        console.log(`Swapping ${amount} USDT to FARM`)
      }

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
