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
    dailyEarnings: 0,
    referralEarnings: 0,
  })
  const [farmTokens, setFarmTokens] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const [contractStats, setContractStats] = useState({
    totalUsdtInPools: 0,
    currentFarmPrice: 0,
    totalFarmSupply: 0,
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

      // Load user stats from smart contract
      const userStats = await contract.getUserStats(address)
      const referralData = await contract.getReferralData(address)
      const contractData = await contract.getContractStats()

      setGameStats({
        totalHarvested: Number.parseFloat(web3.utils.fromWei(userStats.totalHarvested, "ether")),
        activeFarms: Number(userStats.activeFarms),
        totalInvested: Number.parseFloat(web3.utils.fromWei(userStats.totalInvested, "ether")),
        dailyEarnings: await calculateDailyEarnings(contract, address),
        referralEarnings: Number.parseFloat(web3.utils.fromWei(referralData.totalEarnings, "ether")),
      })

      setFarmTokens(Number.parseFloat(web3.utils.fromWei(userStats.farmTokenBalance, "ether")))
      setUsdtBalance(Number.parseFloat(web3.utils.fromWei(userStats.usdtBalance, "ether")))

      setContractStats({
        totalUsdtInPools: Number.parseFloat(web3.utils.fromWei(contractData.totalUsdtInPools, "ether")),
        currentFarmPrice: Number.parseFloat(web3.utils.fromWei(contractData.currentFarmPrice, "ether")),
        totalFarmSupply: Number.parseFloat(web3.utils.fromWei(contractData.totalFarmSupply, "ether")),
        dailyFarmDistribution: Number.parseFloat(web3.utils.fromWei(contractData.dailyFarmDistribution, "ether")),
      })
    } catch (error) {
      console.error("Error loading game data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateDailyEarnings = async (contract: FarmingContract, userAddress: string) => {
    try {
      const userFarms = await contract.getUserFarms(userAddress)
      let totalDailyEarnings = 0

      for (const farmId of userFarms) {
        const farmDetails = await contract.getFarmDetails(userAddress, farmId)
        if (farmDetails.active) {
          // Calculate daily earnings based on pool and user's share
          const poolStats = await contract.getPoolStats(farmDetails.poolId)
          const dailyPoolReward = contractStats.dailyFarmDistribution * (Number(poolStats.poolRewardPercentage) / 10000)
          const userShare =
            Number.parseFloat(web3.utils.fromWei(farmDetails.depositAmount, "ether")) /
            Number.parseFloat(web3.utils.fromWei(poolStats.totalDeposited, "ether"))
          totalDailyEarnings += dailyPoolReward * userShare
        }
      }

      return totalDailyEarnings
    } catch (error) {
      console.error("Error calculating daily earnings:", error)
      return 0
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
