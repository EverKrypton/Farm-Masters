"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, Crown, Bitcoin, Wallet, ExternalLink, Copy, CheckCircle } from "lucide-react"
import { OxaPayService } from "@/lib/oxapay"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "enterprise">("pro")
  const [paymentMethod, setPaymentMethod] = useState<"BTC" | "ETH" | "USDT">("BTC")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"select" | "details" | "payment">("select")
  const [email, setEmail] = useState("")
  const [paymentData, setPaymentData] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const plans = {
    basic: {
      name: "Basic Pro",
      price: 9.99,
      features: ["HD Export (PNG, SVG)", "Premium Fonts", "Advanced Shapes", "24/7 Support"],
    },
    pro: {
      name: "Pro",
      price: 19.99,
      features: ["Everything in Basic", "PDF Export", "Icon Library (1000+)", "Brand Kit", "Commercial License"],
    },
    enterprise: {
      name: "Enterprise",
      price: 49.99,
      features: ["Everything in Pro", "Team Collaboration", "API Access", "White Label", "Priority Support"],
    },
  }

  const cryptoOptions = [
    { id: "BTC", name: "Bitcoin", symbol: "BTC", icon: Bitcoin },
    { id: "ETH", name: "Ethereum", symbol: "ETH", icon: Wallet },
    { id: "USDT", name: "Tether", symbol: "USDT", icon: Wallet },
  ]

  const handleCreatePayment = async () => {
    if (!email) {
      alert("Please enter your email address")
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/payment/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: plans[selectedPlan].price,
          currency: paymentMethod,
          planName: plans[selectedPlan].name,
          email: email,
          orderId: `order_${Date.now()}_${selectedPlan}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPaymentData(data)
        setPaymentStep("payment")

        // Start polling for payment status
        pollPaymentStatus(data.trackId)
      } else {
        alert("Error creating payment: " + data.error)
      }
    } catch (error) {
      console.error("Error creating payment:", error)
      alert("Error creating payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const pollPaymentStatus = async (trackId: number) => {
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/payment/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trackId }),
        })

        const data = await response.json()

        if (data.status === "Paid") {
          onSuccess()
          return true
        } else if (data.status === "Expired" || data.status === "Failed") {
          alert("Payment failed or expired. Please try again.")
          setPaymentStep("select")
          return true
        }

        return false
      } catch (error) {
        console.error("Error checking payment status:", error)
        return false
      }
    }

    // Poll every 5 seconds for up to 30 minutes
    const maxAttempts = 360
    let attempts = 0

    const interval = setInterval(async () => {
      attempts++
      const completed = await checkStatus()

      if (completed || attempts >= maxAttempts) {
        clearInterval(interval)
        if (attempts >= maxAttempts) {
          alert("Payment timeout. Please check your payment and contact support if needed.")
          setPaymentStep("select")
        }
      }
    }, 5000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetModal = () => {
    setPaymentStep("select")
    setPaymentData(null)
    setEmail("")
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            {paymentStep === "payment" ? "Complete Payment" : "Upgrade to Pro"}
          </DialogTitle>
        </DialogHeader>

        {paymentStep === "select" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Selection */}
            <div className="space-y-4">
              <h3 className="font-semibold">Choose Your Plan</h3>

              {Object.entries(plans).map(([key, plan]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all ${selectedPlan === key ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setSelectedPlan(key as any)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {key === "pro" && <Badge variant="secondary">Popular</Badge>}
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">${plan.price}</span>
                      <span className="text-sm text-gray-500">
                        ({OxaPayService.formatCryptoAmount(plan.price, paymentMethod)} {paymentMethod})
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Method</h3>

              <div className="space-y-2">
                {cryptoOptions.map((crypto) => (
                  <Card
                    key={crypto.id}
                    className={`cursor-pointer transition-all ${
                      paymentMethod === crypto.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setPaymentMethod(crypto.id as any)}
                  >
                    <CardContent className="flex items-center p-4">
                      <crypto.icon className="w-6 h-6 mr-3" />
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-gray-500">{crypto.symbol}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Payment Summary */}
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="font-medium">{plans[selectedPlan].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-medium">${plans[selectedPlan].price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crypto Amount:</span>
                      <span className="font-medium">
                        {OxaPayService.formatCryptoAmount(plans[selectedPlan].price, paymentMethod)} {paymentMethod}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleCreatePayment} disabled={isProcessing || !email} className="w-full" size="lg">
                {isProcessing ? "Creating Payment..." : "Continue to Payment"}
              </Button>
            </div>
          </div>
        )}

        {paymentStep === "payment" && paymentData && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Complete Your Payment</h3>
              <p className="text-gray-600">
                Send exactly {OxaPayService.formatCryptoAmount(plans[selectedPlan].price, paymentMethod)}{" "}
                {paymentMethod} to complete your purchase
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Payment Link:</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(paymentData.payLink, "_blank")}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Payment Page
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Track ID:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{paymentData.trackId}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paymentData.trackId.toString())}>
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> This payment will expire in 30 minutes. Please complete your payment
                    before the deadline.
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Status:</strong> Waiting for payment confirmation. This page will automatically update when
                    payment is received.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="outline" onClick={resetModal}>
                Cancel Payment
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          Secure payment powered by OxaPay. No personal information stored.
        </p>
      </DialogContent>
    </Dialog>
  )
}
