"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Facebook, Music, Youtube, Heart, Loader2 } from "lucide-react"

export function Services() {
  const [services, setServices] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services")
      const data = await response.json()
      if (data.success) {
        setServices(data.services)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const platformConfig = {
    instagram: { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600" },
    facebook: { name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-700" },
    tiktok: { name: "TikTok", icon: Music, color: "from-black to-gray-800" },
    youtube: { name: "YouTube", icon: Youtube, color: "from-red-600 to-red-700" },
  }

  if (loading) {
    return (
      <section id="services" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Servicios Disponibles</h2>
            <p className="text-xl text-gray-600">Cargando servicios...</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Servicios Disponibles</h2>
          <p className="text-xl text-gray-600">Precios competitivos y entrega garantizada</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(services).map(([platform, platformServices]: [string, any]) => {
            const config = platformConfig[platform as keyof typeof platformConfig]
            if (!config) return null

            const topServices = platformServices.slice(0, 4)

            return (
              <Card key={platform} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center mx-auto mb-3`}
                  >
                    <config.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{config.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {platformServices.length} servicios
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topServices.map((service: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium truncate">{service.name.substring(0, 20)}...</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">${service.rate.toFixed(3)}</div>
                        <div className="text-xs text-gray-500">por 1K</div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-4">Ver Todos ({platformServices.length})</Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Badge className="mb-4 bg-green-100 text-green-700">Servicios actualizados en tiempo real</Badge>
          <p className="text-gray-600">
            Conectados directamente con proveedores premium para garantizar la mejor calidad y velocidad.
          </p>
        </div>
      </div>
    </section>
  )
}
