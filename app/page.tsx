"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { useRealGameLogic } from "@/hooks/use-real-game-logic"
import { useSound } from "@/components/sound-manager"
import { AnimatedCard } from "@/components/animated-card"
import { BattleSystem } from "@/components/battle-system"
import { ResourceManager } from "@/components/resource-manager"
import { MobileNav } from "@/components/mobile-nav"
import { GuildSystem } from "@/components/guild-system"
import { SwapSystem } from "@/components/swap-system"
import { PVPSystem } from "@/components/pvp-system"
import { StakingSystem } from "@/components/staking-system"
import { ReferralSystem } from "@/components/referral-system"
import AdminPanel from "@/components/admin-panel"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Wallet,
  Coins,
  Sword,
  Shield,
  Zap,
  Star,
  ShoppingCart,
  Plus,
  Gamepad2,
  Trophy,
  Users,
  TrendingUp,
  Sparkles,
  Crown,
  Gem,
  Settings,
  Menu,
  Heart,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowUpDown,
  Swords,
  Lock,
  Gift,
} from "lucide-react"

interface NFT {
  id: string
  name: string
  image: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  price: number
  stats?: {
    attack?: number
    defense?: number
    speed?: number
    power?: number
    health?: number
  }
  type: "Character" | "Weapon" | "Land" | "Resource"
  level?: number
  experience?: number
}

const mockNFTs: NFT[] = [
  {
    id: "1",
    name: "Fire Dragon Warrior",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Legendary",
    price: 2.5,
    stats: { attack: 95, defense: 80, speed: 70, health: 100 },
    type: "Character",
    level: 15,
    experience: 750,
  },
  {
    id: "2",
    name: "Crystal Sword",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Epic",
    price: 1.2,
    stats: { attack: 85, power: 90 },
    type: "Weapon",
    level: 8,
    experience: 320,
  },
  {
    id: "3",
    name: "Mystic Forest Land",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Rare",
    price: 0.8,
    type: "Land",
    level: 5,
    experience: 150,
  },
  {
    id: "4",
    name: "Golden Sunflower",
    image: "/placeholder.svg?height=200&width=200",
    rarity: "Common",
    price: 0.3,
    type: "Resource",
    level: 3,
    experience: 80,
  },
]

export default function NFTGame() {
  const [activeTab, setActiveTab] = useState("marketplace")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const { account, isConnected, balance, connectWallet, mintNFT, buyNFT, isAdmin } = useWeb3()
  const {
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
  } = useRealGameLogic()
  const { playSound, toggleMute, isMuted } = useSound()

  const handleMintNFT = async (nftData: any) => {
    setIsLoading(true)
    playSound("click")
    try {
      await mintNFT(nftData)
      playSound("mint")
      toast({
        title: "NFT Minted Successfully!",
        description: "Your new NFT has been added to your inventory.",
      })
    } catch (error) {
      playSound("error")
      toast({
        title: "Minting Failed",
        description: "There was an error minting your NFT.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuyNFT = async (nft: NFT) => {
    setIsLoading(true)
    playSound("click")
    try {
      await buyNFT(nft)
      playSound("success")
      toast({
        title: "NFT Purchased!",
        description: `You successfully bought ${nft.name}`,
      })
    } catch (error) {
      playSound("error")
      toast({
        title: "Purchase Failed",
        description: "There was an error purchasing the NFT.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabChange = (tab: string) => {
    playSound("click")
    setActiveTab(tab)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gradient-to-r from-gray-500 to-gray-600"
      case "Rare":
        return "bg-gradient-to-r from-blue-500 to-blue-600"
      case "Epic":
        return "bg-gradient-to-r from-purple-500 to-purple-600"
      case "Legendary":
        return "bg-gradient-to-r from-yellow-500 to-orange-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Character":
        return <Users className="w-4 h-4" />
      case "Weapon":
        return <Sword className="w-4 h-4" />
      case "Land":
        return <Crown className="w-4 h-4" />
      case "Resource":
        return <Gem className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-1/2 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute bottom-20 left-1/3 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl"
        />
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isAdmin={isAdmin}
      />

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
                <h1 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CryptoRealm
                </h1>
              </div>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 animate-pulse"
              >
                BETA
              </Badge>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {isConnected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg px-3 py-2 border border-green-500/30"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Coins className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                  <span className="text-white font-medium text-sm md:text-base">
                    {playerStats.realmBalance.toFixed(0)} REALM
                  </span>
                </motion.div>
              )}

              <Button
                onClick={() => {
                  playSound("click")
                  connectWallet()
                }}
                className={`text-sm md:text-base transition-all duration-300 ${
                  isConnected
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg shadow-green-500/25"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25"
                } hover:scale-105 hover:shadow-xl`}
                disabled={isLoading}
              >
                <Wallet className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{isConnected ? "Connected" : "Connect Wallet"}</span>
                <span className="sm:hidden">{isConnected ? "✓" : "Connect"}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  playSound("click")
                  toggleMute()
                }}
                className="text-white hover:bg-white/10 hidden md:flex"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>

              <Link href="/docs">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hidden md:flex">
                  <BookOpen className="w-4 h-4" />
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => {
                  playSound("click")
                  setIsMobileMenuOpen(true)
                }}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 md:px-4 py-4 md:py-8 relative z-10">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Desktop Tabs */}
          <TabsList className="hidden md:grid w-full grid-cols-8 bg-black/20 border border-white/10 mb-6 backdrop-blur-sm">
            <TabsTrigger
              value="marketplace"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 transition-all duration-300 hover:bg-white/10"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger
              value="game"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-green-700 transition-all duration-300 hover:bg-white/10"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Game
            </TabsTrigger>
            <TabsTrigger
              value="pvp"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 transition-all duration-300 hover:bg-white/10"
            >
              <Swords className="w-4 h-4 mr-2" />
              PVP
            </TabsTrigger>
            <TabsTrigger
              value="swap"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-700 transition-all duration-300 hover:bg-white/10"
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Swap
            </TabsTrigger>
            <TabsTrigger
              value="staking"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-indigo-700 transition-all duration-300 hover:bg-white/10"
            >
              <Lock className="w-4 h-4 mr-2" />
              Staking
            </TabsTrigger>
            <TabsTrigger
              value="referral"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-700 transition-all duration-300 hover:bg-white/10"
            >
              <Gift className="w-4 h-4 mr-2" />
              Referral
            </TabsTrigger>
            <TabsTrigger
              value="guilds"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-700 transition-all duration-300 hover:bg-white/10"
            >
              <Users className="w-4 h-4 mr-2" />
              Guilds
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-yellow-700 transition-all duration-300 hover:bg-white/10"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-700 transition-all duration-300 hover:bg-white/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="mt-6">
            <div className="grid gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  NFT Marketplace
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25 w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" />
                      Mint NFT
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-700 mx-4 max-w-md backdrop-blur-sm">
                    <DialogHeader>
                      <DialogTitle className="text-white">Mint New NFT</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nft-name" className="text-white">
                          NFT Name
                        </Label>
                        <Input
                          id="nft-name"
                          placeholder="Enter NFT name"
                          className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="nft-description" className="text-white">
                          Description
                        </Label>
                        <Input
                          id="nft-description"
                          placeholder="Enter description"
                          className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <Button
                        onClick={() => handleMintNFT({})}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Minting..." : "Mint NFT (0.1 ETH)"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {mockNFTs.map((nft, index) => (
                  <AnimatedCard
                    key={nft.id}
                    delay={index * 100}
                    className={`nft-card bg-black/40 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 ${index === 0 ? "ring-2 ring-blue-500/50" : ""}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="relative group">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="w-full h-32 md:h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white animate-pulse shadow-lg`}
                        >
                          {nft.rarity}
                        </Badge>
                        <div className="absolute top-2 left-2 bg-black/60 rounded-full p-1 animate-bounce backdrop-blur-sm">
                          {getTypeIcon(nft.type)}
                        </div>
                        {nft.level && (
                          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 rounded-full px-2 py-1 text-xs text-white font-bold backdrop-blur-sm">
                            Lv.{nft.level}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-sm md:text-lg">{nft.name}</h3>
                        <p className="text-gray-400 text-xs md:text-sm">{nft.type}</p>
                      </div>

                      {nft.experience && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Experience</span>
                            <span>{nft.experience}/1000</span>
                          </div>
                          <Progress value={(nft.experience / 1000) * 100} className="h-1" />
                        </div>
                      )}

                      {nft.stats && (
                        <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                          {nft.stats.attack && (
                            <div className="flex items-center gap-1 text-red-400">
                              <Sword className="w-3 h-3" />
                              <span>{nft.stats.attack}</span>
                            </div>
                          )}
                          {nft.stats.defense && (
                            <div className="flex items-center gap-1 text-blue-400">
                              <Shield className="w-3 h-3" />
                              <span>{nft.stats.defense}</span>
                            </div>
                          )}
                          {nft.stats.speed && (
                            <div className="flex items-center gap-1 text-green-400">
                              <Zap className="w-3 h-3" />
                              <span>{nft.stats.speed}</span>
                            </div>
                          )}
                          {nft.stats.health && (
                            <div className="flex items-center gap-1 text-pink-400">
                              <Heart className="w-3 h-3" />
                              <span>{nft.stats.health}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 md:w-4 h-3 md:h-4 text-yellow-400" />
                          <span className="text-white font-bold text-sm md:text-base">{nft.price} ETH</span>
                        </div>
                        <Button
                          onClick={() => handleBuyNFT(nft)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 text-xs md:text-sm shadow-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? "..." : "Buy"}
                        </Button>
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Game Tab */}
          <TabsContent value="game" className="mt-6">
            <div className="grid gap-4 md:gap-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
              >
                Game Dashboard
              </motion.h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Player Stats */}
                <AnimatedCard
                  className="bg-black/40 border-white/10 hover:border-green-500/30 transition-all duration-300"
                  delay={0}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-sm md:text-base">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Trophy className="w-4 md:w-5 h-4 md:h-5 text-yellow-400" />
                      </motion.div>
                      Player Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4">
                    <div className="flex justify-between text-white text-sm md:text-base">
                      <span>Level</span>
                      <span className="font-bold text-yellow-400">{playerStats.level}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-white text-sm">
                        <span>Experience</span>
                        <span className="font-bold">
                          {playerStats.experience} / {playerStats.maxExperience}
                        </span>
                      </div>
                      <Progress value={(playerStats.experience / playerStats.maxExperience) * 100} className="h-2" />
                    </div>
                    <div className="flex justify-between text-white text-sm md:text-base">
                      <span>Battles Won</span>
                      <span className="font-bold text-green-400">{playerStats.battlesWon}</span>
                    </div>
                    <div className="flex justify-between text-white text-sm md:text-base">
                      <span>Total Earnings</span>
                      <span className="font-bold text-purple-400">{playerStats.totalEarnings.toFixed(0)} REALM</span>
                    </div>
                  </CardContent>
                </AnimatedCard>

                {/* Resources */}
                <ResourceManager resources={resources} onHarvest={harvestResources} />

                {/* Quick Actions */}
                <AnimatedCard
                  className="bg-black/40 border-white/10 hover:border-blue-500/30 transition-all duration-300"
                  delay={400}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2 text-sm md:text-base">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Gamepad2 className="w-4 md:w-5 h-4 md:h-5 text-green-400" />
                      </motion.div>
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 md:space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300 text-sm shadow-lg shadow-red-500/25"
                      onClick={() => {
                        playSound("battle")
                        startBattle()
                      }}
                    >
                      <Sword className="w-4 h-4 mr-2" />
                      Start Battle
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 transition-all duration-300 text-sm shadow-lg shadow-green-500/25"
                      onClick={() => {
                        playSound("harvest")
                        harvestResources()
                      }}
                    >
                      <Gem className="w-4 h-4 mr-2" />
                      Harvest Resources
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:scale-105 transition-all duration-300 text-sm shadow-lg shadow-purple-500/25">
                      <Crown className="w-4 h-4 mr-2" />
                      Explore Land
                    </Button>
                    <Button
                      onClick={() => setActiveTab("guilds")}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 text-sm shadow-lg shadow-blue-500/25"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Guild
                    </Button>
                  </CardContent>
                </AnimatedCard>
              </div>

              {/* Active Quests */}
              <AnimatedCard
                className="bg-black/40 border-white/10 hover:border-purple-500/30 transition-all duration-300"
                delay={600}
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </motion.div>
                    Active Quests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeQuests.map((quest, index) => (
                    <motion.div
                      key={quest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-600/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm md:text-base">{quest.name}</h4>
                          <p className="text-gray-400 text-xs md:text-sm">{quest.description}</p>
                          <div className="flex justify-between mt-2">
                            <span className="text-blue-400 text-xs md:text-sm">
                              Progress: {quest.progress}/{quest.target}
                            </span>
                            <span className="text-yellow-400 text-xs md:text-sm">+{quest.realmReward} REALM</span>
                          </div>
                          <Progress value={(quest.progress / quest.target) * 100} className="h-1 mt-1" />
                        </div>
                        {quest.progress >= quest.target && !quest.completed && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xs shadow-lg"
                            onClick={() => {
                              playSound("success")
                              completeQuest(quest.id)
                            }}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </AnimatedCard>

              {/* Battle System */}
              <BattleSystem />
            </div>
          </TabsContent>

          {/* PVP Tab */}
          <TabsContent value="pvp" className="mt-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6"
            >
              Player vs Player
            </motion.h2>
            <PVPSystem
              matches={pvpMatches}
              realmBalance={playerStats.realmBalance}
              onCreateMatch={createPVPMatch}
              onJoinMatch={joinPVPMatch}
              currentPlayer={account || ""}
            />
          </TabsContent>

          {/* Swap Tab */}
          <TabsContent value="swap" className="mt-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6"
            >
              Token Swap
            </motion.h2>
            <SwapSystem
              realmBalance={playerStats.realmBalance}
              usdtBalance={playerStats.usdtBalance}
              onSwapUSDTToREALM={swapUSDTToREALM}
              onSwapREALMToUSDT={swapREALMToUSDT}
            />
          </TabsContent>

          {/* Staking Tab */}
          <TabsContent value="staking" className="mt-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-6"
            >
              REALM Staking
            </motion.h2>
            <StakingSystem
              realmBalance={playerStats.realmBalance}
              stakedAmount={playerStats.stakedAmount}
              stakingRewards={playerStats.stakingRewards}
              onStake={stakeREALM}
              onUnstake={unstakeREALM}
              onClaimRewards={claimStakingRewards}
            />
          </TabsContent>

          {/* Referral Tab */}
          <TabsContent value="referral" className="mt-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent mb-6"
            >
              Referral Program
            </motion.h2>
            <ReferralSystem
              referralCode={playerStats.referralCode}
              referredBy={playerStats.referredBy}
              totalEarnings={playerStats.totalEarnings}
              onUseReferralCode={useReferralCode}
            />
          </TabsContent>

          {/* Guilds Tab */}
          <TabsContent value="guilds" className="mt-6">
            <GuildSystem />
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-6">
            <div className="grid gap-4 md:gap-6">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              >
                Leaderboard
              </motion.h2>

              <AnimatedCard
                className="bg-black/40 border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                delay={0}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    {[
                      { rank: 1, name: "DragonSlayer", score: 15420, avatar: "🐉", earnings: "2,450 REALM" },
                      { rank: 2, name: "CryptoKnight", score: 14890, avatar: "⚔️", earnings: "2,180 REALM" },
                      { rank: 3, name: "MysticMage", score: 13750, avatar: "🔮", earnings: "1,950 REALM" },
                      { rank: 4, name: "SunflowerFarm", score: 12340, avatar: "🌻", earnings: "1,720 REALM" },
                      { rank: 5, name: "IceQueen", score: 11890, avatar: "❄️", earnings: "1,580 REALM" },
                    ].map((player, index) => (
                      <motion.div
                        key={player.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-lg hover:from-white/10 hover:to-white/15 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div
                            className={`w-6 md:w-8 h-6 md:h-8 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg ${
                              player.rank === 1
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                                : player.rank === 2
                                  ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                  : player.rank === 3
                                    ? "bg-gradient-to-r from-amber-600 to-amber-700"
                                    : "bg-gradient-to-r from-blue-600 to-blue-700"
                            }`}
                          >
                            {player.rank}
                          </div>
                          <div className="text-lg md:text-2xl">{player.avatar}</div>
                          <div>
                            <span className="text-white font-medium text-sm md:text-base">{player.name}</span>
                            <div className="text-gray-400 text-xs">{player.earnings}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 md:w-4 h-3 md:h-4 text-green-400" />
                            <span className="text-white font-bold text-sm md:text-base">
                              {player.score.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-gray-400 text-xs">XP</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </TabsContent>

          {/* Admin Tab */}
          {isAdmin && (
            <TabsContent value="admin" className="mt-6">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
