"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, RefreshCw } from "lucide-react"

export function OrdersTable() {
  const orders = [
    {
      id: "12345",
      service: "Instagram Seguidores",
      quantity: "1000",
      status: "Completado",
      amount: "$0.50",
      date: "2024-01-15",
    },
    {
      id: "12344",
      service: "TikTok Likes",
      quantity: "500",
      status: "En Progreso",
      amount: "$0.20",
      date: "2024-01-15",
    },
    {
      id: "12343",
      service: "YouTube Vistas",
      quantity: "2000",
      status: "Pendiente",
      amount: "$1.60",
      date: "2024-01-14",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800"
      case "En Progreso":
        return "bg-blue-100 text-blue-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-sm">#{order.id}</span>
                <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
              </div>
              <p className="text-sm text-gray-600">{order.service}</p>
              <p className="text-xs text-gray-500">
                {order.quantity} unidades • {order.date}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <span className="font-semibold text-green-600">{order.amount}</span>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                {order.status === "En Progreso" && (
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
