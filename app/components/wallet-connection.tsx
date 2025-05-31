"use client"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useWallet } from "../hooks/use-wallet"

export default function WalletConnection() {
  const { isConnected, connect, disconnect, loading } = useWallet()

  if (isConnected) {
    return (
      <Button
        variant="outline"
        onClick={disconnect}
        className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
        size="sm"
      >
        <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Disconnect</span>
        <span className="sm:hidden">Exit</span>
      </Button>
    )
  }

  return (
    <Button
      onClick={connect}
      disabled={loading}
      className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
      size="sm"
    >
      <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
      {loading ? "Connecting..." : "Connect"}
    </Button>
  )
}
