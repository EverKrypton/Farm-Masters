"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Copy, DollarSign, TrendingUp, Gift } from "lucide-react"
import { useReferral } from "../hooks/use-referral"
import { useToast } from "@/hooks/use-toast"

export default function ReferralSystem() {
  const { referralData, withdrawReferralEarnings, loading } = useReferral()
  const { toast } = useToast()
  const [referralCode, setReferralCode] = useState("")

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralData.myReferralCode}`
    navigator.clipboard.writeText(link)
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    })
  }

  const handleWithdrawReferrals = async () => {
    await withdrawReferralEarnings()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{referralData.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">Friends referred</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{referralData.totalEarnings.toFixed(2)} USDT</div>
            <p className="text-xs text-muted-foreground">Total earned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available to Withdraw</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{referralData.availableEarnings.toFixed(2)} USDT</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-600" />
            Your Referral Link
          </CardTitle>
          <CardDescription>Share this link with friends and earn 10% commission on their deposits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={`${window.location.origin}?ref=${referralData.myReferralCode}`}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={copyReferralLink} variant="outline" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">How Referrals Work</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Share your referral link with friends</li>
              <li>• Earn 10% commission on their deposits</li>
              <li>• Withdraw referral earnings anytime (no fees)</li>
              <li>• No limit on referrals - invite unlimited friends</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {!referralData.hasReferrer && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Referral Code</CardTitle>
            <CardDescription>If someone referred you, enter their code to give them credit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referral-code">Referral Code</Label>
              <Input
                id="referral-code"
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>
            <Button disabled={!referralCode || loading}>Submit Referral Code</Button>
          </CardContent>
        </Card>
      )}

      {referralData.availableEarnings > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Referral Earnings</CardTitle>
            <CardDescription>Withdraw your referral commissions directly to your wallet (no fees)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg mb-4">
              <div>
                <p className="font-medium">Available to Withdraw</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {referralData.availableEarnings.toFixed(2)} USDT
                </p>
              </div>
              <Button onClick={handleWithdrawReferrals} disabled={loading}>
                {loading ? "Processing..." : "Withdraw All"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Referral Activity</CardTitle>
          <CardDescription>Recent referral earnings and activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {referralData.recentActivity.length > 0 ? (
              referralData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+{activity.amount} USDT</p>
                    <p className="text-xs text-gray-500">Commission</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No referral activity yet</p>
                <p className="text-sm">Start sharing your referral link to earn commissions</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
