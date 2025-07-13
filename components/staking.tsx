"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Zap, TrendingUp, AlertCircle } from "lucide-react"
import { sendTransaction } from "@/lib/ton-connect"
import type { User as GameUser, StakingPositionEntry } from "@/lib/storage"

interface StakingProps {
  user: GameUser
  wallet: any
}

export default function Staking({ user, wallet }: StakingProps) {
  const [stakeAmount, setStakeAmount] = useState("")
  const [staking, setStaking] = useState(false)
  const [unstaking, setUnstaking] = useState(false)
  const [stakingData, setStakingData] = useState<{
    positions: StakingPositionEntry[]
    totalStaked: number
    totalRewards: number
    apy: number
  }>({
    positions: [],
    totalStaked: 0,
    totalRewards: 0,
    apy: 0.12,
  })

  const MIN_STAKE = 1

  useEffect(() => {
    if (user.id) {
      fetchStakingData()
    }
  }, [user.id])

  const fetchStakingData = async () => {
    try {
      const response = await fetch(`/api/staking?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setStakingData(data)
      } else {
        console.error("Failed to fetch staking data:", data.error)
      }
    } catch (error) {
      console.error("Fetch staking data error:", error)
    }
  }

  const handleStake = async () => {
    if (!wallet || !stakeAmount || Number.parseFloat(stakeAmount) < MIN_STAKE) return

    setStaking(true)
    try {
      const amount = Number.parseFloat(stakeAmount)
      const amountInNanotons = Math.floor(amount * 1e9)

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: "EQD_your_staking_contract_address", // Replace with actual contract address
            amount: amountInNanotons.toString(),
            payload: "te6cckEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==", // Example payload, replace with actual
          },
        ],
      }

      const result = await sendTransaction(transaction)

      if (result) {
        const response = await fetch("/api/staking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            action: "stake",
            amount: amount,
            txHash: result.boc,
          }),
        })

        const data = await response.json()
        if (data.success) {
          setStakeAmount("")
          fetchStakingData() // Refresh staking data
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
          }
        } else {
          console.error("Failed to record stake:", data.error)
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
          }
        }
      }
    } catch (error) {
      console.error("Staking error:", error)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
      }
    } finally {
      setStaking(false)
    }
  }

  const handleUnstake = async (positionId: string) => {
    if (!wallet) return

    setUnstaking(true)
    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: "EQD_your_staking_contract_address", // Replace with actual contract address
            amount: "50000000", // 0.05 TON for gas, adjust as needed
            payload: "te6cckEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==", // Example payload, replace with actual
          },
        ],
      }

      const result = await sendTransaction(transaction)

      if (result) {
        const response = await fetch("/api/staking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            action: "unstake",
            positionId: positionId,
            txHash: result.boc,
          }),
        })

        const data = await response.json()
        if (data.success) {
          fetchStakingData() // Refresh staking data
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
          }
        } else {
          console.error("Failed to record unstake:", data.error)
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
          }
        }
      }
    } catch (error) {
      console.error("Unstaking error:", error)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
      }
    } finally {
      setUnstaking(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Staking Overview */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            TON Staking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-300">{(stakingData.apy * 100).toFixed(0)}%</div>
              <div className="text-sm text-white/70">Annual APY</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-300">{MIN_STAKE}</div>
              <div className="text-sm text-white/70">Min Stake (TON)</div>
            </div>
          </div>

          {!wallet ? (
            <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-white/70">Connect your wallet to start staking</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">Stake Amount (TON)</label>
                <Input
                  type="number"
                  placeholder="1.0"
                  min={MIN_STAKE}
                  step="0.1"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-black/20 border-white/20 text-white"
                />
                {stakeAmount && (
                  <p className="text-blue-300 text-sm mt-1">
                    Estimated yearly rewards: {(Number.parseFloat(stakeAmount) * stakingData.apy).toFixed(2)} TON
                  </p>
                )}
              </div>

              {Number.parseFloat(stakeAmount || "0") < MIN_STAKE && stakeAmount && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Minimum stake is {MIN_STAKE} TON
                </div>
              )}

              <Button
                onClick={handleStake}
                disabled={staking || !stakeAmount || Number.parseFloat(stakeAmount) < MIN_STAKE}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {staking ? "Staking..." : "Stake TON"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staking Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-blue-400">{stakingData.totalStaked.toFixed(2)}</div>
            <div className="text-sm text-white/70">Total Staked</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-green-400">{stakingData.totalRewards.toFixed(4)}</div>
            <div className="text-sm text-white/70">Pending Rewards</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Positions */}
      {stakingData.positions.length > 0 && (
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Staking Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stakingData.positions.map((position: any, index) => {
                const stakingDays = Math.floor(
                  (new Date().getTime() - new Date(position.start_date).getTime()) / (1000 * 60 * 60 * 24),
                )
                const pendingRewards = (position.ton_amount * stakingData.apy * stakingDays) / 365

                return (
                  <div key={index} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-white font-medium">{position.ton_amount} TON</div>
                        <div className="text-white/50 text-sm">Staked {stakingDays} days ago</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                        +{pendingRewards.toFixed(4)} TON
                      </Badge>
                    </div>
                    <Button
                      onClick={() => handleUnstake(position.id)}
                      disabled={unstaking}
                      variant="outline"
                      size="sm"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      {unstaking ? "Unstaking..." : "Unstake"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Staking Info */}
      <Card className="bg-gradient-to-r from-green-500/20 to-teal-500/20 border-green-500/30">
        <CardContent className="p-4">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            How Staking Works
          </h3>
          <div className="space-y-2 text-white/70 text-sm">
            <p>• Stake your TON to earn {(stakingData.apy * 100).toFixed(0)}% annual rewards</p>
            <p>• Rewards are calculated daily and compound automatically</p>
            <p>• You can unstake anytime with no lock-up period</p>
            <p>• Minimum stake: {MIN_STAKE} TON</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
