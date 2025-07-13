"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, DollarSign, TrendingUp, Clock } from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Órdenes Totales",
      value: "156",
      change: "+12%",
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Gastado Total",
      value: "$1,234",
      change: "+8%",
      icon: DollarSign,
      color: "text-green-600 bg-green-100",
    },
    {
      title: "Tasa de Éxito",
      value: "98.5%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Tiempo Promedio",
      value: "15 min",
      change: "-5%",
      icon: Clock,
      color: "text-orange-600 bg-orange-100",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
              </div>
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
