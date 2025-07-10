"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, CheckCircle, Clock, AlertCircle, ExternalLink } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"

interface CryptoPaymentProps {
  amount: number
  service: "domain" | "github"
  projectId: string
  onPaymentComplete: (paymentId: string) => void
  onCancel: () => void
}

export default function CryptoPayment({ amount, service, projectId, onPaymentComplete, onCancel }: CryptoPaymentProps) {
  const [paymentData, setPaymentData] = useState<any>(null)
  const [status, setStatus] = useState<"creating" | "pending" | "verifying" | "completed" | "expired">("creating")
  const [txHash, setTxHash] = useState("")
  const [timeLeft, setTimeLeft] = useState(30 * 60)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    createPayment()
  }, [])

  useEffect(() => {
    if (status === "pending" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus("expired")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [status, timeLeft])

  const createPayment = async () => {
    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          service,
          projectId,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setPaymentData(result.data)
        setStatus("pending")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Failed to create payment:", error)
      alert("Failed to create payment. Please try again.")
      onCancel()
    }
  }

  const verifyPayment = async () => {
    if (!txHash || !paymentData) return

    setStatus("verifying")
    try {
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId: paymentData.paymentId,
          transactionHash: txHash,
        }),
      })

      const result = await response.json()
      if (result.success) {
        setStatus("completed")
        onPaymentComplete(paymentData.paymentId)
      } else {
        setStatus("pending")
        alert(result.error || "Payment verification failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setStatus("pending")
      alert("Payment verification failed. Please try again.")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getServiceName = () => {
    return service === "domain" ? "Custom Domain" : "GitHub Integration"
  }

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "verifying":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (status === "creating") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Creating payment...</p>
        </CardContent>
      </Card>
    )
  }

  if (status === "completed") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Payment Completed!</h3>
          <p className="text-gray-600 mb-4">Your payment for {getServiceName()} has been verified successfully.</p>
          <p className="text-sm text-gray-500">You can now use this feature for your project.</p>
        </CardContent>
      </Card>
    )
  }

  if (status === "expired") {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Payment Expired</h3>
          <p className="text-gray-600 mb-4">This payment request has expired.</p>
          <div className="flex gap-3">
            <Button onClick={createPayment} className="flex-1">
              Create New Payment
            </Button>
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Pay with Ethereum
          </CardTitle>
          <Badge className={getStatusColor()}>
            {status === "pending" && <Clock className="w-3 h-3 mr-1" />}
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">{getServiceName()}</div>
          <div className="text-2xl font-bold">${amount}</div>
          <div className="text-lg text-purple-600">{paymentData?.amount_eth} ETH</div>
          <div className="text-sm text-gray-500">ETH Price: ${paymentData?.ethPrice?.toLocaleString()}</div>
          <div className="text-sm text-red-600 mt-2">Expires in: {formatTime(timeLeft)}</div>
        </div>

        {/* QR Code */}
        {paymentData && (
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border">
              <QRCodeSVG value={paymentData.qrCode} size={200} />
            </div>
          </div>
        )}

        {/* Payment Address */}
        {paymentData && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Address:</label>
            <div className="flex items-center gap-2">
              <Input value={paymentData.address} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(paymentData.address)}>
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Amount to Send */}
        {paymentData && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount to Send:</label>
            <div className="flex items-center gap-2">
              <Input value={`${paymentData.amount_eth} ETH`} readOnly className="font-mono" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(paymentData.amount_eth)}>
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Transaction Hash Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Transaction Hash (after sending):</label>
          <Input
            placeholder="0x..."
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="font-mono text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={verifyPayment} disabled={!txHash || status === "verifying"} className="flex-1">
            {status === "verifying" ? "Verifying..." : "Verify Payment"}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1 border-t pt-4">
          <p>1. Send exactly {paymentData?.amount_eth} ETH to the address above</p>
          <p>2. Copy and paste the transaction hash</p>
          <p>3. Click "Verify Payment" to confirm</p>
          <p>4. Wait for blockchain confirmation (usually 1-2 minutes)</p>
        </div>

        {/* Etherscan Link */}
        {txHash && (
          <div className="text-center">
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm flex items-center justify-center gap-1"
            >
              View on Etherscan
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
