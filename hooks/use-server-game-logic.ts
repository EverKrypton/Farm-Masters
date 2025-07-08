"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { apiClient } from "@/lib/api-client"

interface PlayerStats {
  wallet_address: string
  realm_balance: number
  usdt_balance: number
  staked_amount: number
  staking_rewards: number
  total_deposited: number
  total_purchased: number
  can_withdraw: boolean
  level: number
  experience: number
  energy: number
  health: number
  battles_won: number
  battles_lost: number
  referral_code: string
  referred_by: string
  referral_earnings: number
  last_checkin: string
  guild_id: string
  last_staking_claim: number
}

interface MarketData {
  price: number
  volume24h: number
  priceChange24h: number
  lastUpdate: number
  totalSupply: number
  circulatingSupply: number
}

interface Battle {
  id: number
  player1: string
  player2: string
  wager: number
  status: string
  winner: string
  created_at: string
}

interface NFT {
  id: number
  token_id: number
  name: string
  rarity: string
  price: number
  owner: string
  stats: any
  image_url: string
}

interface Guild {
  id: string
  name: string
  description: string
  leader: string
  members: string[]
  memberCount: number
  maxMembers: number
  level: number
  experience: number
  maxExperience: number
  emblem: string
  requirements: { minLevel: number; minNFTs: number }
  perks: string[]
  treasury: number
}

export function useServerGameLogic() {
  const { toast } = useToast()
  const { account, isConnected } = useWeb3()

  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null)
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [availableBattles, setAvailableBattles] = useState<Battle[]>([])
  const [userBattles, setUserBattles] = useState<Battle[]>([])
  const [marketplaceNFTs, setMarketplaceNFTs] = useState<NFT[]>([])
  const [guilds, setGuilds] = useState<Guild[]>([])
  const [userGuild, setUserGuild] = useState<Guild | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const initializeUser = async () => {
    try {
      setIsLoading(true)

      // Login/register user
      await apiClient.login(account!)

      // Fetch user data
      const userData = await apiClient.getUser(account!)
      setPlayerStats(userData.user)

      // Fetch marketplace NFTs
      const nftData = await apiClient.getMarketplaceNFTs()
      setMarketplaceNFTs(nftData.nfts)

      // Fetch guilds
      const guildData = await apiClient.getGuilds()
      setGuilds(guildData.guilds)

      // Find user's guild if they have one
      if (userData.user.guild_id) {
        const userGuildData = guildData.guilds.find((g: Guild) => g.id === userData.user.guild_id)
        setUserGuild(userGuildData || null)
      }
    } catch (error) {
      console.error("Initialize user error:", error)
      toast({
        title: "Error",
        description: "Failed to initialize user data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMarketData = async () => {
    try {
      const data = await apiClient.getMarketData()
      setMarketData(data.market)
    } catch (error) {
      console.error("Fetch market data error:", error)
    }
  }

  const fetchBattles = async () => {
    try {
      const [availableData, userBattleData] = await Promise.all([
        apiClient.getAvailableBattles(),
        account ? apiClient.getUserBattles(account) : Promise.resolve({ battles: [] }),
      ])

      setAvailableBattles(availableData.battles)
      setUserBattles(userBattleData.battles)
    } catch (error) {
      console.error("Fetch battles error:", error)
    }
  }

  const dailyCheckin = useCallback(async () => {
    if (!account) return

    try {
      setIsLoading(true)
      const result = await apiClient.dailyCheckin(account)

      // Update local state
      setPlayerStats((prev) =>
        prev
          ? {
              ...prev,
              realm_balance: prev.realm_balance + result.reward,
            }
          : null,
      )

      toast({
        title: "Daily Check-in",
        description: `You received ${result.reward} REALM tokens!`,
      })
    } catch (error: any) {
      toast({
        title: "Check-in Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [account, toast])

  const buyNFT = useCallback(
    async (nftId: number) => {
      if (!account) return

      try {
        setIsLoading(true)
        const result = await apiClient.buyNFT(account, nftId)

        // Refresh user data and marketplace
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)

        const nftData = await apiClient.getMarketplaceNFTs()
        setMarketplaceNFTs(nftData.nfts)

        toast({
          title: "NFT Purchased!",
          description: "NFT successfully purchased with REALM tokens",
        })
      } catch (error: any) {
        toast({
          title: "Purchase Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const stakeREALM = useCallback(
    async (amount: number) => {
      if (!account) return

      try {
        setIsLoading(true)
        await apiClient.stakeTokens(account, amount)

        // Refresh user data
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)

        toast({
          title: "Staking Successful",
          description: `Staked ${amount} REALM tokens`,
        })
      } catch (error: any) {
        toast({
          title: "Staking Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const unstakeREALM = useCallback(
    async (amount: number) => {
      if (!account) return

      try {
        setIsLoading(true)
        await apiClient.unstakeTokens(account, amount)

        // Refresh user data
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)

        toast({
          title: "Unstaking Successful",
          description: `Unstaked ${amount} REALM tokens`,
        })
      } catch (error: any) {
        toast({
          title: "Unstaking Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const claimStakingRewards = useCallback(async () => {
    if (!account) return

    try {
      setIsLoading(true)
      const result = await apiClient.claimStakingRewards(account)

      // Refresh user data
      const userData = await apiClient.getUser(account)
      setPlayerStats(userData.user)

      toast({
        title: "Rewards Claimed",
        description: `Claimed ${result.rewards.toFixed(2)} REALM tokens!`,
      })
    } catch (error: any) {
      toast({
        title: "Claim Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [account, toast])

  const createGuild = useCallback(
    async (guildData: any) => {
      if (!account) return

      try {
        setIsLoading(true)
        const result = await apiClient.createGuild(account, guildData)

        // Refresh user data and guilds
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)

        const guildListData = await apiClient.getGuilds()
        setGuilds(guildListData.guilds)
        setUserGuild(result.guild)

        toast({
          title: "Guild Created",
          description: "Your guild has been created successfully!",
        })
      } catch (error: any) {
        toast({
          title: "Guild Creation Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const joinGuild = useCallback(
    async (guildId: string) => {
      if (!account) return

      try {
        setIsLoading(true)
        await apiClient.joinGuild(account, guildId)

        // Refresh user data and guilds
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)

        const guildData = await apiClient.getGuilds()
        setGuilds(guildData.guilds)

        const userGuildData = guildData.guilds.find((g: Guild) => g.id === guildId)
        setUserGuild(userGuildData || null)

        toast({
          title: "Guild Joined",
          description: "You have successfully joined the guild!",
        })
      } catch (error: any) {
        toast({
          title: "Join Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const leaveGuild = useCallback(async () => {
    if (!account) return

    try {
      setIsLoading(true)
      await apiClient.leaveGuild(account)

      // Refresh user data and guilds
      const userData = await apiClient.getUser(account)
      setPlayerStats(userData.user)

      const guildData = await apiClient.getGuilds()
      setGuilds(guildData.guilds)
      setUserGuild(null)

      toast({
        title: "Left Guild",
        description: "You have left the guild",
      })
    } catch (error: any) {
      toast({
        title: "Leave Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [account, toast])

  const createPVPBattle = useCallback(
    async (wager: number) => {
      if (!account) return

      try {
        setIsLoading(true)
        await apiClient.createBattle(account, wager)

        // Refresh user data and battles
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)
        fetchBattles()

        toast({
          title: "Battle Created",
          description: `Battle created with ${wager} REALM wager`,
        })
      } catch (error: any) {
        toast({
          title: "Battle Creation Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const joinPVPBattle = useCallback(
    async (battleId: number) => {
      if (!account) return

      try {
        setIsLoading(true)
        await apiClient.joinBattle(account, battleId)

        // Refresh user data and battles
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)
        fetchBattles()

        toast({
          title: "Battle Joined",
          description: "You joined the battle! Fight begins now...",
        })
      } catch (error: any) {
        toast({
          title: "Join Battle Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const swapUSDTToREALM = useCallback(
    async (usdtAmount: number) => {
      if (!account) return

      try {
        setIsLoading(true)
        const result = await apiClient.swapUSDTToREALM(account, usdtAmount)

        // Refresh user data and market data
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)
        fetchMarketData()

        toast({
          title: "Swap Successful",
          description: `Swapped ${usdtAmount} USDT for ${result.realmReceived.toFixed(2)} REALM`,
        })
      } catch (error: any) {
        toast({
          title: "Swap Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const swapREALMToUSDT = useCallback(
    async (realmAmount: number) => {
      if (!account) return

      try {
        setIsLoading(true)
        const result = await apiClient.swapREALMToUSDT(account, realmAmount)

        // Refresh user data and market data
        const userData = await apiClient.getUser(account)
        setPlayerStats(userData.user)
        fetchMarketData()

        toast({
          title: "Swap Successful",
          description: `Swapped ${realmAmount} REALM for ${result.usdtReceived.toFixed(4)} USDT`,
        })
      } catch (error: any) {
        toast({
          title: "Swap Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  const useReferralCode = useCallback(
    async (referralCode: string) => {
      try {
        setIsLoading(true)
        const result = await apiClient.useReferralCode(account!, referralCode)

        // Refresh user data
        const userData = await apiClient.getUser(account!)
        setPlayerStats(userData.user)

        toast({
          title: "Referral Applied",
          description: `You received ${result.bonus} REALM tokens!`,
        })
      } catch (error: any) {
        toast({
          title: "Referral Failed",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [account, toast],
  )

  useEffect(() => {
    if (account && isConnected) {
      initializeUser()
    }
  }, [account, isConnected])

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 10000) // Every 10 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (account) {
      fetchBattles()
      const interval = setInterval(fetchBattles, 5000) // Every 5 seconds
      return () => clearInterval(interval)
    }
  }, [account])

  return {
    playerStats,
    marketData,
    availableBattles,
    userBattles,
    marketplaceNFTs,
    guilds,
    userGuild,
    isLoading,
    dailyCheckin,
    buyNFT,
    stakeREALM,
    unstakeREALM,
    claimStakingRewards,
    createGuild,
    joinGuild,
    leaveGuild,
    createPVPBattle,
    joinPVPBattle,
    swapUSDTToREALM,
    swapREALMToUSDT,
    useReferralCode,
    refreshUserData: initializeUser,
  }
}
