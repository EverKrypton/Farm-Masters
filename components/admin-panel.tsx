"use client"

import { useState } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { AnimatedCard } from "./animated-card"
import { useWeb3 } from "./web3-provider"
import { useToast } from "@/hooks/use-toast"
import { Settings, Users, Coins, TrendingUp, Shield, Plus, Edit, Eye, DollarSign, Activity, Server } from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalNFTs: number
  totalRevenue: number
  activeUsers: number
  contractBalance: string
}

export default function AdminPanel() {
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 1247,
    totalNFTs: 3456,
    totalRevenue: 125.67,
    activeUsers: 89,
    contractBalance: "45.23",
  })

  const [gameSettings, setGameSettings] = useState({
    mintingEnabled: true,
    tradingEnabled: true,
    battleEnabled: true,
    maintenanceMode: false,
    mintPrice: "0.1",
    maxSupply: "10000",
  })

  const { toast } = useToast()
  const { getContractBalance, account } = useWeb3()

  const updateGameSettings = async () => {
    // Simulate API call to update game settings
    toast({
      title: "Settings Updated",
      description: "Game settings have been successfully updated.",
    })
  }

  const withdrawFunds = async () => {
    try {
      // Simulate contract withdrawal
      toast({
        title: "Funds Withdrawn",
        description: `Successfully withdrew ${adminStats.contractBalance} ETH`,
      })
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Failed to withdraw funds from contract.",
        variant: "destructive",
      })
    }
  }

  const createNFTCollection = async (collectionData: any) => {
    try {
      // Simulate NFT collection creation
      toast({
        title: "Collection Created",
        description: "New NFT collection has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create NFT collection.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-white animate-fade-in">Admin Panel</h2>
        <Badge className="bg-red-600 text-white">Admin Access</Badge>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-white font-bold text-xl">{adminStats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-black/40 border-white/10" delay={100}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-gray-400 text-sm">Total NFTs</p>
                <p className="text-white font-bold text-xl">{adminStats.totalNFTs.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-white font-bold text-xl">{adminStats.totalRevenue} ETH</p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>

        <AnimatedCard className="bg-black/40 border-white/10" delay={300}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-white font-bold text-xl">{adminStats.activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </AnimatedCard>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-black/20 border border-white/10">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="nfts">NFT Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Game Settings */}
        <TabsContent value="settings" className="mt-6">
          <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Game Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="minting" className="text-white">
                      Enable Minting
                    </Label>
                    <Switch
                      id="minting"
                      checked={gameSettings.mintingEnabled}
                      onCheckedChange={(checked) => setGameSettings((prev) => ({ ...prev, mintingEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="trading" className="text-white">
                      Enable Trading
                    </Label>
                    <Switch
                      id="trading"
                      checked={gameSettings.tradingEnabled}
                      onCheckedChange={(checked) => setGameSettings((prev) => ({ ...prev, tradingEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="battle" className="text-white">
                      Enable Battles
                    </Label>
                    <Switch
                      id="battle"
                      checked={gameSettings.battleEnabled}
                      onCheckedChange={(checked) => setGameSettings((prev) => ({ ...prev, battleEnabled: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance" className="text-white">
                      Maintenance Mode
                    </Label>
                    <Switch
                      id="maintenance"
                      checked={gameSettings.maintenanceMode}
                      onCheckedChange={(checked) => setGameSettings((prev) => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="mint-price" className="text-white">
                      Mint Price (ETH)
                    </Label>
                    <Input
                      id="mint-price"
                      value={gameSettings.mintPrice}
                      onChange={(e) => setGameSettings((prev) => ({ ...prev, mintPrice: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="max-supply" className="text-white">
                      Max Supply
                    </Label>
                    <Input
                      id="max-supply"
                      value={gameSettings.maxSupply}
                      onChange={(e) => setGameSettings((prev) => ({ ...prev, maxSupply: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white mt-1"
                    />
                  </div>

                  <div className="pt-4">
                    <Button onClick={updateGameSettings} className="w-full bg-blue-600 hover:bg-blue-700">
                      Update Settings
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contract Management */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Contract Management
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Contract Balance</p>
                    <p className="text-white font-bold text-xl">{adminStats.contractBalance} ETH</p>
                    <Button onClick={withdrawFunds} className="mt-2 bg-green-600 hover:bg-green-700 w-full">
                      <Coins className="w-4 h-4 mr-2" />
                      Withdraw Funds
                    </Button>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Contract Address</p>
                    <p className="text-white font-mono text-sm break-all">0x742d35Cc...4d8b6</p>
                    <Button variant="outline" className="mt-2 border-gray-600 text-white w-full bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </AnimatedCard>
        </TabsContent>

        {/* NFT Management */}
        <TabsContent value="nfts" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold text-xl">NFT Collections</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Collection
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 max-w-md mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create NFT Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="collection-name" className="text-white">
                        Collection Name
                      </Label>
                      <Input
                        id="collection-name"
                        placeholder="Enter collection name"
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="collection-symbol" className="text-white">
                        Symbol
                      </Label>
                      <Input
                        id="collection-symbol"
                        placeholder="e.g., CRYPTO"
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="collection-description" className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id="collection-description"
                        placeholder="Enter collection description"
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="collection-supply" className="text-white">
                        Max Supply
                      </Label>
                      <Input
                        id="collection-supply"
                        type="number"
                        placeholder="10000"
                        className="bg-gray-800 border-gray-600 text-white mt-1"
                      />
                    </div>
                    <Button onClick={() => createNFTCollection({})} className="w-full bg-green-600 hover:bg-green-700">
                      Create Collection
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { name: "Fire Dragons", supply: "1000/5000", revenue: "45.2 ETH" },
                    { name: "Crystal Weapons", supply: "750/2000", revenue: "28.7 ETH" },
                    { name: "Mystic Lands", supply: "300/1000", revenue: "15.3 ETH" },
                  ].map((collection, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{collection.name}</h4>
                        <p className="text-gray-400 text-sm">Supply: {collection.supply}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">{collection.revenue}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="border-gray-600 text-white bg-transparent">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600 text-white bg-transparent">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </AnimatedCard>
          </div>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="mt-6">
          <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { address: "0x742d35Cc...4d8b6", nfts: 15, spent: "2.5 ETH", status: "Active" },
                  { address: "0x8ba1f109...3a9", nfts: 8, spent: "1.2 ETH", status: "Active" },
                  { address: "0x123abc45...def", nfts: 23, spent: "4.1 ETH", status: "Banned" },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-mono">{user.address}</p>
                      <p className="text-gray-400 text-sm">
                        {user.nfts} NFTs • {user.spent} spent
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={user.status === "Active" ? "bg-green-600" : "bg-red-600"}>{user.status}</Badge>
                      <Button size="sm" variant="outline" className="border-gray-600 text-white bg-transparent">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </AnimatedCard>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6">
            <AnimatedCard className="bg-black/40 border-white/10" delay={0}>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Revenue chart would be displayed here</p>
                </div>
              </CardContent>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedCard className="bg-black/40 border-white/10" delay={200}>
                <CardHeader>
                  <CardTitle className="text-white text-lg">Top Collections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Fire Dragons", volume: "45.2 ETH" },
                      { name: "Crystal Weapons", volume: "28.7 ETH" },
                      { name: "Mystic Lands", volume: "15.3 ETH" },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-white">{item.name}</span>
                        <span className="text-green-400 font-bold">{item.volume}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>

              <AnimatedCard className="bg-black/40 border-white/10" delay={400}>
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "NFT Minted", time: "2 min ago" },
                      { action: "Battle Won", time: "5 min ago" },
                      { action: "Trade Completed", time: "8 min ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-white">{activity.action}</span>
                        <span className="text-gray-400 text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AnimatedCard>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
