const express = require("express")
const cors = require("cors")
const crypto = require("crypto")
const { db, initializeDatabase } = require("./database")

const app = express()
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize database
initializeDatabase()

// Game configuration
const GAME_CONFIG = {
  ADMIN_REVENUE_SHARE: 0.15,
  PLATFORM_FEE: 0.025,
  BATTLE_ENERGY_COST: 20,
  BATTLE_DURATION: 30000, // 30 seconds
  DAILY_BURN_RATE: 0.02, // 2% daily burn
  DAILY_CHECKIN_REWARD: 5,
  MIN_PURCHASE_FOR_WITHDRAWAL: 0.001,
  SWAP_FEE: 0.01,
  STAKING_DAILY_RATE: 0.001, // 0.1% daily
  REFERRAL_BONUS: 0.1,
  REFEREE_BONUS: 0.05,
  GUILD_CREATION_COST: 1000, // 1000 REALM to create guild
}

// Generate referral code
function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase()
}

// Update market price based on trading activity
function updateMarketPrice(tradeAmount, tradeType) {
  const market = db.getMarket()
  const priceImpact = (tradeAmount / market.circulatingSupply) * 0.1

  if (tradeType === "buy") {
    market.price *= 1 + priceImpact
  } else {
    market.price *= 1 - priceImpact
  }

  market.price = Math.max(0.001, Math.min(1, market.price))
  db.updateMarket(market)
  console.log(`Price updated: 1 REALM = ${market.price.toFixed(6)} USDT`)
}

// Daily burn mechanism
function performDailyBurn() {
  const market = db.getMarket()
  const now = Date.now()
  const timeSinceLastBurn = now - market.lastBurnTime

  if (timeSinceLastBurn >= 24 * 60 * 60 * 1000) {
    // 24 hours
    const burnAmount = market.circulatingSupply * GAME_CONFIG.DAILY_BURN_RATE
    market.circulatingSupply -= burnAmount
    market.lastBurnTime = now

    db.updateMarket(market)
    console.log(`Daily burn: ${burnAmount.toFixed(2)} REALM tokens burned`)
    updateMarketPrice(burnAmount, "burn")
  }
}

// Check for daily burn every hour
setInterval(performDailyBurn, 60 * 60 * 1000)

// User registration/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { walletAddress } = req.body

    if (!walletAddress) {
      return res.status(400).json({ error: "Wallet address required" })
    }

    let user = db.getUserByAddress(walletAddress)

    if (!user) {
      const referralCode = generateReferralCode()
      user = db.createUser({
        wallet_address: walletAddress,
        realm_balance: 1000, // Starting balance
        usdt_balance: 0,
        staked_amount: 0,
        staking_rewards: 0,
        total_deposited: 0,
        total_purchased: 0,
        can_withdraw: false,
        level: 1,
        experience: 0,
        energy: 100,
        health: 100,
        battles_won: 0,
        battles_lost: 0,
        referral_code: referralCode,
        referred_by: null,
        referral_earnings: 0,
        last_checkin: null,
        guild_id: null,
        last_staking_claim: Date.now(),
      })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user data
app.get("/api/user/:address", (req, res) => {
  try {
    const { address } = req.params
    const user = db.getUserByAddress(address)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ success: true, user })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Daily check-in
app.post("/api/checkin", (req, res) => {
  try {
    const { walletAddress } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const today = new Date().toISOString().split("T")[0]
    const lastCheckin = user.last_checkin

    if (lastCheckin && lastCheckin.split("T")[0] === today) {
      return res.status(400).json({ error: "Already checked in today" })
    }

    const updatedUser = db.updateUser(walletAddress, {
      realm_balance: user.realm_balance + GAME_CONFIG.DAILY_CHECKIN_REWARD,
      last_checkin: new Date().toISOString(),
    })

    res.json({
      success: true,
      reward: GAME_CONFIG.DAILY_CHECKIN_REWARD,
      message: "Daily check-in successful!",
    })
  } catch (error) {
    console.error("Check-in error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Buy NFT with REALM
app.post("/api/nft/buy", (req, res) => {
  try {
    const { walletAddress, nftId } = req.body
    const user = db.getUserByAddress(walletAddress)
    const nfts = db.getNFTs()
    const nft = nfts.find((n) => n.id === nftId && !n.owner)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!nft) {
      return res.status(404).json({ error: "NFT not available" })
    }

    if (user.realm_balance < nft.price) {
      return res.status(400).json({ error: "Insufficient REALM balance" })
    }

    const adminFee = nft.price * GAME_CONFIG.ADMIN_REVENUE_SHARE

    // Update user
    db.updateUser(walletAddress, {
      realm_balance: user.realm_balance - nft.price,
      total_purchased: user.total_purchased + nft.price,
      can_withdraw: true,
    })

    // Update NFT
    db.updateNFT(nftId, { owner: walletAddress })

    // Record transaction
    db.createTransaction({
      user_address: walletAddress,
      type: "nft_purchase",
      amount: nft.price,
      currency: "REALM",
      admin_fee: adminFee,
      status: "confirmed",
    })

    res.json({
      success: true,
      message: "NFT purchased successfully",
      adminFee: adminFee,
    })
  } catch (error) {
    console.error("NFT purchase error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Staking
app.post("/api/staking/stake", (req, res) => {
  try {
    const { walletAddress, amount } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.realm_balance < amount) {
      return res.status(400).json({ error: "Insufficient REALM balance" })
    }

    db.updateUser(walletAddress, {
      realm_balance: user.realm_balance - amount,
      staked_amount: user.staked_amount + amount,
    })

    res.json({ success: true, message: "Tokens staked successfully" })
  } catch (error) {
    console.error("Staking error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/staking/unstake", (req, res) => {
  try {
    const { walletAddress, amount } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.staked_amount < amount) {
      return res.status(400).json({ error: "Insufficient staked amount" })
    }

    db.updateUser(walletAddress, {
      staked_amount: user.staked_amount - amount,
      realm_balance: user.realm_balance + amount,
    })

    res.json({ success: true, message: "Tokens unstaked successfully" })
  } catch (error) {
    console.error("Unstaking error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/staking/claim", (req, res) => {
  try {
    const { walletAddress } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const now = Date.now()
    const timeSinceLastClaim = now - user.last_staking_claim
    const daysSinceLastClaim = timeSinceLastClaim / (24 * 60 * 60 * 1000)
    const rewards = user.staked_amount * GAME_CONFIG.STAKING_DAILY_RATE * daysSinceLastClaim

    if (rewards <= 0) {
      return res.status(400).json({ error: "No rewards to claim" })
    }

    db.updateUser(walletAddress, {
      realm_balance: user.realm_balance + rewards,
      staking_rewards: 0,
      last_staking_claim: now,
    })

    res.json({ success: true, rewards, message: "Staking rewards claimed" })
  } catch (error) {
    console.error("Claim rewards error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Guild system
app.get("/api/guilds", (req, res) => {
  try {
    const guilds = db.getGuilds()
    res.json({ success: true, guilds })
  } catch (error) {
    console.error("Get guilds error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/guild/create", (req, res) => {
  try {
    const { walletAddress, name, description, emblem, maxMembers, requirements } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.guild_id) {
      return res.status(400).json({ error: "Already in a guild" })
    }

    if (user.realm_balance < GAME_CONFIG.GUILD_CREATION_COST) {
      return res.status(400).json({ error: "Insufficient REALM balance" })
    }

    const guild = db.createGuild({
      name,
      description,
      leader: walletAddress,
      members: [walletAddress],
      memberCount: 1,
      maxMembers: maxMembers || 50,
      level: 1,
      experience: 0,
      maxExperience: 1000,
      emblem: emblem || "🏰",
      requirements: requirements || { minLevel: 1, minNFTs: 0 },
      perks: ["Guild Chat", "Member Benefits"],
      treasury: 0,
    })

    db.updateUser(walletAddress, {
      realm_balance: user.realm_balance - GAME_CONFIG.GUILD_CREATION_COST,
      guild_id: guild.id,
    })

    res.json({ success: true, guild, message: "Guild created successfully" })
  } catch (error) {
    console.error("Create guild error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/guild/join", (req, res) => {
  try {
    const { walletAddress, guildId } = req.body
    const user = db.getUserByAddress(walletAddress)
    const guilds = db.getGuilds()
    const guild = guilds.find((g) => g.id === guildId)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!guild) {
      return res.status(404).json({ error: "Guild not found" })
    }

    if (user.guild_id) {
      return res.status(400).json({ error: "Already in a guild" })
    }

    if (guild.memberCount >= guild.maxMembers) {
      return res.status(400).json({ error: "Guild is full" })
    }

    if (user.level < guild.requirements.minLevel) {
      return res.status(400).json({ error: "Level requirement not met" })
    }

    // Add user to guild
    guild.members.push(walletAddress)
    guild.memberCount += 1
    db.updateGuild(guildId, guild)

    db.updateUser(walletAddress, { guild_id: guildId })

    res.json({ success: true, message: "Joined guild successfully" })
  } catch (error) {
    console.error("Join guild error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/guild/leave", (req, res) => {
  try {
    const { walletAddress } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user || !user.guild_id) {
      return res.status(400).json({ error: "Not in a guild" })
    }

    const guilds = db.getGuilds()
    const guild = guilds.find((g) => g.id === user.guild_id)

    if (guild) {
      if (guild.leader === walletAddress) {
        return res.status(400).json({ error: "Guild leader cannot leave. Transfer leadership first." })
      }

      guild.members = guild.members.filter((member) => member !== walletAddress)
      guild.memberCount -= 1
      db.updateGuild(guild.id, guild)
    }

    db.updateUser(walletAddress, { guild_id: null })

    res.json({ success: true, message: "Left guild successfully" })
  } catch (error) {
    console.error("Leave guild error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// PVP Battles
app.post("/api/battle/create", (req, res) => {
  try {
    const { walletAddress, wager } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (user.realm_balance < wager) {
      return res.status(400).json({ error: "Insufficient REALM balance" })
    }

    if (user.energy < GAME_CONFIG.BATTLE_ENERGY_COST) {
      return res.status(400).json({ error: "Insufficient energy" })
    }

    // Lock wager amount
    db.updateUser(walletAddress, {
      realm_balance: user.realm_balance - wager,
      energy: user.energy - GAME_CONFIG.BATTLE_ENERGY_COST,
    })

    const battle = db.createBattle({
      player1: walletAddress,
      player2: null,
      wager: wager,
      status: "waiting",
      winner: null,
      battle_data: {},
    })

    res.json({ success: true, battle })
  } catch (error) {
    console.error("Create battle error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/battle/join", (req, res) => {
  try {
    const { walletAddress, battleId } = req.body
    const user = db.getUserByAddress(walletAddress)
    const battles = db.getBattles()
    const battle = battles.find((b) => b.id === battleId && b.status === "waiting")

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!battle) {
      return res.status(404).json({ error: "Battle not available" })
    }

    if (user.realm_balance < battle.wager) {
      return res.status(400).json({ error: "Insufficient REALM balance" })
    }

    if (user.energy < GAME_CONFIG.BATTLE_ENERGY_COST) {
      return res.status(400).json({ error: "Insufficient energy" })
    }

    // Lock wager amount and start battle
    db.updateUser(walletAddress, {
      realm_balance: user.realm_balance - battle.wager,
      energy: user.energy - GAME_CONFIG.BATTLE_ENERGY_COST,
    })

    db.updateBattle(battleId, {
      player2: walletAddress,
      status: "active",
      started_at: new Date().toISOString(),
    })

    // Start battle simulation
    setTimeout(() => {
      simulateBattle(battleId)
    }, GAME_CONFIG.BATTLE_DURATION)

    res.json({ success: true, message: "Battle joined successfully" })
  } catch (error) {
    console.error("Join battle error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Simulate battle outcome
function simulateBattle(battleId) {
  try {
    const battles = db.getBattles()
    const battle = battles.find((b) => b.id === battleId)

    if (!battle) return

    // Random battle outcome (60% win rate for player1)
    const winner = Math.random() > 0.4 ? battle.player1 : battle.player2
    const loser = winner === battle.player1 ? battle.player2 : battle.player1

    // Calculate rewards
    const totalPot = battle.wager * 2
    const adminFee = totalPot * GAME_CONFIG.ADMIN_REVENUE_SHARE
    const winnerReward = totalPot - adminFee

    // Update winner
    const winnerUser = db.getUserByAddress(winner)
    db.updateUser(winner, {
      realm_balance: winnerUser.realm_balance + winnerReward,
      battles_won: winnerUser.battles_won + 1,
      experience: winnerUser.experience + 100,
    })

    // Update loser
    const loserUser = db.getUserByAddress(loser)
    db.updateUser(loser, {
      battles_lost: loserUser.battles_lost + 1,
      experience: loserUser.experience + 25,
    })

    // Update battle
    db.updateBattle(battleId, {
      status: "completed",
      winner: winner,
      ended_at: new Date().toISOString(),
    })

    // Record transaction
    db.createTransaction({
      user_address: winner,
      type: "battle_win",
      amount: winnerReward,
      currency: "REALM",
      admin_fee: adminFee,
      status: "confirmed",
    })

    console.log(`Battle ${battleId} completed. Winner: ${winner}`)
  } catch (error) {
    console.error("Battle simulation error:", error)
  }
}

// Swap endpoints
app.post("/api/swap/usdt-to-realm", (req, res) => {
  try {
    const { walletAddress, usdtAmount } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.can_withdraw) {
      return res.status(400).json({ error: "Must purchase NFT or deposit to enable swapping" })
    }

    if (user.usdt_balance < usdtAmount) {
      return res.status(400).json({ error: "Insufficient USDT balance" })
    }

    const market = db.getMarket()
    const swapFee = usdtAmount * GAME_CONFIG.SWAP_FEE
    const netUsdt = usdtAmount - swapFee
    const realmAmount = netUsdt / market.price

    db.updateUser(walletAddress, {
      usdt_balance: user.usdt_balance - usdtAmount,
      realm_balance: user.realm_balance + realmAmount,
    })

    db.createTransaction({
      user_address: walletAddress,
      type: "swap_usdt_to_realm",
      amount: usdtAmount,
      currency: "USDT",
      admin_fee: swapFee,
      status: "confirmed",
    })

    updateMarketPrice(realmAmount, "buy")

    res.json({
      success: true,
      realmReceived: realmAmount,
      swapFee: swapFee,
      newPrice: db.getMarket().price,
    })
  } catch (error) {
    console.error("Swap error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/swap/realm-to-usdt", (req, res) => {
  try {
    const { walletAddress, realmAmount } = req.body
    const user = db.getUserByAddress(walletAddress)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!user.can_withdraw) {
      return res.status(400).json({ error: "Must purchase NFT or deposit to enable swapping" })
    }

    if (user.realm_balance < realmAmount) {
      return res.status(400).json({ error: "Insufficient REALM balance" })
    }

    const market = db.getMarket()
    const usdtAmount = realmAmount * market.price
    const swapFee = usdtAmount * GAME_CONFIG.SWAP_FEE
    const netUsdt = usdtAmount - swapFee

    db.updateUser(walletAddress, {
      realm_balance: user.realm_balance - realmAmount,
      usdt_balance: user.usdt_balance + netUsdt,
    })

    db.createTransaction({
      user_address: walletAddress,
      type: "swap_realm_to_usdt",
      amount: realmAmount,
      currency: "REALM",
      admin_fee: swapFee,
      status: "confirmed",
    })

    updateMarketPrice(realmAmount, "sell")

    res.json({
      success: true,
      usdtReceived: netUsdt,
      swapFee: swapFee,
      newPrice: db.getMarket().price,
    })
  } catch (error) {
    console.error("Swap error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Use referral code
app.post("/api/referral/use", (req, res) => {
  try {
    const { walletAddress, referralCode } = req.body
    const user = db.getUserByAddress(walletAddress)
    const users = db.getUsers()
    const referrer = users.find((u) => u.referral_code === referralCode)

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    if (!referrer) {
      return res.status(404).json({ error: "Invalid referral code" })
    }

    if (user.referred_by) {
      return res.status(400).json({ error: "Already used a referral code" })
    }

    if (user.referral_code === referralCode) {
      return res.status(400).json({ error: "Cannot use your own referral code" })
    }

    const refereeBonus = 100

    db.updateUser(walletAddress, {
      referred_by: referralCode,
      realm_balance: user.realm_balance + refereeBonus,
    })

    res.json({
      success: true,
      bonus: refereeBonus,
      message: "Referral code applied successfully!",
    })
  } catch (error) {
    console.error("Referral error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get market data
app.get("/api/market/data", (req, res) => {
  res.json({ success: true, market: db.getMarket() })
})

// Get available battles
app.get("/api/battles/available", (req, res) => {
  try {
    const battles = db.getBattles().filter((b) => b.status === "waiting")
    res.json({ success: true, battles })
  } catch (error) {
    console.error("Get battles error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get user battles
app.get("/api/battles/user/:address", (req, res) => {
  try {
    const { address } = req.params
    const battles = db
      .getBattles()
      .filter((b) => b.player1 === address || b.player2 === address)
      .slice(-10)

    res.json({ success: true, battles })
  } catch (error) {
    console.error("Get user battles error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get NFTs for sale
app.get("/api/nfts/marketplace", (req, res) => {
  try {
    const nfts = db.getNFTs().filter((nft) => !nft.owner)
    res.json({ success: true, nfts })
  } catch (error) {
    console.error("Get NFTs error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Energy and health regeneration
setInterval(() => {
  try {
    const users = db.getUsers()
    const updatedUsers = users.map((user) => ({
      ...user,
      energy: Math.min(100, user.energy + 5),
      health: Math.min(100, user.health + 2),
    }))
    db.saveUsers(updatedUsers)
  } catch (error) {
    console.error("Regeneration error:", error)
  }
}, 30000) // Every 30 seconds

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log("Using JSON file database")
})

module.exports = app
