"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Gamepad2, Trophy, Settings, X, Users, ArrowUpDown, Swords, Lock, Gift } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
  isAdmin?: boolean
}

export function MobileNav({ isOpen, onClose, activeTab, setActiveTab, isAdmin = false }: MobileNavProps) {
  const navItems = [
    { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
    { id: "game", label: "Game", icon: Gamepad2 },
    { id: "pvp", label: "PVP", icon: Swords },
    { id: "swap", label: "Swap", icon: ArrowUpDown },
    { id: "staking", label: "Staking", icon: Lock },
    { id: "referral", label: "Referral", icon: Gift },
    { id: "guilds", label: "Guilds", icon: Users },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: Settings }] : []),
  ]

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={onClose}
          />

          {/* Navigation Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-white/10 z-50 md:hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-lg">Navigation</h2>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start text-white hover:bg-white/10 ${
                        activeTab === item.id ? "bg-blue-600" : ""
                      }`}
                      onClick={() => handleTabChange(item.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
