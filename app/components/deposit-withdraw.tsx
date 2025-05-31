"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownToLine, ArrowUpFromLine, AlertCircle, Coins } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDepositWithdraw } from "../hooks/use-deposit-withdraw"

export default function DepositWithdraw() {
  const { deposit, withdraw, loading, usdtBalance, gameBalance, farmTokens, convertFarmToUsdt, contractStats } =
    useDepositWithdraw()

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

  const handleConvertAndWithdraw = async () => {
    await convertFarmToUsdt()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>

        <TabsContent value="deposit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Deposit USDT
              </CardTitle>
              <CardDescription>Deposit USDT BEP20 tokens to start farming</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>10% deposit fee applies. Make sure you're connected to BSC network.</AlertDescription>
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
                <p className="text-sm text-gray-600">Wallet Balance: {usdtBalance.toFixed(2)} USDT</p>
                {depositAmount && (
                  <p className="text-sm text-orange-600">
                    Fee: {(Number.parseFloat(depositAmount) * 0.1).toFixed(2)} USDT | You'll receive:{" "}
                    {(Number.parseFloat(depositAmount) * 0.9).toFixed(2)} USDT
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Deposit Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Network: Binance Smart Chain (BSC)</p>
                  <p>• Token: USDT BEP20</p>
                  <p>• Minimum deposit: 1 USDT</p>
                  <p>• Deposit fee: 10% (goes to treasury)</p>
                  <p>• Gas fees paid in BNB</p>
                </div>
              </div>

              <Button
                onClick={handleDeposit}
                disabled={loading || !depositAmount || Number.parseFloat(depositAmount) <= 0}
                className="w-full"
              >
                <ArrowDownToLine className="w-4 h-4 mr-2" />
                {loading ? "Processing..." : "Deposit USDT"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                Convert FARM to USDT
              </CardTitle>
              <CardDescription>Convert your harvested FARM tokens to USDT at current market price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Your FARM Tokens</span>
                  <span className="text-xl sm:text-2xl font-bold text-yellow-600">{farmTokens.toFixed(2)} FARM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current FARM Price</span>
                  <span className="text-sm font-medium">${contractStats.currentFarmPrice.toFixed(4)} USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">You'll receive</span>
                  <span className="text-sm font-medium">
                    {(farmTokens * contractStats.currentFarmPrice).toFixed(2)} USDT
                  </span>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  FARM price is dynamic based on total USDT in pools. More USDT = higher FARM price.
                </AlertDescription>
              </Alert>

              <Button onClick={handleConvertAndWithdraw} disabled={loading || farmTokens <= 0} className="w-full">
                <Coins className="w-4 h-4 mr-2" />
                {loading ? "Converting..." : `Convert ${farmTokens.toFixed(2)} FARM to USDT`}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ArrowUpFromLine className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Withdraw USDT
              </CardTitle>
              <CardDescription>Withdraw your USDT back to your wallet</CardDescription>
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
                <p className="text-sm text-gray-600">Available Balance: {gameBalance.toFixed(2)} USDT</p>
                {withdrawAmount && Number.parseFloat(withdrawAmount) >= 2 && (
                  <p className="text-sm text-orange-600">
                    Fee: $1 USDT | You'll receive: ${(Number.parseFloat(withdrawAmount) - 1).toFixed(2)} USDT
                  </p>
                )}
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Withdrawal Information</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Instant withdrawal to your wallet</p>
                  <p>• Minimum withdrawal: $2 USDT</p>
                  <p>• Withdrawal fee: $1 USDT</p>
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
                {loading ? "Processing..." : "Withdraw USDT"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
