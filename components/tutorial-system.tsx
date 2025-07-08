"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { useSound } from "./sound-manager"
import { ArrowRight, ArrowLeft, X, CheckCircle, Lightbulb, Target, Gift, Star, Sparkles } from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  position: "top" | "bottom" | "left" | "right" | "center"
  action?: "click" | "hover" | "wait"
  reward?: {
    type: "xp" | "nft" | "currency"
    amount: number
    description: string
  }
}

const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to CryptoRealm!",
    description:
      "Let's get you started on your epic NFT gaming journey. This tutorial will guide you through all the essential features.",
    position: "center",
    reward: {
      type: "xp",
      amount: 100,
      description: "Welcome Bonus XP",
    },
  },
  {
    id: "connect-wallet",
    title: "Connect Your Wallet",
    description:
      "First, you'll need to connect your MetaMask wallet to start playing. Click the 'Connect Wallet' button.",
    target: "[data-tutorial='connect-wallet']",
    position: "bottom",
    action: "click",
    reward: {
      type: "currency",
      amount: 0.01,
      description: "Starter ETH",
    },
  },
  {
    id: "explore-marketplace",
    title: "Explore the Marketplace",
    description:
      "Browse and purchase NFTs that will help you in battles and quests. Each NFT has unique stats and abilities.",
    target: "[data-tutorial='marketplace-tab']",
    position: "bottom",
    action: "click",
  },
  {
    id: "game-dashboard",
    title: "Game Dashboard",
    description: "This is your command center! Here you can see your stats, active quests, and start battles.",
    target: "[data-tutorial='game-tab']",
    position: "bottom",
    action: "click",
  },
  {
    id: "complete",
    title: "Tutorial Complete!",
    description:
      "Congratulations! You're now ready to embark on your CryptoRealm adventure. Good luck, and may fortune favor you!",
    position: "center",
    reward: {
      type: "nft",
      amount: 1,
      description: "Starter NFT Pack",
    },
  },
]

interface TutorialSystemProps {
  isActive: boolean
  onComplete: () => void
  onSkip: () => void
}

export function TutorialSystem({ isActive, onComplete, onSkip }: TutorialSystemProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const { playSound } = useSound()

  useEffect(() => {
    if (isActive) {
      setIsVisible(true)
      playSound("notification")
    }
  }, [isActive, playSound])

  const currentTutorialStep = tutorialSteps[currentStep]
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  const nextStep = () => {
    playSound("click")

    if (currentTutorialStep.reward) {
      playSound("success")
    }

    setCompletedSteps((prev) => [...prev, currentTutorialStep.id])

    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTutorial()
    }
  }

  const prevStep = () => {
    playSound("click")
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    playSound("click")
    setIsVisible(false)
    onSkip()
  }

  const completeTutorial = () => {
    playSound("levelup")
    setIsVisible(false)
    onComplete()
  }

  const closeTutorial = () => {
    playSound("click")
    setIsVisible(false)
    onSkip()
  }

  if (!isVisible || !isActive) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Tutorial Card - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-sm mx-4 md:max-w-md"
        >
          <Card className="bg-gray-900 border-blue-500 shadow-2xl">
            <CardContent className="p-4 md:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                  <Badge className="bg-blue-600 text-white text-xs">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={closeTutorial} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Tutorial Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-bold text-base md:text-lg mb-2 flex items-center gap-2">
                    {currentTutorialStep.title}
                    {completedSteps.includes(currentTutorialStep.id) && (
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    )}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{currentTutorialStep.description}</p>
                </div>

                {/* Reward */}
                {currentTutorialStep.reward && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium text-sm">Reward</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {currentTutorialStep.reward.type === "xp" && <Star className="w-4 h-4 text-blue-400" />}
                      {currentTutorialStep.reward.type === "currency" && <span className="text-lg">💰</span>}
                      {currentTutorialStep.reward.type === "nft" && <Sparkles className="w-4 h-4 text-purple-400" />}
                      <span className="text-white text-sm">
                        {currentTutorialStep.reward.amount} {currentTutorialStep.reward.description}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Action hint */}
                {currentTutorialStep.action && (
                  <div className="flex items-center gap-2 text-blue-400 text-sm">
                    <Target className="w-4 h-4" />
                    <span>
                      {currentTutorialStep.action === "click" && "Tap the highlighted element"}
                      {currentTutorialStep.action === "hover" && "Touch the highlighted element"}
                      {currentTutorialStep.action === "wait" && "Wait for the action to complete"}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="border-gray-600 text-white bg-transparent hover:bg-white/10 text-sm px-3 py-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>

                <div className="flex gap-1">
                  {tutorialSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "bg-blue-500 scale-125"
                          : index < currentStep
                            ? "bg-green-500"
                            : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-sm px-3 py-2"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Skip button for mobile */}
              <div className="mt-4 text-center">
                <Button variant="ghost" onClick={skipTutorial} className="text-gray-400 hover:text-white text-sm">
                  Skip Tutorial
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)

  useEffect(() => {
    // Check if tutorial was completed before
    const completed = localStorage.getItem("cryptorealm-tutorial-completed")
    const skipped = localStorage.getItem("cryptorealm-tutorial-skipped")

    if (completed === "true" || skipped === "true") {
      setTutorialCompleted(true)
      setShowTutorial(false)
    } else {
      // Show tutorial for new users after a short delay
      const timer = setTimeout(() => {
        setShowTutorial(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const completeTutorial = () => {
    setShowTutorial(false)
    setTutorialCompleted(true)
    localStorage.setItem("cryptorealm-tutorial-completed", "true")
    localStorage.removeItem("cryptorealm-tutorial-skipped")
  }

  const skipTutorial = () => {
    setShowTutorial(false)
    setTutorialCompleted(true)
    localStorage.setItem("cryptorealm-tutorial-skipped", "true")
  }

  const restartTutorial = () => {
    setShowTutorial(true)
    setTutorialCompleted(false)
    localStorage.removeItem("cryptorealm-tutorial-completed")
    localStorage.removeItem("cryptorealm-tutorial-skipped")
  }

  return {
    showTutorial,
    tutorialCompleted,
    completeTutorial,
    skipTutorial,
    restartTutorial,
  }
}
