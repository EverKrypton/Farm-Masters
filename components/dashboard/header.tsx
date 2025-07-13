"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, Bell, User, Wallet, TrendingUp, Plus } from "lucide-react"
import { DepositModal } from "./deposit-modal"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

interface DashboardHeaderProps {
  onMobileMenuToggle: () => void
  isMobileMenuOpen: boolean
  userBalance?: number
  userId: string
}

export function DashboardHeader({
  onMobileMenuToggle,
  isMobileMenuOpen,
  userBalance = 0,
  userId,
}: DashboardHeaderProps) {
  const { t } = useTranslation()
  const [showDepositModal, setShowDepositModal] = useState(false)

  const handleDepositSuccess = (amount: number) => {
    // TODO: Update user balance in state/context
    console.log("Deposit successful:", amount)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMobileMenuToggle}>
              <Menu className="w-5 h-5" />
            </Button>

            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CubaBoost
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <Wallet className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">${userBalance.toFixed(2)}</span>
              <Badge variant="secondary" className="text-xs">
                USD
              </Badge>
            </div>

            <Button size="sm" onClick={() => setShowDepositModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              {t("deposit")}
            </Button>

            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Balance */}
        <div className="sm:hidden mt-3 flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <Wallet className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium">${userBalance.toFixed(2)} USD</span>
          </div>
        </div>
      </header>

      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={handleDepositSuccess}
        userId={userId}
      />
    </>
  )
}
