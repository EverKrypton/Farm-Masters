"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { GameEconomy, GAME_CONFIG } from "@/lib/game-economy"

interface PlayerStats {
  level: number
  experience: number
  maxExperience: number
  battlesWon: number
  battlesLost: number
  nftsOwned: number
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
  realmBalance: number
  usdtBalance: number
  stakedAmount: number
  stakingRewards: number
  referralCode: string
  referredBy: string
  totalEarnings: number
}

interface Resource {
  id: string
  name: string
  amount: number
  icon: string
  harvestRate: number
  lastHarvest: number
  value: number // REALM value per unit
}

interface Quest {
  id: string
  name: string
  description: string
  progress: number
  target: number
  reward: number
  realmReward: number
  type: "battle" | "harvest" | "explore" | "pvp"
  completed: boolean
}

interface BattleResult {
  won: boolean
  experienceGained: number
  realmEarned: number
  resourcesGained: Resource[]
  damage: number
  opponent?: string
}

interface PVPMatch {
  id: string
  player1: string
  player2: string
  wager: number
  status: "waiting" | "active" | "completed"
  winner?: string
  createdAt: number
}

export function useRealGameLogic() {
  const { toast } = useToast()
  const { account, isConnected } = useWeb3()
  const gameEconomy = GameEconomy.getInstance()

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    experience: 0,
    maxExperience: 1000,
    battlesWon: 0,
    battlesLost: 0,
    nftsOwned: 0,
    health: 100,
    maxHealth: 100,
    energy: 100,
    maxEnergy: 100,
    realmBalance: 1000, // Starting balance
    usdtBalance: 0,
    stakedAmount: 0,
    stakingRewards: 0,
    referralCode: "",
    referredBy: "",
    totalEarnings: 0,
  })

  const [resources, setResources] = useState<Resource[]>([
    {
      id: "sunflower",
      name: "Sunflowers",
      amount: 0,
      icon: "🌻",
      harvestRate: GAME_CONFIG.RESOURCE_RATES.sunflower,
      lastHarvest: Date.now(),
      value: 2, // 2 REALM per sunflower
    },
    {
      id: "crystal",
      name: "Crystals",
      amount: 0,
      icon: "💎",
      harvestRate: GAME_CONFIG.RESOURCE_RATES.crystal,
      lastHarvest: Date.now(),
      value: 10, // 10 REALM per crystal
    },
    {
      id: "wood",
      name: "Wood",
      amount: 0,
      icon: "🪵",
      harvestRate: GAME_CONFIG.RESOURCE_RATES.wood,
      lastHarvest: Date.now(),
      value: 1, // 1 REALM per wood
    },
    {
      id: "gold",
      name: "Gold",
      amount: 0,
      icon: "🪙",
      harvestRate: GAME_CONFIG.RESOURCE_RATES.gold,
      lastHarvest: Date.now(),
      value: 50, // 50 REALM per gold
    },
  ])

  const [activeQuests, setActiveQuests] = useState<Quest[]>([
    {
      id: "1",
      name: "First Victory",
      description: "Win your first battle",
      progress: 0,
      target: 1,
      reward: 100,
      realmReward: 50,
      type: "battle",
      completed: false,
    },
    {
      id: "2",
      name: "Resource Collector",
      description: "Harvest 100 resources",
      progress: 0,
      target: 100,
      reward: 200,
      realmReward: 100,
      type: "harvest",
      completed: false,
    },
    {
      id: "3",
      name: "PVP Champion",
      description: "Win 5 PVP battles",
      progress: 0,
      target: 5,
      reward: 500,
      realmReward: 250,
      type: "pvp",
      completed: false,
    },
  ])

  const [pvpMatches, setPvpMatches] = useState<PVPMatch[]>([])
  const [isBattling, setIsBattling] = useState(false)

  // Generate referral code
  useEffect(() => {
    if (account && !playerStats.referralCode) {
      const code = account.slice(2, 8).toUpperCase()
      setPlayerStats((prev) => ({ ...prev, referralCode: code }))
    }
  }, [account])

  // Auto-regenerate energy and health
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerStats((prev) => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + 2),
        energy: Math.min(prev.maxEnergy, prev.energy + 5),
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

  // Calculate and distribute staking rewards
  useEffect(() => {
    if (playerStats.stakedAmount > 0) {
      const interval = setInterval(
        () => {
          const dailyReward = gameEconomy.calculateStakingRewards(playerStats.stakedAmount, 1)
          setPlayerStats((prev) => ({
            ...prev,
            stakingRewards: prev.stakingRewards + dailyReward,
            totalEarnings: prev.totalEarnings + dailyReward,
          }))
        },
        24 * 60 * 60 * 1000,
      ) // Daily

      return () => clearInterval(interval)
    }
  }, [playerStats.stakedAmount])

  const startBattle = useCallback(
    async (isPVP = false, opponent?: string, wager = 0) => {
      if (playerStats.energy < GAME_CONFIG.BATTLE_ENERGY_COST) {
        toast({
          title: "Not Enough Energy",
          description: `You need at least ${GAME_CONFIG.BATTLE_ENERGY_COST} energy to battle.`,
          variant: "destructive",
        })
        return
      }

      if (isPVP && playerStats.realmBalance < wager) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough REALM tokens for this wager.",
          variant: "destructive",
        })
        return
      }

      setIsBattling(true)

      // Simulate battle duration
      setTimeout(() => {
        const won = Math.random() > 0.4 // 60% win rate
        const experienceGained = won ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 30) + 10
        const damage = Math.floor(Math.random() * 20) + 5

        let realmEarned = 0
        if (won) {
          if (isPVP) {
            realmEarned = wager * 2 // Winner takes all
            const { adminRevenue } = gameEconomy.processBattlePayment(wager * 2)
            realmEarned -= adminRevenue
          } else {
            realmEarned =
              Math.floor(Math.random() * (GAME_CONFIG.BATTLE_WIN_REWARD_MAX - GAME_CONFIG.BATTLE_WIN_REWARD_MIN)) +
              GAME_CONFIG.BATTLE_WIN_REWARD_MIN
          }
        }

        const result: BattleResult = {
          won,
          experienceGained,
          realmEarned,
          resourcesGained: won
            ? [
                {
                  id: "gold",
                  name: "Gold",
                  amount: Math.floor(Math.random() * 3) + 1,
                  icon: "🪙",
                  harvestRate: 1,
                  lastHarvest: Date.now(),
                  value: 50,
                },
              ]
            : [],
          damage,
          opponent,
        }

        setIsBattling(false)

        // Update player stats
        setPlayerStats((prev) => {
          const newExperience = prev.experience + experienceGained
          const levelUp = newExperience >= prev.maxExperience
          const newLevel = levelUp ? prev.level + 1 : prev.level

          return {
            ...prev,
            experience: levelUp ? newExperience - prev.maxExperience : newExperience,
            level: newLevel,
            maxExperience: levelUp ? prev.maxExperience + 1000 : prev.maxExperience,
            battlesWon: won ? prev.battlesWon + 1 : prev.battlesWon,
            battlesLost: !won ? prev.battlesLost + 1 : prev.battlesLost,
            health: Math.max(0, prev.health - damage),
            energy: prev.energy - GAME_CONFIG.BATTLE_ENERGY_COST,
            realmBalance: prev.realmBalance + realmEarned - (isPVP && !won ? wager : 0),
            totalEarnings: prev.totalEarnings + realmEarned,
          }
        })

        // Update quest progress
        setActiveQuests((prev) =>
          prev.map((quest) => {
            if (quest.type === "battle" && won) {
              return { ...quest, progress: Math.min(quest.target, quest.progress + 1) }
            }
            if (quest.type === "pvp" && isPVP && won) {
              return { ...quest, progress: Math.min(quest.target, quest.progress + 1) }
            }
            return quest
          }),
        )

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
            ? `You won and earned ${realmEarned} REALM tokens!`
            : `You lost but gained ${experienceGained} XP for trying.`,
          variant: won ? "default" : "destructive",
        })
      }, 3000)
    },
    [playerStats.energy, playerStats.realmBalance, toast],
  )

  const harvestResources = useCallback(() => {
    if (playerStats.energy < 10) {
      toast({
        title: "Not Enough Energy",
        description: "You need at least 10 energy to harvest resources.",
        variant: "destructive",
      })
      return
    }

    let totalRealmEarned = 0
    let totalHarvested = 0

    setResources((prev) =>
      prev.map((resource) => {
        const harvestedAmount = Math.floor(Math.random() * 5) + 1
        const realmValue = harvestedAmount * resource.value
        totalRealmEarned += realmValue
        totalHarvested += harvestedAmount

        return {
          ...resource,
          amount: resource.amount + harvestedAmount,
        }
      }),
    )

    setPlayerStats((prev) => ({
      ...prev,
      energy: prev.energy - 10,
      experience: prev.experience + 25,
      realmBalance: prev.realmBalance + totalRealmEarned,
      totalEarnings: prev.totalEarnings + totalRealmEarned,
    }))

    // Update harvest quest progress
    setActiveQuests((prev) =>
      prev.map((quest) =>
        quest.type === "harvest"
          ? { ...quest, progress: Math.min(quest.target, quest.progress + totalHarvested) }
          : quest,
      ),
    )

    toast({
      title: "Resources Harvested!",
      description: `You earned ${totalRealmEarned} REALM tokens and gained 25 XP!`,
    })
  }, [playerStats.energy, toast])

  const completeQuest = useCallback(
    (questId: string) => {
      const quest = activeQuests.find((q) => q.id === questId)
      if (!quest || quest.progress < quest.target || quest.completed) return

      setPlayerStats((prev) => ({
        ...prev,
        experience: prev.experience + quest.reward,
        realmBalance: prev.realmBalance + quest.realmReward,
        totalEarnings: prev.totalEarnings + quest.realmReward,
      }))

      setActiveQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, completed: true } : q)))

      toast({
        title: "Quest Completed!",
        description: `You earned ${quest.reward} XP and ${quest.realmReward} REALM tokens!`,
      })
    },
    [activeQuests, toast],
  )

  const createPVPMatch = useCallback(
    (wager: number) => {
      if (playerStats.realmBalance < wager) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough REALM tokens for this wager.",
          variant: "destructive",
        })
        return
      }

      const newMatch: PVPMatch = {
        id: Date.now().toString(),
        player1: account || "",
        player2: "",
        wager,
        status: "waiting",
        createdAt: Date.now(),
      }

      setPvpMatches((prev) => [...prev, newMatch])

      toast({
        title: "PVP Match Created",
        description: `Waiting for opponent with ${wager} REALM wager.`,
      })
    },
    [playerStats.realmBalance, account, toast],
  )

  const joinPVPMatch = useCallback(
    (matchId: string) => {
      const match = pvpMatches.find((m) => m.id === matchId)
      if (!match || match.status !== "waiting") return

      if (playerStats.realmBalance < match.wager) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough REALM tokens for this wager.",
          variant: "destructive",
        })
        return
      }

      setPvpMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, player2: account || "", status: "active" as const } : m)),
      )

      // Start PVP battle
      startBattle(true, match.player1, match.wager)
    },
    [pvpMatches, playerStats.realmBalance, account, startBattle, toast],
  )

  const swapUSDTToREALM = useCallback(
    (usdtAmount: number) => {
      if (playerStats.usdtBalance < usdtAmount) {
        toast({
          title: "Insufficient USDT",
          description: "You don't have enough USDT for this swap.",
          variant: "destructive",
        })
        return
      }

      const { adminFee, userAmount } = gameEconomy.processSwap(usdtAmount)
      const realmAmount = userAmount * GAME_CONFIG.USDT_TO_REALM_RATE

      setPlayerStats((prev) => ({
        ...prev,
        usdtBalance: prev.usdtBalance - usdtAmount,
        realmBalance: prev.realmBalance + realmAmount,
      }))

      toast({
        title: "Swap Successful",
        description: `Swapped ${usdtAmount} USDT for ${realmAmount} REALM tokens.`,
      })
    },
    [playerStats.usdtBalance, toast],
  )

  const swapREALMToUSDT = useCallback(
    (realmAmount: number) => {
      if (playerStats.realmBalance < realmAmount) {
        toast({
          title: "Insufficient REALM",
          description: "You don't have enough REALM tokens for this swap.",
          variant: "destructive",
        })
        return
      }

      const usdtAmount = realmAmount * GAME_CONFIG.REALM_TO_USDT_RATE
      const { adminFee, userAmount } = gameEconomy.processSwap(usdtAmount)

      setPlayerStats((prev) => ({
        ...prev,
        realmBalance: prev.realmBalance - realmAmount,
        usdtBalance: prev.usdtBalance + userAmount,
      }))

      toast({
        title: "Swap Successful",
        description: `Swapped ${realmAmount} REALM for ${userAmount} USDT.`,
      })
    },
    [playerStats.realmBalance, toast],
  )

  const stakeREALM = useCallback(
    (amount: number) => {
      if (playerStats.realmBalance < amount) {
        toast({
          title: "Insufficient Balance",
          description: "You don't have enough REALM tokens to stake.",
          variant: "destructive",
        })
        return
      }

      setPlayerStats((prev) => ({
        ...prev,
        realmBalance: prev.realmBalance - amount,
        stakedAmount: prev.stakedAmount + amount,
      }))

      toast({
        title: "Staking Successful",
        description: `Staked ${amount} REALM tokens. You'll earn daily rewards!`,
      })
    },
    [playerStats.realmBalance, toast],
  )

  const unstakeREALM = useCallback(
    (amount: number) => {
      if (playerStats.stakedAmount < amount) {
        toast({
          title: "Insufficient Staked Amount",
          description: "You don't have enough staked REALM tokens.",
          variant: "destructive",
        })
        return
      }

      setPlayerStats((prev) => ({
        ...prev,
        stakedAmount: prev.stakedAmount - amount,
        realmBalance: prev.realmBalance + amount,
      }))

      toast({
        title: "Unstaking Successful",
        description: `Unstaked ${amount} REALM tokens.`,
      })
    },
    [playerStats.stakedAmount, toast],
  )

  const claimStakingRewards = useCallback(() => {
    if (playerStats.stakingRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You don't have any staking rewards to claim.",
        variant: "destructive",
      })
      return
    }

    setPlayerStats((prev) => ({
      ...prev,
      realmBalance: prev.realmBalance + prev.stakingRewards,
      stakingRewards: 0,
    }))

    toast({
      title: "Rewards Claimed",
      description: `Claimed ${playerStats.stakingRewards} REALM tokens!`,
    })
  }, [playerStats.stakingRewards, toast])

  const useReferralCode = useCallback(
    (code: string) => {
      if (playerStats.referredBy) {
        toast({
          title: "Already Referred",
          description: "You have already used a referral code.",
          variant: "destructive",
        })
        return
      }

      // Simulate referral bonus
      const bonus = 100 // 100 REALM bonus for new users
      setPlayerStats((prev) => ({
        ...prev,
        referredBy: code,
        realmBalance: prev.realmBalance + bonus,
        totalEarnings: prev.totalEarnings + bonus,
      }))

      toast({
        title: "Referral Applied",
        description: `Welcome bonus: ${bonus} REALM tokens!`,
      })
    },
    [playerStats.referredBy, toast],
  )

  return {
    playerStats,
    activeQuests,
    resources,
    pvpMatches,
    isBattling,
    startBattle,
    harvestResources,
    completeQuest,
    createPVPMatch,
    joinPVPMatch,
    swapUSDTToREALM,
    swapREALMToUSDT,
    stakeREALM,
    unstakeREALM,
    claimStakingRewards,
    useReferralCode,
  }
}
