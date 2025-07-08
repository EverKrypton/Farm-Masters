"use client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "API request failed")
    }

    return data
  }

  // Auth
  async login(walletAddress: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    })
  }

  // User
  async getUser(address: string) {
    return this.request(`/user/${address}`)
  }

  async dailyCheckin(walletAddress: string) {
    return this.request("/checkin", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    })
  }

  // NFTs
  async getMarketplaceNFTs() {
    return this.request("/nfts/marketplace")
  }

  async buyNFT(walletAddress: string, nftId: number) {
    return this.request("/nft/buy", {
      method: "POST",
      body: JSON.stringify({ walletAddress, nftId }),
    })
  }

  // Staking
  async stakeTokens(walletAddress: string, amount: number) {
    return this.request("/staking/stake", {
      method: "POST",
      body: JSON.stringify({ walletAddress, amount }),
    })
  }

  async unstakeTokens(walletAddress: string, amount: number) {
    return this.request("/staking/unstake", {
      method: "POST",
      body: JSON.stringify({ walletAddress, amount }),
    })
  }

  async claimStakingRewards(walletAddress: string) {
    return this.request("/staking/claim", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    })
  }

  // Guilds
  async getGuilds() {
    return this.request("/guilds")
  }

  async createGuild(walletAddress: string, guildData: any) {
    return this.request("/guild/create", {
      method: "POST",
      body: JSON.stringify({ walletAddress, ...guildData }),
    })
  }

  async joinGuild(walletAddress: string, guildId: string) {
    return this.request("/guild/join", {
      method: "POST",
      body: JSON.stringify({ walletAddress, guildId }),
    })
  }

  async leaveGuild(walletAddress: string) {
    return this.request("/guild/leave", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    })
  }

  // Battles
  async createBattle(walletAddress: string, wager: number) {
    return this.request("/battle/create", {
      method: "POST",
      body: JSON.stringify({ walletAddress, wager }),
    })
  }

  async joinBattle(walletAddress: string, battleId: number) {
    return this.request("/battle/join", {
      method: "POST",
      body: JSON.stringify({ walletAddress, battleId }),
    })
  }

  async getAvailableBattles() {
    return this.request("/battles/available")
  }

  async getUserBattles(address: string) {
    return this.request(`/battles/user/${address}`)
  }

  // Swapping
  async swapUSDTToREALM(walletAddress: string, usdtAmount: number) {
    return this.request("/swap/usdt-to-realm", {
      method: "POST",
      body: JSON.stringify({ walletAddress, usdtAmount }),
    })
  }

  async swapREALMToUSDT(walletAddress: string, realmAmount: number) {
    return this.request("/swap/realm-to-usdt", {
      method: "POST",
      body: JSON.stringify({ walletAddress, realmAmount }),
    })
  }

  // Referrals
  async useReferralCode(walletAddress: string, referralCode: string) {
    return this.request("/referral/use", {
      method: "POST",
      body: JSON.stringify({ walletAddress, referralCode }),
    })
  }

  // Market
  async getMarketData() {
    return this.request("/market/data")
  }
}

export const apiClient = new ApiClient()
