"use client"

import { Users, ShoppingCart, Star, Globe } from "lucide-react"

export function Stats() {
  const stats = [
    { icon: Users, label: "Clientes Activos", value: "15,000+", color: "text-blue-600" },
    { icon: ShoppingCart, label: "Órdenes Completadas", value: "250K+", color: "text-green-600" },
    { icon: Star, label: "Calificación Promedio", value: "4.9/5", color: "text-yellow-600" },
    { icon: Globe, label: "Países Atendidos", value: "50+", color: "text-purple-600" },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-3`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
