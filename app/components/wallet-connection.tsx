"use client"
import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useWallet } from "../hooks/use-wallet"

export default function WalletConnection() {
  const { isConnected, address, connect, disconnect, loading } = useWallet()

  if (isConnected) {
    return (
      <Button variant="outline" onClick={disconnect} className="gap-2">
        <LogOut className="w-4 h-4" />
        Disconnect
      </Button>
    )
  }

  return (
    <Button onClick={connect} disabled={loading} className="gap-2">
      <Wallet className="w-4 h-4" />
      {loading ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
