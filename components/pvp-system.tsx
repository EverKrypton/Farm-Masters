"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AnimatedCard } from "./animated-card"
import { useSound } from "./sound-manager"
import { motion } from "framer-motion"
import { Swords, Trophy, Users, Plus, Clock, Coins, Target } from "lucide-react"

interface PVPMatch {
  id: string
  player1: string
  player2: string
  wager: number
  status: "waiting" | "active" | "completed"
  winner?: string
  createdAt: number
}

interface PVPSystemProps {
  matches: PVPMatch[]
  realmBalance: number
  onCreateMatch: (wager: number) => void
  onJoinMatch: (matchId: string) => void
  currentPlayer: string
}

export function PVPSystem({ matches, realmBalance, onCreateMatch, onJoinMatch, currentPlayer }: PVPSystemProps) {
  const [wagerAmount, setWagerAmount] = useState("")
  const { playSound } = useSound()

  const handleCreateMatch = () => {
    const wager = Number.parseFloat(wagerAmount)
    if (isNaN(wager) || wager <= 0) return

    playSound("click")
    onCreateMatch(wager)
    setWagerAmount("")
  }

  const handleJoinMatch = (matchId: string) => {
    playSound("battle")
    onJoinMatch(matchId)
  }

  const formatTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const waitingMatches = matches.filter((m) => m.status === "waiting" && m.player1 !== currentPlayer)
  const myMatches = matches.filter((m) => m.player1 === currentPlayer || m.player2 === currentPlayer)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Swords className="w-6 h-6 text-red-400" />
          PVP Arena
        </h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 hover:scale-105 transition-all duration-300">
              <Plus className="w-4 h-4 mr-2" />
              Create Match
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-md mx-4">
            <DialogHeader>
              <DialogTitle className="text-white">Create PVP Match</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="wager" className="text-white">
                  Wager Amount (REALM)
                </Label>
                <Input
                  id="wager"
                  type="number"
                  placeholder="Enter wager amount"
                  value={wagerAmount}
                  onChange={(e) => setWagerAmount(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                />
                <p className="text-gray-400 text-xs mt-1">Available: {realmBalance.toFixed(0)} REALM</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-400 text-sm">
                  Winner takes all! The victor receives the total wager amount (minus platform fee).
                </p>
              </div>
              <Button
                onClick={handleCreateMatch}
                disabled={
                  !wagerAmount || Number.parseFloat(wagerAmount) <= 0 || Number.parseFloat(wagerAmount) > realmBalance
                }
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Create Match
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available Matches */}
      <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Available Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {waitingMatches.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No matches available. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {waitingMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{match.player1.slice(2, 4).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {match.player1.slice(0, 6)}...{match.player1.slice(-4)}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-400">{formatTimeAgo(match.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-2">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-bold">{match.wager} REALM</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleJoinMatch(match.id)}
                        disabled={realmBalance < match.wager}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        Join Battle
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </AnimatedCard>

      {/* My Matches */}
      <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            My Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myMatches.length === 0 ? (
            <div className="text-center py-8">
              <Swords className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No matches yet. Create or join a match to start battling!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {match.player1.slice(2, 4).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white text-sm">VS</span>
                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {match.player2 ? match.player2.slice(2, 4).toUpperCase() : "?"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-yellow-400" />
                          <span className="text-white font-medium text-sm">{match.wager} REALM</span>
                        </div>
                        <p className="text-gray-400 text-xs">{formatTimeAgo(match.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${
                          match.status === "waiting"
                            ? "bg-yellow-600"
                            : match.status === "active"
                              ? "bg-blue-600"
                              : match.winner === currentPlayer
                                ? "bg-green-600"
                                : "bg-red-600"
                        } text-white`}
                      >
                        {match.status === "waiting"
                          ? "Waiting"
                          : match.status === "active"
                            ? "Active"
                            : match.winner === currentPlayer
                              ? "Won"
                              : "Lost"}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
