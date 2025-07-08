"use client"

import { useState } from "react"
import { useSound } from "./sound-manager"

interface Battle {
  id: number
  player1: string
  player2: string
  wager: number
  status: string
  winner: string
  created_at: string
  player1_name?: string
}

interface ServerPVPSystemProps {
  availableBattles: Battle[]
  userBattles: Battle[]
  realmBalance: number
  energy: number
  onCreateBattle: (wager: number) => void
  onJoinBattle: (battleId: number) => void
  onCancelBattle: (battleId: number) => void
  currentPlayer: string
}

export function ServerPVPSystem({
  availableBattles,
  userBattles,
  realmBalance,
  energy,
  onCreateBattle,
  onJoinBattle,
  onCancelBattle,
  currentPlayer,
}: ServerPVPSystemProps) {
  const [wagerAmount, setWagerAmount] = useState("")
  const { playSound } = useSound()

  const handleCreateBattle = () => {
    const wager = Number.parseFloat(wagerAmount)
    if (isNaN(wager) || wager <= 0) return

    if (energy < 20) {
      return
    }

    playSound("click")
    onCreateBattle(wager)
    setWagerAmount("")
  }

  const handleJoinBattle = (battleId: number) => {
    if (energy < 20) {
      return
    }

    playSound("battle")
    onJoinBattle(battleId)
  }

  const handleCancelBattle = (battleId: number) => {
    playSound("click")
    onCancelBattle(battleId)
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const myWaitingBattles = userBattles.filter((b) => b.status === "waiting" && b.player1 === currentPlayer)

  // Additional code can be added here if needed
}
