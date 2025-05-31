"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sprout, Clock, Coins, Droplets } from "lucide-react"
import { useFarming } from "../hooks/use-farming"

const FARMING_POOLS = [
  {
    id: 1,
    name: "Starter Farm",
    description: "Perfect for beginners - daily rewards, low risk",
    minDeposit: 10,
    maxDeposit: 500,
    dailyReward: "1%",
    duration: 7,
    icon: "🌱",
    rarity: "Common",
  },
  {
    id: 2,
    name: "Growth Farm",
    description: "Balanced daily rewards for growing farmers",
    minDeposit: 25,
    maxDeposit: 1000,
    dailyReward: "1.5%",
    duration: 10,
    icon: "🌾",
    rarity: "Uncommon",
  },
  {
    id: 3,
    name: "Premium Farm",
    description: "High daily yield farming for experienced investors",
    minDeposit: 50,
    maxDeposit: 5000,
    dailyReward: "2%",
    duration: 14,
    icon: "🌽",
    rarity: "Rare",
  },
  {
    id: 4,
    name: "Whale Farm",
    description: "Exclusive pool for big investors with maximum daily returns",
    minDeposit: 100,
    maxDeposit: 50000,
    dailyReward: "3%",
    duration: 21,
    icon: "🌺",
    rarity: "Legendary",
  },
]

export default function FarmingPools() {
  const { activeFarms, plantCrop, harvestCrop, loading } = useFarming()
  const [selectedPool, setSelectedPool] = useState<number | null>(null)
  const [depositAmount, setDepositAmount] = useState("")

  const handlePlant = async (poolId: number) => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) return
    await plantCrop(poolId, Number.parseFloat(depositAmount))
    setDepositAmount("")
    setSelectedPool(null)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100 text-gray-800"
      case "Uncommon":
        return "bg-green-100 text-green-800"
      case "Rare":
        return "bg-blue-100 text-blue-800"
      case "Legendary":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {activeFarms.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-600" />
            Your Active Farms
          </h3>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {activeFarms.map((farm) => (
              <Card key={farm.id} className="border-green-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">{farm.icon}</span>
                      <div>
                        <CardTitle className="text-sm sm:text-base">{farm.name}</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          {farm.deposited} USDT deposited
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getRarityColor(farm.rarity)}>{farm.rarity}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Progress</span>
                      <span>{farm.progress}%</span>
                    </div>
                    <Progress value={farm.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{farm.timeLeft} days left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span>{farm.expectedReward} FARM</span>
                    </div>
                  </div>

                  {farm.progress >= 100 && (
                    <Button onClick={() => harvestCrop(farm.id)} disabled={loading} className="w-full">
                      <Sprout className="w-4 h-4 mr-2" />
                      Harvest ({farm.expectedReward} FARM)
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-600" />
          Available Farming Pools
        </h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {FARMING_POOLS.map((pool) => (
            <Card key={pool.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">{pool.icon}</span>
                    <div>
                      <CardTitle className="text-sm sm:text-lg">{pool.name}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">{pool.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={getRarityColor(pool.rarity)}>{pool.rarity}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Daily Reward</span>
                    <p className="font-semibold text-green-600">{pool.dailyReward}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration</span>
                    <p className="font-semibold">{pool.duration} days</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Min Deposit</span>
                    <p className="font-semibold">${pool.minDeposit}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Deposit</span>
                    <p className="font-semibold">${pool.maxDeposit}</p>
                  </div>
                </div>

                {selectedPool === pool.id ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`deposit-${pool.id}`}>Deposit Amount (USDT)</Label>
                      <Input
                        id={`deposit-${pool.id}`}
                        type="number"
                        placeholder={`Min: $${pool.minDeposit}`}
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        min={pool.minDeposit}
                        max={pool.maxDeposit}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handlePlant(pool.id)}
                        disabled={loading || !depositAmount || Number.parseFloat(depositAmount) < pool.minDeposit}
                        className="flex-1"
                      >
                        Plant Crop
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedPool(null)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setSelectedPool(pool.id)} className="w-full">
                    Start Farming
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
