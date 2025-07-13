"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { OrdersTable } from "@/components/dashboard/orders-table"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { NewOrderForm } from "@/components/dashboard/new-order-form"
import { ServicesGrid } from "@/components/dashboard/services-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export default function Dashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("overview")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userBalance] = useState(25.5) // TODO: Get from user context/API
  const userId = "user123" // TODO: Get from auth context

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        userBalance={userBalance}
        userId={userId}
      />

      <div className="flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        <main className="flex-1 p-4 lg:p-8 lg:ml-64">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t("dashboard")}</h1>
                <p className="text-gray-600">Gestiona tus órdenes SMM y servicios</p>
              </div>

              <StatsCards />

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Órdenes Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <OrdersTable />
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("newOrder")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <NewOrderForm />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Servicios Disponibles</h1>
              <ServicesGrid />
            </div>
          )}

          {activeTab === "new-order" && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("newOrder")}</h1>
              <Card>
                <CardContent className="p-6">
                  <NewOrderForm />
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("myOrders")}</h1>
              <Card>
                <CardContent className="p-6">
                  <OrdersTable />
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
