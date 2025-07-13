"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Instagram, Facebook, Music, Youtube, Loader2 } from "lucide-react"

export function ServicesGrid() {
  const [services, setServices] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("all")

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
    instagram: { name: "Instagram", icon: Instagram, color: "text-pink-600 bg-pink-100" },
    facebook: { name: "Facebook", icon: Facebook, color: "text-blue-600 bg-blue-100" },
    tiktok: { name: "TikTok", icon: Music, color: "text-gray-600 bg-gray-100" },
    youtube: { name: "YouTube", icon: Youtube, color: "text-red-600 bg-red-100" },
  }

  const filteredServices = Object.entries(services).reduce((acc, [platform, platformServices]: [string, any]) => {
    if (selectedPlatform !== "all" && platform !== selectedPlatform) return acc

    const filtered = platformServices.filter((service: any) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filtered.length > 0) {
      acc[platform] = filtered
    }

    return acc
  }, {} as any)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={selectedPlatform === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatform("all")}
          >
            Todos
          </Button>
          {Object.entries(platformConfig).map(([platform, config]) => (
            <Button
              key={platform}
              variant={selectedPlatform === platform ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPlatform(platform)}
            >
              <config.icon className="w-4 h-4 mr-2" />
              {config.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {Object.entries(filteredServices).map(([platform, platformServices]: [string, any]) => {
        const config = platformConfig[platform as keyof typeof platformConfig]
        if (!config) return null

        return (
          <Card key={platform}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center`}>
                  <config.icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>{config.name}</CardTitle>
                  <p className="text-sm text-gray-600">{platformServices.length} servicios disponibles</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformServices.map((service: any) => (
                  <div
                    key={service.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">{service.name}</h4>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {service.type}
                        </Badge>
                        <span className="font-bold text-green-600">${service.rate.toFixed(4)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {service.min.toLocaleString()} | Max: {service.max.toLocaleString()}
                      </div>
                      <Button size="sm" className="w-full">
                        Ordenar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {Object.keys(filteredServices).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron servicios que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}
