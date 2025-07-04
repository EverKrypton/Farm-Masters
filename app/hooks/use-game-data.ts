"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

export function useGameData() {
  const { address, web3 } = useWallet()
  const [gameStats, setGameStats] = useState({
    totalHarvested: 0,
    activeFarms: 0,
    totalInvested: 0,
    totalFarmTokensEarned: 0,
    dailyEarnings: 0,
    referralEarnings: 0,
  })
  const [farmTokens, setFarmTokens] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [contractStats, setContractStats] = useState({
    totalUsdtInPools: 0,
    totalUsdtVolume: 0,
    currentFarmPrice: 0,
    totalFarmSupply: 0,
    circulatingFarmSupply: 0,
    totalBurned: 0,
    dailyFarmDistribution: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (address && web3) {
      loadGameData()
    }
  }, [address, web3])

  const loadGameData = async () => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (!isDeployed) {
        setGameStats({
          totalHarvested: 0,
          activeFarms: 0,
          totalInvested: 0,
          totalFarmTokensEarned: 0,
          dailyEarnings: 0,
          referralEarnings: 0,
        })
        setFarmTokens(0)
        setUsdtBalance(0)
        setContractStats({
          totalUsdtInPools: 0,
          totalUsdtVolume: 0,
          currentFarmPrice: 0.0005, // Default initial price
          totalFarmSupply: 0,
          circulatingFarmSupply: 0,
          totalBurned: 0,
          dailyFarmDistribution: 0,
        })
        setLoading(false)
        return
      }

      try {
        const userStats = await contract.getUserStats(address)
        const referralData = await contract.getReferralData(address)
        const contractData = await contract.getContractStats()

        setGameStats({
          totalHarvested: Number.parseFloat(web3.utils.fromWei(userStats.totalHarvested, "ether")),
          activeFarms: Number(userStats.activeFarms),
          totalInvested: Number.parseFloat(web3.utils.fromWei(userStats.totalInvested, "ether")),
          totalFarmTokensEarned: Number.parseFloat(web3.utils.fromWei(userStats.totalFarmTokensEarned, "ether")),
          dailyEarnings: 0,
          referralEarnings: Number.parseFloat(web3.utils.fromWei(referralData.totalEarnings, "ether")),
        })

        setFarmTokens(Number.parseFloat(web3.utils.fromWei(userStats.farmTokenBalance, "ether")))
        setUsdtBalance(Number.parseFloat(web3.utils.fromWei(userStats.usdtBalance, "ether")))

        setContractStats({
          totalUsdtInPools: Number.parseFloat(web3.utils.fromWei(contractData.totalUsdtInPools, "ether")),
          totalUsdtVolume: Number.parseFloat(web3.utils.fromWei(contractData.totalUsdtVolume, "ether")),
          currentFarmPrice: Number.parseFloat(web3.utils.fromWei(contractData.currentFarmPrice, "ether")),
          totalFarmSupply: Number.parseFloat(web3.utils.fromWei(contractData.totalFarmSupply, "ether")),
          circulatingFarmSupply: Number.parseFloat(web3.utils.fromWei(contractData.circulatingFarmSupply, "ether")),
          totalBurned: Number.parseFloat(web3.utils.fromWei(contractData.totalBurned, "ether")),
          dailyFarmDistribution: Number.parseFloat(web3.utils.fromWei(contractData.dailyFarmDistribution, "ether")),
        })
      } catch (error) {
        console.error("Error loading data from contract:", error)
        setGameStats({
          totalHarvested: 0,
          activeFarms: 0,
          totalInvested: 0,
          totalFarmTokensEarned: 0,
          dailyEarnings: 0,
          referralEarnings: 0,
        })
        setFarmTokens(0)
        setUsdtBalance(0)
        setContractStats({
          totalUsdtInPools: 0,
          totalUsdtVolume: 0,
          currentFarmPrice: 0.0005,
          totalFarmSupply: 0,
          circulatingFarmSupply: 0,
          totalBurned: 0,
          dailyFarmDistribution: 0,
        })
      }
    } catch (error) {
      console.error("Error loading game data:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    gameStats,
    farmTokens,
    usdtBalance,
    contractStats,
    loading,
    refreshData: loadGameData,
  }
}
