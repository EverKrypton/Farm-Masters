"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Check, Zap, Crown, Rocket, Bitcoin, Wallet, Globe } from "lucide-react"

interface PricingModalProps {
  onClose: () => void
  onCreditsAdded: (credits: number) => void
  onTierUpgrade?: (tier: "free" | "pro") => void
  currentTier?: "free" | "pro"
}

export default function PricingModal({
  onClose,
  onCreditsAdded,
  onTierUpgrade,
  currentTier = "free",
}: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const creditPackages = [
    {
      id: "basic",
      name: "Basic Pack",
      icon: Zap,
      price: "$5",
      cryptoPrice: "0.002 ETH",
      credits: "$10",
      generations: "2 AI generations",
      features: ["AI-enhanced generation", "Free hosting", "SSL certificate", "Mobile responsive"],
      popular: false,
      tier: "paid",
    },
    {
      id: "pro",
      name: "Pro Pack",
      icon: Crown,
      price: "$15",
      cryptoPrice: "0.006 ETH",
      credits: "$25",
      generations: "2-3 Pro generations",
      features: [
        "Premium AI models",
        "Full source code access",
        "Custom domain binding",
        "Priority support",
        "Advanced features",
        "White-label options",
      ],
      popular: true,
      tier: "pro",
    },
    {
      id: "enterprise",
      name: "Enterprise Pack",
      icon: Rocket,
      price: "$30",
      cryptoPrice: "0.012 ETH",
      credits: "$50",
      generations: "5 Pro generations",
      features: [
        "All Pro features",
        "Bulk generation",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Team collaboration",
      ],
      popular: false,
      tier: "pro",
    },
  ]

  const handlePurchase = async (packageId: string) => {
    setSelectedPlan(packageId)

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          walletAddress: "0x1234567890abcdef",
          transactionHash: `0x${Date.now()}`,
        }),
      })

      const data = await response.json()
      if (data.success) {
        const selectedPackage = creditPackages.find((p) => p.id === packageId)
        if (selectedPackage) {
          const creditsToAdd = Number.parseInt(selectedPackage.credits.replace("$", ""))
          onCreditsAdded(creditsToAdd)

          // Upgrade tier if purchasing pro package
          if (selectedPackage.tier === "pro" && onTierUpgrade) {
            onTierUpgrade("pro")
          }
        }
        onClose()
      }
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setSelectedPlan(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Choose Your Plan</h2>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Start free, upgrade for AI-powered features and pro tools
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Free Tier Info */}
        <div className="p-4 sm:p-6 border-b border-gray-800">
          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-400">Free Tier</h3>
              {currentTier === "free" && <Badge className="bg-blue-600">Current</Badge>}
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Generate basic websites for free with our standard templates and hosting.
            </p>
            <ul className="text-sm text-gray-300 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                Basic website generation
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                Free hosting on GenUI servers
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                SSL certificate included
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-400" />
                Mobile responsive design
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {creditPackages.map((pack) => (
              <Card
                key={pack.id}
                className={`relative bg-gray-800 border-gray-700 hover:border-purple-500/50 transition-colors ${
                  pack.popular ? "ring-2 ring-purple-500/20" : ""
                }`}
              >
                {pack.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${
                      pack.tier === "pro" ? "from-yellow-500 to-orange-500" : "from-purple-500 to-pink-500"
                    } rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <pack.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-lg sm:text-xl">{pack.name}</CardTitle>
                  <div className="text-2xl sm:text-3xl font-bold text-white mt-2">{pack.price}</div>
                  <p className="text-gray-400 text-xs sm:text-sm">{pack.cryptoPrice}</p>
                  <p className="text-emerald-400 text-sm sm:text-base font-medium">{pack.credits} credits</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{pack.generations}</p>
                  {pack.tier === "pro" && (
                    <Badge className="bg-yellow-600 text-xs mt-2">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro Access
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {pack.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 sm:gap-3 text-gray-300">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full text-sm sm:text-base ${
                      pack.popular
                        ? "bg-purple-600 hover:bg-purple-700"
                        : pack.tier === "pro"
                          ? "bg-yellow-600 hover:bg-yellow-700"
                          : "bg-gray-700 hover:bg-gray-600"
                    }`}
                    onClick={() => handlePurchase(pack.id)}
                    disabled={selectedPlan === pack.id}
                  >
                    {selectedPlan === pack.id ? (
                      "Processing..."
                    ) : (
                      <>
                        <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        {pack.tier === "pro" ? "Upgrade & Add Credits" : "Add Credits"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Feature Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-300">Feature</th>
                    <th className="text-center py-2 text-blue-400">Free</th>
                    <th className="text-center py-2 text-purple-400">AI Enhanced</th>
                    <th className="text-center py-2 text-yellow-400">Pro</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Website Generation</td>
                    <td className="text-center py-2">✅ Basic</td>
                    <td className="text-center py-2">✅ AI-Powered</td>
                    <td className="text-center py-2">✅ Premium AI</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Free Hosting</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Source Code Access</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-center py-2">✅</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Custom Domains</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-center py-2">✅ ($5)</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-2">Priority Support</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-center py-2">❌</td>
                    <td className="text-center py-2">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bitcoin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              Payment Methods
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {["Bitcoin", "Ethereum", "USDC", "USDT", "Card", "PayPal"].map((method) => (
                <div key={method} className="flex items-center gap-2 text-gray-300">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full" />
                  <span className="text-xs sm:text-sm">{method}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs sm:text-sm mt-4">
              Secure payments processed instantly. Credits and upgrades applied immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
