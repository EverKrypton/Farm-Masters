"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"

interface ActiveFarm {
  id: number
  name: string
  icon: string
  rarity: string
  deposited: number
  progress: number
  timeLeft: number
  expectedReward: number
  totalHarvested: number
}

export function useFarming() {
  const { address, web3 } = useWallet()
  const [activeFarms, setActiveFarms] = useState<ActiveFarm[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address && web3) {
      loadActiveFarms()
    }
  }, [address, web3])

  const loadActiveFarms = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (!isDeployed) {
        setActiveFarms([])
        return
      }

      const farmIds = await contract.getUserFarms(address)

      const farms = await Promise.all(
        farmIds.map(async (farmId: number) => {
          const farmDetails = await contract.getFarmDetails(address, farmId)
          const poolStats = await contract.getPoolStats(farmDetails.poolId)

          return {
            id: farmId,
            name: getFarmName(farmDetails.poolId),
            icon: getFarmIcon(farmDetails.poolId),
            rarity: getFarmRarity(farmDetails.poolId),
            deposited: Number.parseFloat(web3.utils.fromWei(farmDetails.depositAmount, "ether")),
            progress: calculateProgress(farmDetails.startTime, Number(poolStats.duration)),
            timeLeft: calculateTimeLeft(farmDetails.startTime, Number(poolStats.duration)),
            expectedReward: Number.parseFloat(web3.utils.fromWei(farmDetails.pendingReward, "ether")),
            totalHarvested: Number.parseFloat(web3.utils.fromWei(farmDetails.totalHarvested, "ether")),
          }
        }),
      )

      setActiveFarms(farms.filter((farm) => farm.progress < 100 || farm.expectedReward > 0))
    } catch (error) {
      console.error("Error loading active farms:", error)
      setActiveFarms([])
    }
  }

  const getFarmName = (poolId: number) => {
    const names = ["", "Starter Farm", "Growth Farm", "Premium Farm", "Whale Farm"]
    return names[poolId] || "Unknown Farm"
  }

  const getFarmIcon = (poolId: number) => {
    const icons = ["", "🌱", "🌾", "🌽", "🌺"]
    return icons[poolId] || "🌱"
  }

  const getFarmRarity = (poolId: number) => {
    const rarities = ["", "Common", "Uncommon", "Rare", "Legendary"]
    return rarities[poolId] || "Common"
  }

  const calculateProgress = (startTime: number, durationDays: number) => {
    const duration = durationDays * 24 * 60 * 60
    const elapsed = Date.now() / 1000 - startTime
    return Math.min(100, (elapsed / duration) * 100)
  }

  const calculateTimeLeft = (startTime: number, durationDays: number) => {
    const duration = durationDays * 24 * 60 * 60
    const elapsed = Date.now() / 1000 - startTime
    const remaining = duration - elapsed
    return Math.max(0, Math.ceil(remaining / (24 * 60 * 60)))
  }

  const plantCrop = async (poolId: number, amount: number) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.startFarming(poolId, amount, address)
      await loadActiveFarms()
    } catch (error) {
      console.error("Error planting crop:", error)
    } finally {
      setLoading(false)
    }
  }

  const harvestCrop = async (farmId: number) => {
    if (!address || !web3) return

    setLoading(true)
    try {
      const contract = new FarmingContract(web3)
      await contract.harvestFarm(farmId, address)
      await loadActiveFarms()
    } catch (error) {
      console.error("Error harvesting crop:", error)
    } finally {
      setLoading(false)
    }
  }

  return {
    activeFarms,
    loading,
    plantCrop,
    harvestCrop,
    refreshFarms: loadActiveFarms,
  }
}
