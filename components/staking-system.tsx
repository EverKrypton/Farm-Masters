"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard } from "./animated-card"
import { useSound } from "./sound-manager"
import { Coins, TrendingUp, Gift, Lock, Unlock, Star } from "lucide-react"

interface StakingSystemProps {
  realmBalance: number
  stakedAmount: number
  stakingRewards: number
  onStake: (amount: number) => void
  onUnstake: (amount: number) => void
  onClaimRewards: () => void
}

export function StakingSystem({
  realmBalance,
  stakedAmount,
  stakingRewards,
  onStake,
  onUnstake,
  onClaimRewards,
}: StakingSystemProps) {
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")
  const { playSound } = useSound()

  const handleStake = () => {
    const amount = Number.parseFloat(stakeAmount)
    if (isNaN(amount) || amount <= 0) return

    playSound("success")
    onStake(amount)
    setStakeAmount("")
  }

  const handleUnstake = () => {
    const amount = Number.parseFloat(unstakeAmount)
    if (isNaN(amount) || amount <= 0) return

    playSound("click")
    onUnstake(amount)
    setUnstakeAmount("")
  }

  const handleClaimRewards = () => {
    playSound("success")
    onClaimRewards()
  }

  const totalValue = stakedAmount + stakingRewards
  const dailyReward = stakedAmount * 0.001 // 0.1% daily
  const annualAPY = 36.5 // Approximate APY

  return (
    <div className="space-y-6">
      {/* Staking Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
          <CardContent className="p-4 text-center">
            <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Staked Amount</p>
            <p className="text-white font-bold text-xl">{stakedAmount.toFixed(0)} REALM</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-black/40 border-white/10" delay={100}>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">APY</p>
            <p className="text-green-400 font-bold text-xl">{annualAPY}%</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
          <CardContent className="p-4 text-center">
            <Gift className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Pending Rewards</p>
            <p className="text-yellow-400 font-bold text-xl">{stakingRewards.toFixed(2)} REALM</p>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Staking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stake Tokens */}
        <AnimatedCard className="bg-black/40 border-white/10" delay={300}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              Stake REALM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="stake-amount" className="text-white">
                Amount to Stake
              </Label>
              <Input
                id="stake-amount"
                type="number"
                placeholder="Enter amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
              <div className="flex justify-between mt-1">
                <p className="text-gray-400 text-xs">Available: {realmBalance.toFixed(0)} REALM</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStakeAmount(realmBalance.toString())}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                >
                  MAX
                </Button>
              </div>
            </div>

            {stakeAmount && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-white">
                    <span>Daily Rewards</span>
                    <span>{(Number.parseFloat(stakeAmount) * 0.001).toFixed(2)} REALM</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Monthly Rewards</span>
                    <span>{(Number.parseFloat(stakeAmount) * 0.001 * 30).toFixed(2)} REALM</span>
                  </div>
                  <div className="flex justify-between text-green-400 font-bold">
                    <span>Yearly Rewards</span>
                    <span>{(Number.parseFloat(stakeAmount) * 0.365).toFixed(2)} REALM</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleStake}
              disabled={
                !stakeAmount || Number.parseFloat(stakeAmount) <= 0 || Number.parseFloat(stakeAmount) > realmBalance
              }
              className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
            >
              <Lock className="w-4 h-4 mr-2" />
              Stake Tokens
            </Button>
          </CardContent>
        </AnimatedCard>

        {/* Unstake Tokens */}
        <AnimatedCard className="bg-black/40 border-white/10" delay={400}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Unlock className="w-5 h-5 text-orange-400" />
              Unstake REALM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="unstake-amount" className="text-white">
                Amount to Unstake
              </Label>
              <Input
                id="unstake-amount"
                type="number"
                placeholder="Enter amount"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
              <div className="flex justify-between mt-1">
                <p className="text-gray-400 text-xs">Staked: {stakedAmount.toFixed(0)} REALM</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUnstakeAmount(stakedAmount.toString())}
                  className="text-orange-400 hover:text-orange-300 text-xs"
                >
                  MAX
                </Button>
              </div>
            </div>

            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-400 text-sm">
                Unstaking is instant. You can unstake your tokens at any time without penalties.
              </p>
            </div>

            <Button
              onClick={handleUnstake}
              disabled={
                !unstakeAmount ||
                Number.parseFloat(unstakeAmount) <= 0 ||
                Number.parseFloat(unstakeAmount) > stakedAmount
              }
              className="w-full bg-orange-600 hover:bg-orange-700 hover:scale-105 transition-all duration-300"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Unstake Tokens
            </Button>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Rewards Section */}
      <AnimatedCard className="bg-black/40 border-white/10" delay={500}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Staking Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Pending Rewards</span>
                  <Badge className="bg-yellow-600 text-white">{stakingRewards.toFixed(2)} REALM</Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Daily Rate</span>
                    <span>0.1%</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Next Reward</span>
                    <span>{dailyReward.toFixed(2)} REALM</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleClaimRewards}
                disabled={stakingRewards <= 0}
                className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 hover:scale-105 transition-all duration-300"
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim Rewards
              </Button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium mb-3">Staking Benefits</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <Star className="w-3 h-3" />
                    <span>Earn passive income</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Star className="w-3 h-3" />
                    <span>No lock-up period</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Star className="w-3 h-3" />
                    <span>Compound rewards</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <Star className="w-3 h-3" />
                    <span>Governance voting rights</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium mb-2">Total Value</h4>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-bold text-lg">{totalValue.toFixed(2)} REALM</span>
                </div>
                <p className="text-gray-400 text-xs mt-1">Staked + Rewards</p>
              </div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </div>
  )
}
