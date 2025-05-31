"use client"

import { useState, useEffect } from "react"
import { useWallet } from "./use-wallet"
import { FarmingContract } from "../contracts/farming-contract"
import { useToast } from "@/hooks/use-toast"

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
  completionBonus: string
  completionBonusFarmTokens: number
  startTime: number
  farmTokensEarned: number
  completed: boolean
}

export function useFarming() {
  const { address, web3 } = useWallet()
  const { toast } = useToast()
  const [activeFarms, setActiveFarms] = useState<ActiveFarm[]>([])
  const [loading, setLoading] = useState(false)
  const [currentFarmPrice, setCurrentFarmPrice] = useState(0.0005)
  const [gameBalance, setGameBalance] = useState(0)

  useEffect(() => {
    if (address && web3) {
      loadActiveFarms()
      loadCurrentPrice()
      loadGameBalance()
    }
  }, [address, web3])

  const loadGameBalance = async () => {
    if (!address || !web3) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (isDeployed) {
        const balance = await contract.getUserBalance(address)
        setGameBalance(Number.parseFloat(balance))
      } else {
        setGameBalance(0)
      }
    } catch (error) {
      console.error("Error loading game balance:", error)
      setGameBalance(0)
    }
  }

  const loadCurrentPrice = async () => {
    if (!web3) return

    try {
      const contract = new FarmingContract(web3)
      const isDeployed = await contract.isContractDeployed()

      if (isDeployed) {
        const price = await contract.getCurrentFarmPrice()
        setCurrentFarmPrice(Number.parseFloat(price))
      } else {
        setCurrentFarmPrice(0.0005) // Default price
      }
    } catch (error) {
      console.error("Error loading current price:", error)
      setCurrentFarmPrice(0.0005)
    }
  }

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

          const completionBonusPercentage = Number(poolStats.completionBonusPercentage) / 100
          const depositAmount = Number.parseFloat(web3.utils.fromWei(farmDetails.depositAmount, "ether"))
          const bonusUsdtValue = (depositAmount * completionBonusPercentage) / 100
          const bonusFarmTokens = bonusUsdtValue / currentFarmPrice

          return {
            id: farmId,
            name: getFarmName(farmDetails.poolId),
            icon: getFarmIcon(farmDetails.poolId),
            rarity: getFarmRarity(farmDetails.poolId),
            deposited: depositAmount,
            progress: calculateProgress(farmDetails.startTime, Number(poolStats.duration)),
            timeLeft: calculateTimeLeft(farmDetails.startTime, Number(poolStats.duration)),
            expectedReward: Number.parseFloat(web3.utils.fromWei(farmDetails.pendingReward, "ether")),
            totalHarvested: Number.parseFloat(web3.utils.fromWei(farmDetails.totalHarvested, "ether")),
            completionBonus: `${completionBonusPercentage}%`,
            completionBonusFarmTokens: bonusFarmTokens,
            startTime: Number(farmDetails.startTime),
            farmTokensEarned: Number.parseFloat(web3.utils.fromWei(farmDetails.farmTokensEarned, "ether")),
            completed: farmDetails.completed,
          }
        }),
      )

      // Only show active farms that are not completed
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
      await loadCurrentPrice()
      await loadGameBalance()

      toast({
        title: "Farming Started!",
        description: `Successfully started farming ${amount} USDT in ${getFarmName(poolId)}`,
      })
    } catch (error) {
      console.error("Error planting crop:", error)
      toast({
        title: "Error Starting Farm",
        description: "There was an error starting your farm. Please try again.",
        variant: "destructive",
      })
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
      await loadCurrentPrice()
      await loadGameBalance()

      toast({
        title: "Harvest Successful!",
        description: "Your FARM tokens have been harvested and added to your wallet.",
      })
    } catch (error) {
      console.error("Error harvesting crop:", error)
      toast({
        title: "Error Harvesting",
        description: "There was an error harvesting your farm. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    activeFarms,
    loading,
    currentFarmPrice,
    gameBalance,
    plantCrop,
    harvestCrop,
    refreshFarms: loadActiveFarms,
    refreshBalance: loadGameBalance,
  }
}
