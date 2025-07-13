"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bitcoin, Zap, Shield, Headphones, RefreshCw, Users, Globe, Smartphone } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Bitcoin,
      title: "Pagos en Crypto",
      description: "Bitcoin, USDT, Ethereum y más. Sin restricciones bancarias.",
      color: "text-orange-600 bg-orange-100",
    },
    {
      icon: Zap,
      title: "Entrega Instantánea",
      description: "La mayoría de servicios se entregan en menos de 30 minutos.",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Servicios de alta calidad que no violan términos de servicio.",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: Headphones,
      title: "Soporte 24/7",
      description: "Equipo de soporte disponible en español las 24 horas.",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: RefreshCw,
      title: "Garantía de Reposición",
      description: "Si hay algún problema, reponemos tu servicio gratis.",
      color: "text-red-600 bg-red-100",
    },
    {
      icon: Users,
      title: "Panel de Revendedor",
      description: "Gana dinero revendiendo nuestros servicios con tu marca.",
      color: "text-indigo-600 bg-indigo-100",
    },
    {
      icon: Globe,
      title: "API Completa",
      description: "Integra nuestros servicios en tu plataforma con nuestra API.",
      color: "text-teal-600 bg-teal-100",
    },
    {
      icon: Smartphone,
      title: "Móvil Optimizado",
      description: "Funciona perfectamente en cualquier dispositivo móvil.",
      color: "text-pink-600 bg-pink-100",
    },
  ]

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">¿Por Qué Elegir CubaBoost?</h2>
          <p className="text-xl text-gray-600">Características que nos hacen únicos en el mercado</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
