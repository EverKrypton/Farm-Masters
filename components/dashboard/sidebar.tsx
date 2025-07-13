"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Plus, ShoppingCart, CreditCard, Users, Settings, HelpCircle, X, Wallet } from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function DashboardSidebar({ activeTab, onTabChange, isMobileOpen, onMobileClose }: DashboardSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Resumen", icon: LayoutDashboard },
    { id: "new-order", label: "Nueva Orden", icon: Plus },
    { id: "orders", label: "Mis Órdenes", icon: ShoppingCart },
    { id: "payments", label: "Pagos", icon: CreditCard },
    { id: "referrals", label: "Referidos", icon: Users },
    { id: "settings", label: "Configuración", icon: Settings },
    { id: "help", label: "Ayuda", icon: HelpCircle },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onMobileClose} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-lg font-semibold">Menú</span>
          <Button variant="ghost" size="sm" onClick={onMobileClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-2 mt-16 lg:mt-4">
          {/* Balance Card - Mobile */}
          <div className="lg:hidden bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Balance</span>
            </div>
            <div className="text-xl font-bold">$25.50</div>
            <Badge variant="secondary" className="text-xs">
              USDT
            </Badge>
          </div>

          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                onTabChange(item.id)
                onMobileClose()
              }}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </aside>
    </>
  )
}
