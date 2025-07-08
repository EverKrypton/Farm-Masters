"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedCard } from "@/components/animated-card"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Coins,
  Users,
  Sword,
  Shield,
  Trophy,
  Target,
  Gem,
  Star,
  Gamepad2,
  ShoppingCart,
  TrendingUp,
  Gift,
  Play,
  CheckCircle,
} from "lucide-react"

const tutorialSteps = [
  {
    id: 1,
    title: "Getting Started",
    description: "Learn the basics of CryptoRealm",
    content: [
      {
        step: "Connect Your Wallet",
        description: "Connect your MetaMask wallet to start playing. This allows you to buy, sell, and mint NFTs.",
        icon: <Coins className="w-5 h-5 text-yellow-400" />,
        reward: "0.01 ETH Starter Bonus",
      },
      {
        step: "Explore the Marketplace",
        description:
          "Browse and purchase NFTs with unique stats and abilities. Each NFT has different rarities and powers.",
        icon: <ShoppingCart className="w-5 h-5 text-blue-400" />,
        reward: "Welcome NFT Pack",
      },
      {
        step: "Check Your Inventory",
        description: "View all your NFTs, check their stats, and manage your collection.",
        icon: <Shield className="w-5 h-5 text-purple-400" />,
        reward: "Inventory Organization Tips",
      },
    ],
  },
  {
    id: 2,
    title: "Game Mechanics",
    description: "Master the core gameplay systems",
    content: [
      {
        step: "Battle System",
        description:
          "Engage in turn-based battles with your NFTs. Choose enemies, use special attacks, and earn rewards.",
        icon: <Sword className="w-5 h-5 text-red-400" />,
        reward: "First Battle XP Bonus",
      },
      {
        step: "Resource Management",
        description:
          "Harvest resources like crystals, wood, and gold. Resources regenerate over time and are used for upgrades.",
        icon: <Gem className="w-5 h-5 text-green-400" />,
        reward: "Resource Multiplier",
      },
      {
        step: "Quest System",
        description:
          "Complete quests to earn XP and rewards. Track your progress and claim rewards when objectives are met.",
        icon: <Target className="w-5 h-5 text-orange-400" />,
        reward: "Quest Completion Bonus",
      },
    ],
  },
  {
    id: 3,
    title: "Advanced Features",
    description: "Unlock the full potential of the game",
    content: [
      {
        step: "Guild System",
        description: "Join or create guilds for exclusive benefits, group activities, and social features.",
        icon: <Users className="w-5 h-5 text-pink-400" />,
        reward: "Guild Membership Benefits",
      },
      {
        step: "NFT Upgrading",
        description: "Level up your NFTs to increase their stats and unlock new abilities.",
        icon: <Star className="w-5 h-5 text-yellow-400" />,
        reward: "Upgrade Materials",
      },
      {
        step: "Competitive Play",
        description: "Compete on leaderboards and participate in tournaments for exclusive rewards.",
        icon: <Trophy className="w-5 h-5 text-gold-400" />,
        reward: "Tournament Entry",
      },
    ],
  },
]

const tokenomicsData = {
  totalSupply: "1,000,000,000 REALM",
  distribution: [
    { category: "Play-to-Earn Rewards", percentage: 40, amount: "400,000,000 REALM", color: "bg-green-500" },
    { category: "Liquidity & DEX", percentage: 20, amount: "200,000,000 REALM", color: "bg-blue-500" },
    { category: "Development Team", percentage: 15, amount: "150,000,000 REALM", color: "bg-purple-500" },
    { category: "Marketing & Partnerships", percentage: 10, amount: "100,000,000 REALM", color: "bg-orange-500" },
    { category: "Community Treasury", percentage: 10, amount: "100,000,000 REALM", color: "bg-pink-500" },
    { category: "Advisors & Early Investors", percentage: 5, amount: "50,000,000 REALM", color: "bg-yellow-500" },
  ],
  utilities: [
    {
      title: "In-Game Currency",
      description: "Use REALM tokens to purchase NFTs, upgrade items, and access premium features.",
      icon: <Coins className="w-6 h-6 text-yellow-400" />,
    },
    {
      title: "Staking Rewards",
      description: "Stake REALM tokens to earn passive income and unlock exclusive content.",
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
    },
    {
      title: "Governance Rights",
      description: "Vote on game updates, new features, and community proposals.",
      icon: <Users className="w-6 h-6 text-blue-400" />,
    },
    {
      title: "Tournament Entry",
      description: "Pay entry fees for high-stakes tournaments with REALM token prizes.",
      icon: <Trophy className="w-6 h-6 text-purple-400" />,
    },
  ],
  economics: [
    {
      title: "Deflationary Mechanism",
      description: "2% of all transactions are burned, reducing total supply over time.",
      value: "2% Burn Rate",
    },
    {
      title: "Play-to-Earn Pool",
      description: "Daily rewards distributed to active players based on performance.",
      value: "1,000,000 REALM/day",
    },
    {
      title: "Staking APY",
      description: "Annual percentage yield for staking REALM tokens.",
      value: "12-25% APY",
    },
    {
      title: "Transaction Fee",
      description: "Platform fee for marketplace transactions.",
      value: "2.5% Fee",
    },
  ],
}

const gameMechanics = [
  {
    title: "NFT Rarity System",
    description: "NFTs come in four rarity tiers, each with different stat ranges and abilities.",
    details: [
      { rarity: "Common", chance: "60%", statRange: "10-30", color: "text-gray-400" },
      { rarity: "Rare", chance: "25%", statRange: "25-50", color: "text-blue-400" },
      { rarity: "Epic", chance: "12%", statRange: "45-75", color: "text-purple-400" },
      { rarity: "Legendary", chance: "3%", statRange: "70-100", color: "text-yellow-400" },
    ],
  },
  {
    title: "Battle System",
    description: "Turn-based combat with strategy elements and special abilities.",
    details: [
      { feature: "Turn-based Combat", description: "Strategic gameplay with attack, defend, and special moves" },
      { feature: "Elemental Types", description: "Fire, Ice, Lightning, and Earth elements with advantages" },
      { feature: "Energy System", description: "Limited energy for battles, regenerates over time" },
      { feature: "Experience Gain", description: "Win battles to gain XP and level up your NFTs" },
    ],
  },
  {
    title: "Resource Economy",
    description: "Collect and manage various resources for crafting and upgrades.",
    details: [
      { resource: "Sunflowers", use: "Basic crafting material", rate: "5/hour" },
      { resource: "Crystals", use: "NFT upgrades and enchantments", rate: "2/hour" },
      { resource: "Wood", use: "Building and construction", rate: "8/hour" },
      { resource: "Gold", use: "Premium transactions", rate: "1/hour" },
    ],
  },
  {
    title: "Guild Benefits",
    description: "Join guilds for exclusive perks and collaborative gameplay.",
    details: [
      { benefit: "XP Bonuses", description: "20-30% additional experience from activities" },
      { benefit: "Exclusive NFTs", description: "Guild-only NFT collections and rewards" },
      { benefit: "Group Challenges", description: "Collaborative quests with shared rewards" },
      { benefit: "Trading Discounts", description: "Reduced fees for guild member transactions" },
    ],
  },
]

export default function DocsPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Game
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="w-8 h-8 text-blue-400" />
                <h1 className="text-xl md:text-2xl font-bold text-white">CryptoRealm Docs</h1>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white">Documentation</Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tutorial" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/10 mb-8">
            <TabsTrigger value="tutorial" className="data-[state=active]:bg-blue-600">
              <Play className="w-4 h-4 mr-2" />
              Tutorial
            </TabsTrigger>
            <TabsTrigger value="tokenomics" className="data-[state=active]:bg-green-600">
              <Coins className="w-4 h-4 mr-2" />
              Tokenomics
            </TabsTrigger>
            <TabsTrigger value="mechanics" className="data-[state=active]:bg-purple-600">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Game Mechanics
            </TabsTrigger>
          </TabsList>

          {/* Tutorial Tab */}
          <TabsContent value="tutorial">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Getting Started Guide
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Learn how to play CryptoRealm and master all the game features step by step.
                </p>
              </motion.div>

              {/* Progress Overview */}
              <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-400" />
                    Tutorial Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-white">
                      <span>Completed Steps</span>
                      <span className="font-bold">
                        {completedSteps.length} /{" "}
                        {tutorialSteps.reduce((acc, section) => acc + section.content.length, 0)}
                      </span>
                    </div>
                    <Progress
                      value={
                        (completedSteps.length /
                          tutorialSteps.reduce((acc, section) => acc + section.content.length, 0)) *
                        100
                      }
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Tutorial Sections */}
              <div className="space-y-8">
                {tutorialSteps.map((section, sectionIndex) => (
                  <AnimatedCard key={section.id} className="bg-black/40 border-white/10" delay={sectionIndex * 100}>
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {section.id}
                        </div>
                        {section.title}
                      </CardTitle>
                      <p className="text-gray-400">{section.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {section.content.map((step, stepIndex) => {
                          const globalStepIndex =
                            tutorialSteps.slice(0, sectionIndex).reduce((acc, s) => acc + s.content.length, 0) +
                            stepIndex
                          const isCompleted = completedSteps.includes(globalStepIndex)

                          return (
                            <motion.div
                              key={stepIndex}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: stepIndex * 0.1 }}
                              className={`p-4 rounded-lg border transition-all duration-300 ${
                                isCompleted
                                  ? "bg-green-500/20 border-green-500/30"
                                  : "bg-white/5 border-white/10 hover:border-white/20"
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">{step.icon}</div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-white font-medium">{step.step}</h4>
                                    {isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                                  </div>
                                  <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                                  <div className="flex items-center justify-between">
                                    <Badge className="bg-yellow-600 text-white text-xs">
                                      <Gift className="w-3 h-3 mr-1" />
                                      {step.reward}
                                    </Badge>
                                    <Button
                                      size="sm"
                                      onClick={() => markStepComplete(globalStepIndex)}
                                      disabled={isCompleted}
                                      className={`text-xs ${
                                        isCompleted
                                          ? "bg-green-600 hover:bg-green-700"
                                          : "bg-blue-600 hover:bg-blue-700"
                                      }`}
                                    >
                                      {isCompleted ? "Completed" : "Mark Complete"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tokenomics Tab */}
          <TabsContent value="tokenomics">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  REALM Token Economics
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Learn about the REALM token distribution, utilities, and economic mechanisms.
                </p>
              </motion.div>

              {/* Token Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
                  <CardContent className="p-6 text-center">
                    <Coins className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">Total Supply</h3>
                    <p className="text-2xl font-bold text-yellow-400">{tokenomicsData.totalSupply}</p>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard className="bg-black/40 border-white/10" delay={100}>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">Burn Rate</h3>
                    <p className="text-2xl font-bold text-green-400">2% per transaction</p>
                  </CardContent>
                </AnimatedCard>

                <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
                  <CardContent className="p-6 text-center">
                    <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">Staking APY</h3>
                    <p className="text-2xl font-bold text-purple-400">12-25%</p>
                  </CardContent>
                </AnimatedCard>
              </div>

              {/* Token Distribution */}
              <AnimatedCard className="bg-black/40 border-white/10" delay={300}>
                <CardHeader>
                  <CardTitle className="text-white">Token Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tokenomicsData.distribution.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-white">
                          <span>{item.category}</span>
                          <span className="font-bold">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
                        </div>
                        <p className="text-gray-400 text-sm">{item.amount}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Token Utilities */}
              <AnimatedCard className="bg-black/40 border-white/10" delay={400}>
                <CardHeader>
                  <CardTitle className="text-white">Token Utilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tokenomicsData.utilities.map((utility, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="flex-shrink-0">{utility.icon}</div>
                        <div>
                          <h4 className="text-white font-medium mb-2">{utility.title}</h4>
                          <p className="text-gray-300 text-sm">{utility.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>

              {/* Economic Metrics */}
              <AnimatedCard className="bg-black/40 border-white/10" delay={500}>
                <CardHeader>
                  <CardTitle className="text-white">Economic Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {tokenomicsData.economics.map((metric, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-medium">{metric.title}</h4>
                          <Badge className="bg-blue-600 text-white">{metric.value}</Badge>
                        </div>
                        <p className="text-gray-300 text-sm">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </TabsContent>

          {/* Game Mechanics Tab */}
          <TabsContent value="mechanics">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Game Mechanics
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Understand the core systems that power CryptoRealm gameplay.
                </p>
              </motion.div>

              {/* Game Mechanics Sections */}
              <div className="space-y-8">
                {gameMechanics.map((mechanic, index) => (
                  <AnimatedCard key={index} className="bg-black/40 border-white/10" delay={index * 100}>
                    <CardHeader>
                      <CardTitle className="text-white">{mechanic.title}</CardTitle>
                      <p className="text-gray-400">{mechanic.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mechanic.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="p-4 bg-white/5 rounded-lg">
                            {detail.rarity ? (
                              <div className="flex justify-between items-center">
                                <span className={`font-medium ${detail.color}`}>{detail.rarity}</span>
                                <div className="text-right">
                                  <div className="text-white text-sm">Drop Rate: {detail.chance}</div>
                                  <div className="text-gray-400 text-xs">Stats: {detail.statRange}</div>
                                </div>
                              </div>
                            ) : detail.feature ? (
                              <div>
                                <h4 className="text-white font-medium mb-1">{detail.feature}</h4>
                                <p className="text-gray-300 text-sm">{detail.description}</p>
                              </div>
                            ) : detail.resource ? (
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-white font-medium">{detail.resource}</h4>
                                  <p className="text-gray-400 text-sm">{detail.use}</p>
                                </div>
                                <Badge className="bg-green-600 text-white">{detail.rate}</Badge>
                              </div>
                            ) : detail.benefit ? (
                              <div>
                                <h4 className="text-white font-medium mb-1">{detail.benefit}</h4>
                                <p className="text-gray-300 text-sm">{detail.description}</p>
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
