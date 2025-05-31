"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sprout, Coins, Users, TrendingUp, Shield, Smartphone } from "lucide-react"
import WalletConnection from "./wallet-connection"
import { useWallet } from "../hooks/use-wallet"

interface WelcomePageProps {
  onEnterGame: () => void
}

export default function WelcomePage({ onEnterGame }: WelcomePageProps) {
  const { isConnected } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sprout className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">CryptoFarm</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">The Ultimate DeFi Farming Experience on BSC</p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Grow your wealth with our innovative farming pools. Earn FARM tokens, refer friends, and harvest real
            returns on the Binance Smart Chain.
          </p>

          {!isConnected ? (
            <WalletConnection />
          ) : (
            <Button onClick={onEnterGame} size="lg" className="text-lg px-8 py-3">
              Enter CryptoFarm
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Multiple Farming Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Choose from 4 different pools with APY ranging from 15% to 45%. Start with just $10 or go big with $100+
                investments.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>10% Referral System</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn 10% commission on every friend you refer. Build your network and earn passive income from referral
                rewards.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>High Yield Returns</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Earn up to 45% APY on your USDT deposits. Harvest FARM tokens and convert them back to USDT anytime.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Secure & Audited</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with OpenZeppelin standards and security best practices. Your funds are protected by battle-tested
                smart contracts.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle>Mobile Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Farm on the go with our fully responsive design. Access your farms from any device, anywhere, anytime.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>Instant Harvesting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Harvest your rewards anytime and convert FARM tokens to USDT instantly. No waiting periods or complex
                procedures.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Farming Pools Preview */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Farming Pools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Starter Farm", icon: "🌱", apy: "15%", min: "$10", rarity: "Common", color: "bg-gray-100" },
              { name: "Growth Farm", icon: "🌾", apy: "25%", min: "$25", rarity: "Uncommon", color: "bg-green-100" },
              { name: "Premium Farm", icon: "🌽", apy: "35%", min: "$50", rarity: "Rare", color: "bg-blue-100" },
              { name: "Whale Farm", icon: "🌺", apy: "45%", min: "$100", rarity: "Legendary", color: "bg-purple-100" },
            ].map((pool, index) => (
              <Card key={index} className="text-center">
                <CardHeader className="pb-2">
                  <div className="text-4xl mb-2">{pool.icon}</div>
                  <CardTitle className="text-lg">{pool.name}</CardTitle>
                  <Badge className={pool.color}>{pool.rarity}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-green-600">{pool.apy}</div>
                    <div className="text-sm text-gray-600">APY</div>
                    <div className="text-sm">Min: {pool.min}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Connect Wallet", desc: "Connect your MetaMask wallet to BSC network" },
              { step: "2", title: "Deposit USDT", desc: "Deposit USDT BEP20 tokens to start farming" },
              { step: "3", title: "Choose Pool", desc: "Select a farming pool that fits your budget" },
              { step: "4", title: "Harvest & Earn", desc: "Harvest FARM tokens and convert to USDT" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2024 CryptoFarm. Built on Binance Smart Chain.</p>
          <p className="mt-2">Always DYOR (Do Your Own Research) before investing.</p>
        </div>
      </div>
    </div>
  )
}
