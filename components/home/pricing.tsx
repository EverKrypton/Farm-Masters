"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Zap } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export function Pricing() {
  const { t } = useTranslation()

  const plans = [
    {
      name: "Básico",
      price: "$0",
      description: "Perfecto para empezar",
      features: [
        "Acceso a todos los servicios SMM",
        "Soporte por email",
        "Historial de órdenes",
        "Pagos en TRX",
        "Panel de usuario",
      ],
      buttonText: "Empezar Gratis",
      popular: false,
    },
    {
      name: "Premium",
      price: "$25",
      description: "Para usuarios frecuentes",
      features: [
        "Todo en Básico",
        "Descuentos del 10%",
        "Soporte prioritario",
        "API access",
        "Órdenes en masa",
        "Estadísticas avanzadas",
      ],
      buttonText: "Elegir Premium",
      popular: true,
    },
    {
      name: "Revendedor",
      price: "$100",
      description: "Para hacer negocio",
      features: [
        "Todo en Premium",
        "Descuentos del 20%",
        "Panel de revendedor",
        "Marca personalizada",
        "Soporte dedicado",
        "Comisiones por referidos",
      ],
      buttonText: "Ser Revendedor",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Planes de Membresía</h2>
          <p className="text-xl text-gray-600">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "ring-2 ring-blue-500 shadow-xl scale-105" : "hover:shadow-lg"} transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/mes</span>
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

                <Link href="/register">
                  <Button
                    className={`w-full mt-6 ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                    {plan.buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Todos los planes incluyen garantía de reposición y soporte técnico</p>
          <Link href="/register">
            <Button variant="ghost">Comenzar ahora →</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
