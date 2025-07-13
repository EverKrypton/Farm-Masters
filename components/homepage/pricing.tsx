"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown } from "lucide-react"

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      price: { monthly: 9, annual: 90 },
      features: ["5 Logo designs per month", "Basic templates", "PNG export", "Email support", "Basic documentation"],
      popular: false,
    },
    {
      name: "Professional",
      description: "Best for growing businesses and teams",
      price: { monthly: 29, annual: 290 },
      features: [
        "Unlimited logo designs",
        "Premium templates",
        "All export formats (PNG, SVG, PDF)",
        "Advanced editing tools",
        "Team collaboration",
        "Custom documentation",
        "Priority support",
        "Brand guidelines",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: { monthly: 99, annual: 990 },
      features: [
        "Everything in Professional",
        "White-label solution",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantee",
        "Advanced analytics",
        "Custom training",
      ],
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                !isAnnual ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
              onClick={() => setIsAnnual(false)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isAnnual ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
              }`}
              onClick={() => setIsAnnual(true)}
            >
              Annual
              <Badge variant="secondary" className="ml-2">
                Save 20%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-xl" : "hover:shadow-lg"} transition-shadow duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span className="text-gray-600">/{isAnnual ? "year" : "month"}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full mt-6 ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
          <Button variant="ghost">Compare all features →</Button>
        </div>
      </div>
    </section>
  )
}
