"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownToLine, ArrowUpFromLine, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDepositWithdraw } from "../hooks/use-deposit-withdraw"

export default function DepositWithdraw() {
  const { deposit, withdraw, loading, usdtWalletBalance, gameBalance } = useDepositWithdraw()

  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")

  const handleDeposit = async () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) return
    await deposit(Number.parseFloat(depositAmount))
    setDepositAmount("")
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) return
    await withdraw(Number.parseFloat(withdrawAmount))
    setWithdrawAmount("")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Deposit USDT</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw USDT</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Deposit USDT to Game Balance
              </CardTitle>
              <CardDescription>Deposit USDT from your wallet to your game balance for farming</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  10% deposit fee applies. Deposited USDT goes to your game balance for farming.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Amount (USDT)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount to deposit"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-gray-600">Wallet Balance: {usdtWalletBalance.toFixed(2)} USDT</p>
                {depositAmount && (
                  <p className="text-sm text-orange-600">
                    Fee: {(Number.parseFloat(depositAmount) * 0.1).toFixed(2)} USDT | You'll receive:{" "}
                    {(Number.parseFloat(depositAmount) * 0.9).toFixed(2)} USDT in game balance
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                <h4 className="font-medium">How It Works</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>1. Deposit USDT from your wallet to game balance</p>
                  <p>2. Use game balance to start farming in different pools</p>
                  <p>3. Harvest FARM tokens as rewards</p>
                  <p>4. Swap FARM tokens back to USDT (in Swap section)</p>
                  <p>5. Withdraw USDT from game balance to wallet</p>
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={loading || !depositAmount || Number.parseFloat(depositAmount) <= 0}
                className="w-full"
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                {loading ? "Processing..." : "Deposit to Game Balance"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ArrowUpFromLine className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Withdraw USDT to Wallet
              </CardTitle>
              <CardDescription>Withdraw USDT from your game balance back to your wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  $1 USDT withdrawal fee applies. You must have invested before withdrawing.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (USDT)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount to withdraw"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="2"
                  step="0.01"
                  max={gameBalance}
                />
                <p className="text-sm text-gray-600">Game Balance: {gameBalance.toFixed(2)} USDT</p>
                {withdrawAmount && Number.parseFloat(withdrawAmount) >= 2 && (
                  <p className="text-sm text-orange-600">
                    Fee: $1 USDT | You'll receive: ${(Number.parseFloat(withdrawAmount) - 1).toFixed(2)} USDT in wallet
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Withdrawal Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Instant withdrawal to your wallet</p>
                  <p>• Minimum withdrawal: $2 USDT</p>
                  <p>• Withdrawal fee: $1 USDT (goes to treasury)</p>
                  <p>• Gas fees paid in BNB</p>
                </div>
              </div>

              <Button
                onClick={handleWithdraw}
                disabled={
                  loading ||
                  !withdrawAmount ||
                  Number.parseFloat(withdrawAmount) < 2 ||
                  Number.parseFloat(withdrawAmount) > gameBalance
                }
                className="w-full"
                variant="outline"
              >
                <ArrowUpFromLine className="w-4 h-4 mr-2" />
                {loading ? "Processing..." : "Withdraw to Wallet"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
