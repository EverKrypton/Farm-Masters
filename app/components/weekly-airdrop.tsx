"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Users, Clock, DollarSign } from "lucide-react"
import { useWeeklyAirdrop } from "../hooks/use-weekly-airdrop"

export default function WeeklyAirdrop() {
  const { airdropInfo, processAirdrop, loading } = useWeeklyAirdrop()
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateTimeLeft = () => {
      if (airdropInfo.timeUntilNextAirdrop > 0) {
        const days = Math.floor(airdropInfo.timeUntilNextAirdrop / (24 * 60 * 60))
        const hours = Math.floor((airdropInfo.timeUntilNextAirdrop % (24 * 60 * 60)) / (60 * 60))
        const minutes = Math.floor((airdropInfo.timeUntilNextAirdrop % (60 * 60)) / 60)
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      } else {
        setTimeLeft("Ready!")
      }
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [airdropInfo.timeUntilNextAirdrop])

  const airdropAmount = (airdropInfo.weeklyDepositTotal * 0.01) / Math.max(airdropInfo.eligibleUsersCount, 1)

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Gift className="w-5 h-5 text-purple-600" />
            Weekly Airdrop Program
          </CardTitle>
          <CardDescription>
            Deposit $500+ USDT weekly to qualify for 1% of total weekly deposits shared among all eligible users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Airdrop Status */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 md:grid-cols-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-purple-700">
                ${airdropInfo.weeklyDepositTotal.toFixed(0)}
              </div>
              <div className="text-xs text-purple-600">Weekly Deposits</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-blue-700">{airdropInfo.eligibleUsersCount}</div>
              <div className="text-xs text-blue-600">Eligible Users</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-green-700">${airdropAmount.toFixed(2)}</div>
              <div className="text-xs text-green-600">Per User</div>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-lg sm:text-xl font-bold text-orange-700">{timeLeft}</div>
              <div className="text-xs text-orange-600">Next Airdrop</div>
            </div>
          </div>

          {/* User Status */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Your Airdrop Status</h4>
              <Badge variant={airdropInfo.isUserEligible ? "default" : "secondary"}>
                {airdropInfo.isUserEligible ? "Eligible" : "Not Eligible"}
              </Badge>
            </div>

            {airdropInfo.isUserEligible ? (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Your Weekly Deposits</span>
                  <span className="font-medium">${airdropInfo.userWeeklyDeposits?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expected Airdrop</span>
                  <span className="font-medium text-green-600">${airdropAmount.toFixed(2)} worth of FARM</span>
                </div>
                <div className="text-xs text-green-600 mt-2">
                  ✅ You qualify for this week's airdrop! FARM tokens will be distributed automatically.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Your Weekly Deposits</span>
                  <span className="font-medium">${airdropInfo.userWeeklyDeposits?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Required for Eligibility</span>
                  <span className="font-medium">$500.00</span>
                </div>
                <div className="text-xs text-orange-600 mt-2">
                  💡 Deposit at least $500 USDT this week to qualify for the airdrop!
                </div>
              </div>
            )}
          </div>

          {/* Process Airdrop Button (for eligible users when ready) */}
          {airdropInfo.timeUntilNextAirdrop === 0 && airdropInfo.eligibleUsersCount > 0 && (
            <Button onClick={processAirdrop} disabled={loading} className="w-full">
              <Gift className="w-4 h-4 mr-2" />
              {loading ? "Processing..." : "Process Weekly Airdrop"}
            </Button>
          )}

          {/* How It Works */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">How Weekly Airdrops Work</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Deposit $500+ USDT in any week to qualify</li>
              <li>• 1% of total weekly deposits is shared among all eligible users</li>
              <li>• Airdrop is paid in FARM tokens at current market price</li>
              <li>• Airdrops are distributed automatically every 7 days</li>
              <li>• More eligible users = smaller individual share</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
