const fs = require("fs")
const path = require("path")

// Database file paths
const DB_DIR = path.join(__dirname, "data")
const USERS_DB = path.join(DB_DIR, "users.json")
const BATTLES_DB = path.join(DB_DIR, "battles.json")
const TRANSACTIONS_DB = path.join(DB_DIR, "transactions.json")
const NFTS_DB = path.join(DB_DIR, "nfts.json")
const GUILDS_DB = path.join(DB_DIR, "guilds.json")
const MARKET_DB = path.join(DB_DIR, "market.json")

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

// Initialize database files if they don't exist
function initializeDatabase() {
  const defaultData = {
    users: [],
    battles: [],
    transactions: [],
    nfts: [
      {
        id: 1,
        token_id: 1,
        name: "Fire Dragon Warrior",
        rarity: "Legendary",
        price: 2500,
        owner: null,
        stats: { attack: 95, defense: 80, speed: 70, health: 100 },
        image_url: "/placeholder.svg?height=200&width=200",
        type: "Character",
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        token_id: 2,
        name: "Crystal Sword",
        rarity: "Epic",
        price: 1200,
        owner: null,
        stats: { attack: 85, power: 90 },
        image_url: "/placeholder.svg?height=200&width=200",
        type: "Weapon",
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        token_id: 3,
        name: "Mystic Forest Land",
        rarity: "Rare",
        price: 800,
        owner: null,
        stats: {},
        image_url: "/placeholder.svg?height=200&width=200",
        type: "Land",
        created_at: new Date().toISOString(),
      },
      {
        id: 4,
        token_id: 4,
        name: "Golden Sunflower",
        rarity: "Common",
        price: 300,
        owner: null,
        stats: {},
        image_url: "/placeholder.svg?height=200&width=200",
        type: "Resource",
        created_at: new Date().toISOString(),
      },
    ],
    guilds: [
      {
        id: "1",
        name: "Dragon Slayers",
        description: "Elite warriors dedicated to hunting the most powerful dragons in the realm.",
        leader: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        members: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"],
        memberCount: 1,
        maxMembers: 50,
        level: 15,
        experience: 8750,
        maxExperience: 10000,
        emblem: "🐉",
        requirements: { minLevel: 20, minNFTs: 5 },
        perks: ["+20% Battle XP", "Exclusive Dragon NFTs", "Weekly Tournaments"],
        treasury: 5000,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Crystal Miners",
        description: "Master resource gatherers focused on crystal mining and trading.",
        leader: "0x8ba1f109551bD432803012645Hac136c9c1e3a9",
        members: ["0x8ba1f109551bD432803012645Hac136c9c1e3a9"],
        memberCount: 1,
        maxMembers: 40,
        level: 12,
        experience: 6200,
        maxExperience: 8000,
        emblem: "💎",
        requirements: { minLevel: 15, minNFTs: 3 },
        perks: ["+30% Resource Yield", "Crystal Marketplace Access", "Mining Bonuses"],
        treasury: 3200,
        created_at: new Date().toISOString(),
      },
    ],
    market: {
      price: 0.01,
      volume24h: 0,
      priceChange24h: 0,
      lastUpdate: Date.now(),
      totalSupply: 1000000000,
      circulatingSupply: 100000000,
      lastBurnTime: Date.now(),
    },
  }

  const files = [
    { path: USERS_DB, data: defaultData.users },
    { path: BATTLES_DB, data: defaultData.battles },
    { path: TRANSACTIONS_DB, data: defaultData.transactions },
    { path: NFTS_DB, data: defaultData.nfts },
    { path: GUILDS_DB, data: defaultData.guilds },
    { path: MARKET_DB, data: defaultData.market },
  ]

  files.forEach(({ path, data }) => {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, JSON.stringify(data, null, 2))
    }
  })
}

// Read data from JSON file
function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error)
    return []
  }
}

// Write data to JSON file
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error)
    return false
  }
}

// Database operations
const db = {
  // Users
  getUsers: () => readData(USERS_DB),
  saveUsers: (users) => writeData(USERS_DB, users),
  getUserByAddress: (address) => {
    const users = readData(USERS_DB)
    return users.find((user) => user.wallet_address === address)
  },
  createUser: (userData) => {
    const users = readData(USERS_DB)
    const newUser = {
      id: users.length + 1,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    users.push(newUser)
    writeData(USERS_DB, users)
    return newUser
  },
  updateUser: (address, updates) => {
    const users = readData(USERS_DB)
    const userIndex = users.findIndex((user) => user.wallet_address === address)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates, updated_at: new Date().toISOString() }
      writeData(USERS_DB, users)
      return users[userIndex]
    }
    return null
  },

  // Battles
  getBattles: () => readData(BATTLES_DB),
  saveBattles: (battles) => writeData(BATTLES_DB, battles),
  createBattle: (battleData) => {
    const battles = readData(BATTLES_DB)
    const newBattle = {
      id: battles.length + 1,
      ...battleData,
      created_at: new Date().toISOString(),
    }
    battles.push(newBattle)
    writeData(BATTLES_DB, battles)
    return newBattle
  },
  updateBattle: (id, updates) => {
    const battles = readData(BATTLES_DB)
    const battleIndex = battles.findIndex((battle) => battle.id === id)
    if (battleIndex !== -1) {
      battles[battleIndex] = { ...battles[battleIndex], ...updates }
      writeData(BATTLES_DB, battles)
      return battles[battleIndex]
    }
    return null
  },

  // Transactions
  getTransactions: () => readData(TRANSACTIONS_DB),
  saveTransactions: (transactions) => writeData(TRANSACTIONS_DB, transactions),
  createTransaction: (transactionData) => {
    const transactions = readData(TRANSACTIONS_DB)
    const newTransaction = {
      id: transactions.length + 1,
      ...transactionData,
      created_at: new Date().toISOString(),
    }
    transactions.push(newTransaction)
    writeData(TRANSACTIONS_DB, transactions)
    return newTransaction
  },

  // NFTs
  getNFTs: () => readData(NFTS_DB),
  saveNFTs: (nfts) => writeData(NFTS_DB, nfts),
  updateNFT: (id, updates) => {
    const nfts = readData(NFTS_DB)
    const nftIndex = nfts.findIndex((nft) => nft.id === id)
    if (nftIndex !== -1) {
      nfts[nftIndex] = { ...nfts[nftIndex], ...updates }
      writeData(NFTS_DB, nfts)
      return nfts[nftIndex]
    }
    return null
  },

  // Guilds
  getGuilds: () => readData(GUILDS_DB),
  saveGuilds: (guilds) => writeData(GUILDS_DB, guilds),
  createGuild: (guildData) => {
    const guilds = readData(GUILDS_DB)
    const newGuild = {
      id: (guilds.length + 1).toString(),
      ...guildData,
      created_at: new Date().toISOString(),
    }
    guilds.push(newGuild)
    writeData(GUILDS_DB, guilds)
    return newGuild
  },
  updateGuild: (id, updates) => {
    const guilds = readData(GUILDS_DB)
    const guildIndex = guilds.findIndex((guild) => guild.id === id)
    if (guildIndex !== -1) {
      guilds[guildIndex] = { ...guilds[guildIndex], ...updates }
      writeData(GUILDS_DB, guilds)
      return guilds[guildIndex]
    }
    return null
  },

  // Market
  getMarket: () => readData(MARKET_DB),
  saveMarket: (market) => writeData(MARKET_DB, market),
  updateMarket: (updates) => {
    const market = readData(MARKET_DB)
    const updatedMarket = { ...market, ...updates, lastUpdate: Date.now() }
    writeData(MARKET_DB, updatedMarket)
    return updatedMarket
  },
}

module.exports = { db, initializeDatabase }
