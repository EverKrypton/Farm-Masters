"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard } from "./animated-card"
import { motion, AnimatePresence } from "framer-motion"
import { Sword, Shield, Heart, Zap, Flame, Snowflake, CloudLightningIcon as Lightning, Sparkles } from "lucide-react"

interface Enemy {
  id: string
  name: string
  image: string
  health: number
  maxHealth: number
  attack: number
  defense: number
  element: "fire" | "ice" | "lightning" | "earth"
  level: number
}

const enemies: Enemy[] = [
  {
    id: "1",
    name: "Fire Drake",
    image: "/placeholder.svg?height=150&width=150",
    health: 100,
    maxHealth: 100,
    attack: 25,
    defense: 15,
    element: "fire",
    level: 12,
  },
  {
    id: "2",
    name: "Ice Golem",
    image: "/placeholder.svg?height=150&width=150",
    health: 120,
    maxHealth: 120,
    attack: 20,
    defense: 25,
    element: "ice",
    level: 15,
  },
  {
    id: "3",
    name: "Storm Eagle",
    image: "/placeholder.svg?height=150&width=150",
    health: 80,
    maxHealth: 80,
    attack: 30,
    defense: 10,
    element: "lightning",
    level: 10,
  },
]

const Attack = () => {
  // Placeholder for Attack function
}

export function BattleSystem() {
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [isBattling, setIsBattling] = useState(false)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [currentTurn, setCurrentTurn] = useState<"player" | "enemy">("player")

  const getElementIcon = (element: string) => {
    switch (element) {
      case "fire":
        return <Flame className="w-4 h-4 text-red-500" />
      case "ice":
        return <Snowflake className="w-4 h-4 text-blue-500" />
      case "lightning":
        return <Lightning className="w-4 h-4 text-yellow-500" />
      default:
        return <Sparkles className="w-4 h-4 text-green-500" />
    }
  }

  const getElementColor = (element: string) => {
    switch (element) {
      case "fire":
        return "border-red-500/50 bg-red-500/10"
      case "ice":
        return "border-blue-500/50 bg-blue-500/10"
      case "lightning":
        return "border-yellow-500/50 bg-yellow-500/10"
      default:
        return "border-green-500/50 bg-green-500/10"
    }
  }

  const startBattle = (enemy: Enemy) => {
    setSelectedEnemy({ ...enemy })
    setPlayerHealth(100)
    setBattleLog([`Battle started against ${enemy.name}!`])
    setIsBattling(true)
    setCurrentTurn("player")
  }

  const playerAttack = () => {
    if (!selectedEnemy || currentTurn !== "player") return

    const damage = Math.floor(Math.random() * 30) + 15
    const newEnemyHealth = Math.max(0, selectedEnemy.health - damage)

    setSelectedEnemy((prev) => (prev ? { ...prev, health: newEnemyHealth } : null))
    setBattleLog((prev) => [...prev, `You dealt ${damage} damage to ${selectedEnemy.name}!`])

    if (newEnemyHealth <= 0) {
      setBattleLog((prev) => [...prev, `${selectedEnemy.name} defeated! You won!`])
      setIsBattling(false)
      return
    }

    setCurrentTurn("enemy")

    // Enemy turn after delay
    setTimeout(() => {
      enemyAttack()
    }, 1500)
  }

  const enemyAttack = () => {
    if (!selectedEnemy) return

    const damage = Math.floor(Math.random() * 20) + 10
    const newPlayerHealth = Math.max(0, playerHealth - damage)

    setPlayerHealth(newPlayerHealth)
    setBattleLog((prev) => [...prev, `${selectedEnemy.name} dealt ${damage} damage to you!`])

    if (newPlayerHealth <= 0) {
      setBattleLog((prev) => [...prev, "You were defeated! Better luck next time!"])
      setIsBattling(false)
      return
    }

    setCurrentTurn("player")
  }

  const useSpecialAttack = () => {
    if (!selectedEnemy || currentTurn !== "player") return

    const damage = Math.floor(Math.random() * 50) + 25
    const newEnemyHealth = Math.max(0, selectedEnemy.health - damage)

    setSelectedEnemy((prev) => (prev ? { ...prev, health: newEnemyHealth } : null))
    setBattleLog((prev) => [...prev, `You used a special attack and dealt ${damage} damage!`])

    if (newEnemyHealth <= 0) {
      setBattleLog((prev) => [...prev, `${selectedEnemy.name} defeated! You won!`])
      setIsBattling(false)
      return
    }

    setCurrentTurn("enemy")

    setTimeout(() => {
      enemyAttack()
    }, 1500)
  }

  const endBattle = () => {
    setSelectedEnemy(null)
    setIsBattling(false)
    setBattleLog([])
    setPlayerHealth(100)
  }

  if (selectedEnemy) {
    return (
      <AnimatedCard className="bg-black/40 border-white/10" delay={800}>
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sword className="w-5 h-5 text-red-400" />
              Battle Arena
            </span>
            <Button variant="ghost" size="sm" onClick={endBattle} className="text-white">
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Battle Scene */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player */}
            <div className="text-center space-y-3">
              <h3 className="text-white font-bold">You</h3>
              <div className="w-24 h-24 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center border-2 border-blue-500">
                <Sword className="w-8 h-8 text-blue-400" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-white">
                  <span>Health</span>
                  <span>{playerHealth}/100</span>
                </div>
                <Progress value={playerHealth} className="h-2" />
              </div>
            </div>

            {/* Enemy */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-white font-bold">{selectedEnemy.name}</h3>
                <Badge className={`${getElementColor(selectedEnemy.element)} border`}>
                  {getElementIcon(selectedEnemy.element)}
                  Lv.{selectedEnemy.level}
                </Badge>
              </div>
              <motion.div
                animate={currentTurn === "enemy" ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mx-auto"
              >
                <img
                  src={selectedEnemy.image || "/placeholder.svg"}
                  alt={selectedEnemy.name}
                  className="w-full h-full object-cover rounded-full border-2 border-red-500"
                />
              </motion.div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-white">
                  <span>Health</span>
                  <span>
                    {selectedEnemy.health}/{selectedEnemy.maxHealth}
                  </span>
                </div>
                <Progress value={(selectedEnemy.health / selectedEnemy.maxHealth) * 100} className="h-2" />
              </div>
            </div>
          </div>

          {/* Battle Actions */}
          {isBattling && currentTurn === "player" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              <Button onClick={playerAttack} className="bg-red-600 hover:bg-red-700 transition-all duration-300">
                <Sword className="w-4 h-4 mr-2" />
                Attack
              </Button>
              <Button onClick={Attack} className="bg-green-600 hover:bg-green-700 transition-all duration-300">
                <Heart className="w-4 h-4 mr-2" />
                Heal
              </Button>
              <Button
                onClick={useSpecialAttack}
                className="bg-purple-600 hover:bg-purple-700 transition-all duration-300"
              >
                <Zap className="w-4 h-4 mr-2" />
                Special Attack
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700 bg-transparent">
                <Shield className="w-4 h-4 mr-2" />
                Defend
              </Button>
            </motion.div>
          )}

          {/* Battle Log */}
          <div className="bg-black/60 rounded-lg p-4 max-h-32 overflow-y-auto">
            <h4 className="text-white font-medium mb-2">Battle Log</h4>
            <div className="space-y-1">
              <AnimatePresence>
                {battleLog.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-gray-300 text-sm"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Turn Indicator */}
          {isBattling && (
            <div className="text-center">
              <Badge className={currentTurn === "player" ? "bg-blue-600" : "bg-red-600"}>
                {currentTurn === "player" ? "Your Turn" : "Enemy Turn"}
              </Badge>
            </div>
          )}
        </CardContent>
      </AnimatedCard>
    )
  }

  return (
    <AnimatedCard className="bg-black/40 border-white/10" delay={800}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sword className="w-5 h-5 text-red-400" />
          Battle Arena
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-300 text-center">Choose an enemy to battle:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {enemies.map((enemy, index) => (
              <motion.div
                key={enemy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${getElementColor(enemy.element)}`}
                onClick={() => startBattle(enemy)}
              >
                <div className="text-center space-y-2">
                  <img
                    src={enemy.image || "/placeholder.svg"}
                    alt={enemy.name}
                    className="w-16 h-16 mx-auto object-cover rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-medium">{enemy.name}</h4>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {getElementIcon(enemy.element)}
                      <span className="text-gray-300 text-sm">Lv.{enemy.level}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>ATK: {enemy.attack}</span>
                    <span>DEF: {enemy.defense}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </AnimatedCard>
  )
}
