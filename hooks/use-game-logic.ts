"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface PlayerStats {
  level: number
  experience: number
  maxExperience: number
  battlesWon: number
  nftsOwned: number
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
}

interface Quest {
  id: string
  name: string
  description: string
  progress: number
  target: number
  reward: number
  type: "battle" | "harvest" | "explore"
}

interface Resource {
  id: string
  name: string
  amount: number
  icon: string
  harvestRate: number
  lastHarvest: number
}

interface BattleResult {
  won: boolean
  experienceGained: number
  resourcesGained: Resource[]
  damage: number
}

export function useGameLogic() {
  const { toast } = useToast()

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 42,
    experience: 8750,
    maxExperience: 10000,
    battlesWon: 156,
    nftsOwned: 23,
    health: 85,
    maxHealth: 100,
    energy: 75,
    maxEnergy: 100,
  })

  const [activeQuests, setActiveQuests] = useState<Quest[]>([
    {
      id: "1",
      name: "Dragon Hunt",
      description: "Defeat 5 Fire Dragons",
      progress: 3,
      target: 5,
      reward: 500,
      type: "battle",
    },
    {
      id: "2",
      name: "Resource Gathering",
      description: "Collect 100 Sunflowers",
      progress: 87,
      target: 100,
      reward: 200,
      type: "harvest",
    },
    {
      id: "3",
      name: "Land Explorer",
      description: "Explore 10 new territories",
      progress: 6,
      target: 10,
      reward: 300,
      type: "explore",
    },
  ])

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "sunflower",
      name: "Sunflowers",
      amount: 245,
      icon: "🌻",
      harvestRate: 5,
      lastHarvest: Date.now(),
    },
    {
      id: "crystal",
      name: "Crystals",
      amount: 89,
      icon: "💎",
      harvestRate: 2,
      lastHarvest: Date.now(),
    },
    {
      id: "wood",
      name: "Wood",
      amount: 156,
      icon: "🪵",
      harvestRate: 8,
      lastHarvest: Date.now(),
    },
    {
      id: "gold",
      name: "Gold",
      amount: 34,
      icon: "🪙",
      harvestRate: 1,
      lastHarvest: Date.now(),
    },
  ])

  const [isBattling, setIsBattling] = useState(false)
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null)

  // Auto-regenerate energy and health
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerStats((prev) => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + 1),
        energy: Math.min(prev.maxEnergy, prev.energy + 2),
      }))
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Auto-harvest resources
  useEffect(() => {
    const interval = setInterval(() => {
      setResources((prev) =>
        prev.map((resource) => {
          const timeSinceLastHarvest = Date.now() - resource.lastHarvest
          const hoursElapsed = timeSinceLastHarvest / (1000 * 60 * 60)
          const newAmount = Math.floor(hoursElapsed * resource.harvestRate)

          if (newAmount > 0) {
            return {
              ...resource,
              amount: resource.amount + newAmount,
              lastHarvest: Date.now(),
            }
          }
          return resource
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const startBattle = useCallback(async () => {
    if (playerStats.energy < 20) {
      toast({
        title: "Not Enough Energy",
        description: "You need at least 20 energy to start a battle.",
        variant: "destructive",
      })
      return
    }

    setIsBattling(true)

    // Simulate battle duration
    setTimeout(() => {
      const won = Math.random() > 0.3 // 70% win rate
      const experienceGained = won ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 30) + 10
      const damage = Math.floor(Math.random() * 20) + 5

      const result: BattleResult = {
        won,
        experienceGained,
        resourcesGained: won
          ? [
              {
                id: "gold",
                name: "Gold",
                amount: Math.floor(Math.random() * 5) + 1,
                icon: "🪙",
                harvestRate: 1,
                lastHarvest: Date.now(),
              },
            ]
          : [],
        damage,
      }

      setBattleResult(result)
      setIsBattling(false)

      // Update player stats
      setPlayerStats((prev) => {
        const newExperience = prev.experience + experienceGained
        const levelUp = newExperience >= prev.maxExperience

        return {
          ...prev,
          experience: levelUp ? newExperience - prev.maxExperience : newExperience,
          level: levelUp ? prev.level + 1 : prev.level,
          maxExperience: levelUp ? prev.maxExperience + 1000 : prev.maxExperience,
          battlesWon: won ? prev.battlesWon + 1 : prev.battlesWon,
          health: Math.max(0, prev.health - damage),
          energy: prev.energy - 20,
        }
      })

      // Update quest progress
      if (won) {
        setActiveQuests((prev) =>
          prev.map((quest) =>
            quest.type === "battle" ? { ...quest, progress: Math.min(quest.target, quest.progress + 1) } : quest,
          ),
        )
      }

      // Update resources
      if (result.resourcesGained.length > 0) {
        setResources((prev) =>
          prev.map((resource) => {
            const gained = result.resourcesGained.find((r) => r.id === resource.id)
            return gained ? { ...resource, amount: resource.amount + gained.amount } : resource
          }),
        )
      }

      toast({
        title: won ? "Victory!" : "Defeat",
        description: won
          ? `You won the battle and gained ${experienceGained} XP!`
          : `You lost the battle but gained ${experienceGained} XP for trying.`,
        variant: won ? "default" : "destructive",
      })

      if (levelUp) {
        toast({
          title: "Level Up!",
          description: `Congratulations! You reached level ${playerStats.level + 1}!`,
        })
      }
    }, 3000)
  }, [playerStats.energy, toast])

  const harvestResources = useCallback(() => {
    if (playerStats.energy < 10) {
      toast({
        title: "Not Enough Energy",
        description: "You need at least 10 energy to harvest resources.",
        variant: "destructive",
      })
      return
    }

    const harvestedAmount = Math.floor(Math.random() * 10) + 5
    const resourceType = resources[Math.floor(Math.random() * resources.length)]

    setResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceType.id ? { ...resource, amount: resource.amount + harvestedAmount } : resource,
      ),
    )

    setPlayerStats((prev) => ({
      ...prev,
      energy: prev.energy - 10,
      experience: prev.experience + 25,
    }))

    // Update harvest quest progress
    setActiveQuests((prev) =>
      prev.map((quest) =>
        quest.type === "harvest"
          ? { ...quest, progress: Math.min(quest.target, quest.progress + harvestedAmount) }
          : quest,
      ),
    )

    toast({
      title: "Resources Harvested!",
      description: `You collected ${harvestedAmount} ${resourceType.name} and gained 25 XP!`,
    })
  }, [playerStats.energy, resources, toast])

  const completeQuest = useCallback(
    (questId: string) => {
      const quest = activeQuests.find((q) => q.id === questId)
      if (!quest || quest.progress < quest.target) return

      setPlayerStats((prev) => ({
        ...prev,
        experience: prev.experience + quest.reward,
      }))

      setActiveQuests((prev) => prev.filter((q) => q.id !== questId))

      toast({
        title: "Quest Completed!",
        description: `You completed "${quest.name}" and earned ${quest.reward} XP!`,
      })
    },
    [activeQuests, toast],
  )

  const levelUpNFT = useCallback(
    (nftId: string) => {
      // Simulate NFT level up
      toast({
        title: "NFT Leveled Up!",
        description: "Your NFT has gained new powers!",
      })
    },
    [toast],
  )

  return {
    playerStats,
    activeQuests,
    resources,
    isBattling,
    battleResult,
    startBattle,
    harvestResources,
    completeQuest,
    levelUpNFT,
  }
}
