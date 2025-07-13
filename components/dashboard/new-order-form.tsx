"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Loader2 } from "lucide-react"

export function NewOrderForm() {
  const [services, setServices] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [quantity, setQuantity] = useState("")
  const [link, setLink] = useState("")
  const [submitting, setSubmitting] = useState(false)

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

  const selectedServiceData = selectedService
    ? Object.values(services)
        .flat()
        .find((s: any) => s.id.toString() === selectedService)
    : null

  const totalCost =
    selectedServiceData && quantity
      ? ((selectedServiceData.rate * Number.parseInt(quantity)) / 1000).toFixed(4)
      : "0.0000"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !quantity || !link) return

    setSubmitting(true)

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: Number.parseInt(selectedService),
          link,
          quantity: Number.parseInt(quantity),
          userId: "user123", // Replace with actual user ID
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("¡Orden creada exitosamente!")
        // Reset form
        setSelectedPlatform("")
        setSelectedService("")
        setQuantity("")
        setLink("")
      } else {
        alert("Error: " + data.error)
      }
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Error al crear la orden")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="platform">Plataforma</Label>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una plataforma" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(services).map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPlatform && (
        <div>
          <Label htmlFor="service">Servicio</Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un servicio" />
            </SelectTrigger>
            <SelectContent>
              {services[selectedPlatform]?.map((service: any) => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.name} - ${service.rate.toFixed(4)}/1K
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedServiceData && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="text-sm space-y-1">
              <p>
                <strong>Precio:</strong> ${selectedServiceData.rate.toFixed(4)} por 1000
              </p>
              <p>
                <strong>Mínimo:</strong> {selectedServiceData.min.toLocaleString()}
              </p>
              <p>
                <strong>Máximo:</strong> {selectedServiceData.max.toLocaleString()}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedServiceData.type}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <Label htmlFor="link">Enlace</Label>
        <Input
          id="link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://instagram.com/tu-perfil"
          required
        />
      </div>

      <div>
        <Label htmlFor="quantity">Cantidad</Label>
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="1000"
          min={selectedServiceData?.min}
          max={selectedServiceData?.max}
          required
        />
      </div>

      {quantity && selectedServiceData && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Costo Total:</span>
              </div>
              <span className="text-lg font-bold text-green-600">${totalCost}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
        disabled={!selectedService || !quantity || !link || submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creando Orden...
          </>
        ) : (
          "Crear Orden"
        )}
      </Button>
    </form>
  )
}
