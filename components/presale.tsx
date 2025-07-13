"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Wallet, AlertCircle } from "lucide-react"
import { sendTransaction } from "@/lib/ton-connect"
import type { User as GameUser, TransactionEntry } from "@/lib/storage"

interface PreSaleProps {
  user: GameUser
  wallet: any
}

export default function PreSale({ user, wallet }: PreSaleProps) {
  const [tonAmount, setTonAmount] = useState("")
  const [purchasing, setPurchasing] = useState(false)
  const [userInvestments, setUserInvestments] = useState<{
    totalInvested: number
    totalTokens: number
    transactions: TransactionEntry[]
  }>({
    totalInvested: 0,
    totalTokens: 0,
    transactions: [],
  })

  const PRESALE_RATE = 1000 // 1000 tokens per 1 TON
  const MIN_PURCHASE = 0.1

  useEffect(() => {
    if (user.id) {
      fetchUserInvestments()
    }
  }, [user.id])

  const fetchUserInvestments = async () => {
    try {
      const response = await fetch(`/api/presale?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setUserInvestments(data)
      } else {
        console.error("Failed to fetch investments:", data.error)
      }
    } catch (error) {
      console.error("Fetch investments error:", error)
    }
  }

  const handlePurchase = async () => {
    if (!wallet || !tonAmount || Number.parseFloat(tonAmount) < MIN_PURCHASE) return

    setPurchasing(true)
    try {
      const amount = Number.parseFloat(tonAmount)
      const amountInNanotons = Math.floor(amount * 1e9)

      // Create transaction for TON Connect
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes
        messages: [
          {
            address: "EQD_your_presale_contract_address", // Replace with actual contract address
            amount: amountInNanotons.toString(),
            payload: "te6cckEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==", // Example payload, replace with actual
          },
        ],
      }

      const result = await sendTransaction(transaction)

      if (result) {
        // Record the purchase in our storage
        const response = await fetch("/api/presale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            tonAmount: amount,
            txHash: result.boc, // Transaction hash from TON Connect
          }),
        })

        const data = await response.json()
        if (data.success) {
          setTonAmount("")
          fetchUserInvestments() // Refresh investments
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("success")
          }
        } else {
          console.error("Failed to record purchase:", data.error)
          if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
          }
        }
      }
    } catch (error) {
      console.error("Purchase error:", error)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred("error")
      }
    } finally {
      setPurchasing(false)
    }
  }

  const tokenAmount = tonAmount ? Number.parseFloat(tonAmount) * PRESALE_RATE : 0

  return (
    <div className="space-y-4">
      {/* Pre-sale Info */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Token Pre-Sale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-300">1:1000</div>
              <div className="text-sm text-white/70">TON:Token Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-300">0.1</div>
              <div className="text-sm text-white/70">Min Purchase (TON)</div>
            </div>
          </div>

          {!wallet ? (
            <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
              <Wallet className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <p className="text-white/70">Connect your wallet to participate</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm mb-2 block">TON Amount</label>
                <Input
                  type="number"
                  placeholder="0.1"
                  min={MIN_PURCHASE}
                  step="0.1"
                  value={tonAmount}
                  onChange={(e) => setTonAmount(e.target.value)}
                  className="bg-black/20 border-white/20 text-white"
                />
                {tonAmount && (
                  <p className="text-purple-300 text-sm mt-1">
                    You will receive: {tokenAmount.toLocaleString()} tokens
                  </p>
                )}
              </div>

              {Number.parseFloat(tonAmount || "0") < MIN_PURCHASE && tonAmount && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Minimum purchase is {MIN_PURCHASE} TON
                </div>
              )}

              <Button
                onClick={handlePurchase}
                disabled={purchasing || !tonAmount || Number.parseFloat(tonAmount) < MIN_PURCHASE}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {purchasing ? "Processing..." : "Buy Tokens"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Investments */}
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Your Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">{userInvestments.totalInvested.toFixed(2)}</div>
              <div className="text-sm text-white/70">TON Invested</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{userInvestments.totalTokens.toLocaleString()}</div>
              <div className="text-sm text-white/70">Tokens Purchased</div>
            </div>
          </div>

          {userInvestments.transactions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-white font-medium">Recent Transactions</h4>
              {userInvestments.transactions.slice(0, 5).map((tx: any, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <div>
                    <div className="text-white text-sm">{tx.ton_amount} TON</div>
                    <div className="text-white/50 text-xs">{new Date(tx.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    {tx.token_amount?.toLocaleString()} tokens
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
