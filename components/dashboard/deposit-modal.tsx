"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Copy, CheckCircle, Loader2 } from "lucide-react"
import { OxaPayAPI } from "@/lib/oxapay-api"
import { useTranslation } from "@/lib/i18n"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number) => void
  userId: string
}

export function DepositModal({ isOpen, onClose, onSuccess, userId }: DepositModalProps) {
  const { t } = useTranslation()
  const [amount, setAmount] = useState("")
  const [email, setEmail] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [depositData, setDepositData] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const trxAmount = amount ? OxaPayAPI.calculateTRXAmount(Number.parseFloat(amount)) : 0

  const handleCreateDeposit = async () => {
    if (!amount || !email) {
      alert("Please fill all fields")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/deposit/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(amount),
          userId,
          email,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setDepositData(data.deposit)
        startPollingStatus(data.deposit.trackId)
      } else {
        alert("Error creating deposit: " + data.error)
      }
    } catch (error) {
      console.error("Error creating deposit:", error)
      alert("Error creating deposit. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const startPollingStatus = (trackId: number) => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/deposit/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackId }),
        })

        const data = await response.json()

        if (data.status === "paid") {
          onSuccess(Number.parseFloat(amount))
          onClose()
          return true
        } else if (data.status === "expired" || data.status === "failed") {
          alert("Deposit failed or expired. Please try again.")
          resetModal()
          return true
        }

        return false
      } catch (error) {
        console.error("Error checking deposit status:", error)
        return false
      }
    }

    const interval = setInterval(async () => {
      const completed = await checkStatus()
      if (completed) {
        clearInterval(interval)
      }
    }, 5000)

    // Stop polling after 30 minutes
    setTimeout(
      () => {
        clearInterval(interval)
      },
      30 * 60 * 1000,
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetModal = () => {
    setAmount("")
    setEmail("")
    setDepositData(null)
    setIsProcessing(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          resetModal()
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("deposit")} TRX</DialogTitle>
        </DialogHeader>

        {!depositData ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10.00"
                min="1"
                step="0.01"
              />
              {amount && <p className="text-sm text-gray-600 mt-1">≈ {trxAmount.toFixed(2)} TRX</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Currency:</strong> TRX (Tron)
                  </p>
                  <p>
                    <strong>Network:</strong> TRC20
                  </p>
                  <p>
                    <strong>Min Deposit:</strong> $1.00
                  </p>
                  <p>
                    <strong>Processing Time:</strong> 1-5 minutes
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleCreateDeposit} disabled={isProcessing || !amount || !email} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Deposit...
                </>
              ) : (
                "Create Deposit"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Complete Your Deposit</h3>
              <p className="text-gray-600">Send exactly {depositData.amount} TRX to complete your deposit</p>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Amount:</span>
                  <div className="text-right">
                    <div className="font-bold">{depositData.amount} TRX</div>
                    <div className="text-sm text-gray-600">${amount} USD</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Track ID:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{depositData.trackId}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(depositData.trackId.toString())}>
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant="secondary">{depositData.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => window.open(depositData.payLink, "_blank")} className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Payment Page
            </Button>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Status:</strong> Waiting for payment confirmation. This page will automatically update when
                payment is received.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
