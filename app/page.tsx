"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useWeb3 } from "@/components/web3-provider"
import { useServerGameLogic } from "@/hooks/use-server-game-logic"
import { useSound } from "@/components/sound-manager"
import { AnimatedCard } from "@/components/animated-card"
import { MobileNav } from "@/components/mobile-nav"
import { GuildSystem } from "@/components/guild-system"
import { ServerSwapSystem } from "@/components/server-swap-system"
import { StakingSystem } from "@/components/staking-system"
import { ReferralSystem } from "@/components/referral-system"
import AdminPanel from "@/components/admin-panel"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Wallet,
  Coins,
  Sword,
  Star,
  ShoppingCart,
  Plus,
  Gamepad2,
  Trophy,
  Users,
  Sparkles,
  Crown,
  Gem,
  Settings,
  Menu,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowUpDown,
  Swords,
  Lock,
  Gift,
} from "lucide-react"

interface NFT {
  id: number
  token_id: number
  name: string
  rarity: "Common" | "Rare" | "Epic" | "Legendary"
  price: number
  stats?: any
  type: "Character" | "Weapon" | "Land" | "Resource"
  image_url: string
}

export default function NFTGame() {
  const [activeTab, setActiveTab] = useState("marketplace")
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()
  const { account, isConnected, balance, connectWallet, mintNFT, buyNFT, isAdmin } = useWeb3()
  const {
    playerStats,
    marketData,
    availableBattles,
    userBattles,
    marketplaceNFTs,
    guilds,
    userGuild,
    dailyCheckin,
    buyNFT: buyNFTWithREALM,
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
  } = useServerGameLogic()
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
      await buyNFTWithREALM(nft.id)
      playSound("success")
    } catch (error) {
      playSound("error")
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
              {isConnected && playerStats && (
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
                    {playerStats.realm_balance.toFixed(0)} REALM
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
                <div className="flex gap-2">
                  <Button
                    onClick={dailyCheckin}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/25"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Daily Check-in
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/25">
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
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {marketplaceNFTs.map((nft, index) => (
                  <AnimatedCard
                    key={nft.id}
                    delay={index * 100}
                    className="nft-card bg-black/40 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                  >
                    <CardHeader className="pb-2">
                      <div className="relative group">
                        <img
                          src={nft.image_url || "/placeholder.svg"}
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
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white text-sm md:text-lg">{nft.name}</h3>
                        <p className="text-gray-400 text-xs md:text-sm">{nft.type}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 md:w-4 h-3 md:h-4 text-yellow-400" />
                          <span className="text-white font-bold text-sm md:text-base">{nft.price} REALM</span>
                        </div>
                        <Button
                          onClick={() => handleBuyNFT(nft)}
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 text-xs md:text-sm shadow-lg"
                          disabled={isLoading || !playerStats || playerStats.realm_balance < nft.price}
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

          {/* Swap Tab */}
          <TabsContent value="swap" className="mt-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent mb-6"
            >
              Token Swap
            </motion.h2>
            {playerStats && (
              <ServerSwapSystem
                realmBalance={playerStats.realm_balance}
                usdtBalance={playerStats.usdt_balance}
                canWithdraw={playerStats.can_withdraw}
                marketData={marketData}
                onSwapUSDTToREALM={swapUSDTToREALM}
                onSwapREALMToUSDT={swapREALMToUSDT}
              />
            )}
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
            {playerStats && (
              <StakingSystem
                realmBalance={playerStats.realm_balance}
                stakedAmount={playerStats.staked_amount}
                stakingRewards={playerStats.staking_rewards}
                onStake={stakeREALM}
                onUnstake={unstakeREALM}
                onClaimRewards={claimStakingRewards}
              />
            )}
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
            {playerStats && (
              <ReferralSystem
                referralCode={playerStats.referral_code}
                referredBy={playerStats.referred_by}
                totalEarnings={playerStats.referral_earnings}
                onUseReferralCode={useReferralCode}
              />
            )}
          </TabsContent>

          {/* Guilds Tab */}
          <TabsContent value="guilds" className="mt-6">
            <GuildSystem />
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
