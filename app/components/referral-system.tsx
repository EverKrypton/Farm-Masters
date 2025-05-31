"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Copy, DollarSign, TrendingUp, Gift, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useReferral } from "../hooks/use-referral"
import { useToast } from "@/hooks/use-toast"

export default function ReferralSystem() {
  const { referralData, setReferrer, withdrawReferralEarnings, loading } = useReferral()
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

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralData.myReferralCode)
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard",
    })
  }

  const handleSetReferrer = async () => {
    if (!referralCode.trim()) return
    await setReferrer(referralCode.trim().toUpperCase())
    setReferralCode("")
  }

  const handleWithdrawReferrals = async () => {
    await withdrawReferralEarnings()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Pending Referral Code Alert */}
      {referralData.pendingReferralCode && !referralData.hasReferrer && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Referral Code Detected:</strong> {referralData.pendingReferralCode} will be automatically applied
            when you make your first deposit.
          </AlertDescription>
        </Alert>
      )}

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
            Your Referral Code & Link
          </CardTitle>
          <CardDescription>
            Share your referral code or link with friends and earn 10% commission on their deposits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Referral Code</Label>
            <div className="flex gap-2">
              <Input value={referralData.myReferralCode} readOnly className="font-mono text-lg font-bold text-center" />
              <Button onClick={copyReferralCode} variant="outline" size="sm">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Referral Link (Automatic)</Label>
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
          </div>

          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">How Referrals Work</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>
                • <strong>Automatic:</strong> Share your referral link - no code entry needed!
              </li>
              <li>
                • <strong>Manual:</strong> Friends can enter your code manually below
              </li>
              <li>• You earn 10% commission on all their deposits</li>
              <li>• Withdraw referral earnings anytime (no fees)</li>
              <li>• No limit on referrals - invite unlimited friends</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {!referralData.hasReferrer && !referralData.pendingReferralCode && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Referral Code (Manual)</CardTitle>
            <CardDescription>
              If someone referred you and you didn't use their link, enter their referral code manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="referral-code">Referral Code</Label>
              <Input
                id="referral-code"
                placeholder="Enter 6-character referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="font-mono text-center"
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: You can only set a referrer once, before making any deposits
              </p>
            </div>
            <Button onClick={handleSetReferrer} disabled={!referralCode || loading || referralCode.length !== 6}>
              {loading ? "Setting..." : "Set Referrer"}
            </Button>
          </CardContent>
        </Card>
      )}

      {(referralData.hasReferrer || referralData.pendingReferralCode) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Referrer Status
            </CardTitle>
            <CardDescription>Your referral status and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              {referralData.hasReferrer ? (
                <>
                  <p className="text-sm text-green-600 font-medium">✅ Referrer Set Successfully</p>
                  <p className="text-xs text-green-500 mt-1">Your referrer earns 10% commission on your deposits</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-blue-600 font-medium">🔄 Referrer Pending</p>
                  <p className="text-xs text-blue-500 mt-1">
                    Code {referralData.pendingReferralCode} will be applied on your first deposit
                  </p>
                </>
              )}
            </div>
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
