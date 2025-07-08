"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard } from "./animated-card"
import { useSound } from "./sound-manager"
import { Users, Gift, Copy, Share, Star, TrendingUp } from "lucide-react"

interface ReferralSystemProps {
  referralCode: string
  referredBy: string
  totalEarnings: number
  onUseReferralCode: (code: string) => void
}

export function ReferralSystem({ referralCode, referredBy, totalEarnings, onUseReferralCode }: ReferralSystemProps) {
  const [inputCode, setInputCode] = useState("")
  const { playSound } = useSound()

  const handleUseCode = () => {
    if (!inputCode.trim()) return

    playSound("success")
    onUseReferralCode(inputCode.trim().toUpperCase())
    setInputCode("")
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    playSound("click")
  }

  const shareReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    playSound("click")
  }

  return (
    <div className="space-y-6">
      {/* Referral Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Your Code</p>
            <p className="text-white font-bold text-xl">{referralCode}</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-black/40 border-white/10" delay={100}>
          <CardContent className="p-4 text-center">
            <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Referral Bonus</p>
            <p className="text-green-400 font-bold text-xl">10%</p>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">Total Earnings</p>
            <p className="text-yellow-400 font-bold text-xl">{totalEarnings.toFixed(0)} REALM</p>
          </CardContent>
        </AnimatedCard>
      </div>

      {/* Share Your Code */}
      <AnimatedCard className="bg-black/40 border-white/10" delay={300}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share className="w-5 h-5 text-blue-400" />
            Share Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Your Referral Code</span>
              <Badge className="bg-blue-600 text-white">{referralCode}</Badge>
            </div>
            <div className="flex gap-2">
              <Button onClick={copyReferralCode} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button onClick={shareReferralLink} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Share className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>

          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
            <h4 className="text-green-400 font-medium mb-2">How it works:</h4>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-green-400" />
                <span>Share your code with friends</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-green-400" />
                <span>They get 5% bonus on first purchase</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-green-400" />
                <span>You earn 10% of their spending</span>
              </div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Use Referral Code */}
      {!referredBy && (
        <AnimatedCard className="bg-black/40 border-white/10" delay={400}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-400" />
              Use Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referral-code" className="text-white">
                Enter Referral Code
              </Label>
              <Input
                id="referral-code"
                placeholder="Enter code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="bg-gray-800 border-gray-600 text-white mt-1"
              />
            </div>

            <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-400 text-sm">Get 100 REALM tokens bonus when you use a referral code!</p>
            </div>

            <Button
              onClick={handleUseCode}
              disabled={!inputCode.trim()}
              className="w-full bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300"
            >
              <Gift className="w-4 h-4 mr-2" />
              Apply Code
            </Button>
          </CardContent>
        </AnimatedCard>
      )}

      {/* Already Referred */}
      {referredBy && (
        <AnimatedCard className="bg-black/40 border-white/10" delay={400}>
          <CardContent className="p-4 text-center">
            <Gift className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Already Referred!</h3>
            <p className="text-gray-300">
              You were referred by: <span className="text-green-400 font-bold">{referredBy}</span>
            </p>
            <Badge className="bg-green-600 text-white mt-2">Bonus Applied</Badge>
          </CardContent>
        </AnimatedCard>
      )}
    </div>
  )
}
