"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

export function useSwap() {
  const { address, web3 } = useWallet()
  const [loading, setLoading] = useState(false)
  const [farmTokenBalance, setFarmTokenBalance] = useState(0)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [contractStats, setContractStats] = useState({
    circulatingFarmSupply: 0,
    totalBurned: 0,
    totalUsdtVolume: 0,
  })

  useEffect(() => {
    if (address && web3) {
      loadSwapData()
    }
  }, [address, web3])

  const loadSwapData = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (!isDeployed) {
        setFarmTokenBalance(0)
        setCurrentPrice(0.0005) // Default price
        setContractStats({
          circulatingFarmSupply: 0,
          totalBurned: 0,
          totalUsdtVolume: 0,
        })
        return
      }

      const [farmBalance, price, stats] = await Promise.all([
        contract.getFarmTokenBalance(address),
        contract.getCurrentFarmPrice(),
        contract.getContractStats(),
      ])

      setFarmTokenBalance(Number.parseFloat(farmBalance))
      setCurrentPrice(Number.parseFloat(price))
      setContractStats({
        circulatingFarmSupply: Number.parseFloat(web3.utils.fromWei(stats.circulatingFarmSupply, "ether")),
        totalBurned: Number.parseFloat(web3.utils.fromWei(stats.totalBurned, "ether")),
        totalUsdtVolume: Number.parseFloat(web3.utils.fromWei(stats.totalUsdtVolume, "ether")),
      })
    } catch (error) {
      console.error("Error loading swap data:", error)
      setFarmTokenBalance(0)
      setCurrentPrice(0.0005)
      setContractStats({
        circulatingFarmSupply: 0,
        totalBurned: 0,
        totalUsdtVolume: 0,
      })
    }
  }

  const getCurrentPrice = () => {
    return currentPrice
  }

  const swapTokens = async (farmAmount: number) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.swapFarmToUSDT(farmAmount, address)

      // Refresh data after swap
      await loadSwapData()

      console.log(`Swapped ${farmAmount} FARM tokens for USDT`)
    } catch (error) {
      console.error("Error swapping tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    swapTokens,
    getCurrentPrice,
    loading,
    farmTokenBalance,
    contractStats,
    refreshData: loadSwapData,
  }
}
