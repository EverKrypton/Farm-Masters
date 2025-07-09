"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Globe,
  CreditCard,
  TrendingUp,
  Settings,
  Search,
  Download,
  Eye,
  Trash2,
  Crown,
  Shield,
} from "lucide-react"

interface AdminStats {
  totalUsers: number
  totalWebsites: number
  totalRevenue: number
  activeUsers: number
  freeUsers: number
  proUsers: number
  enterpriseUsers: number
  websitesThisMonth: number
  revenueThisMonth: number
}

interface User {
  id: string
  name: string
  email: string
  tier: "free" | "pro" | "enterprise"
  credits: number
  websitesGenerated: number
  totalSpent: number
  lastActive: string
  createdAt: string
}

interface Website {
  id: string
  name: string
  userId: string
  userName: string
  language: string
  tier: string
  createdAt: string
  lastModified: string
  isPublic: boolean
  views: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTier, setFilterTier] = useState<string>("all")

  useEffect(() => {
    if (!user?.isAdmin) {
      router.push("/")
      return
    }

    fetchAdminData()
  }, [user, router])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Fetch admin statistics
      const statsResponse = await fetch("/api/admin/stats")
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch users
      const usersResponse = await fetch("/api/admin/users")
      const usersData = await usersResponse.json()
      setUsers(usersData.users)

      // Fetch websites
      const websitesResponse = await fetch("/api/admin/websites")
      const websitesData = await websitesResponse.json()
      setWebsites(websitesData.websites)
    } catch (error) {
      console.error("Failed to fetch admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = filterTier === "all" || user.tier === filterTier
    return matchesSearch && matchesTier
  })

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
      setUsers(users.filter((u) => u.id !== userId))
    } catch (error) {
      console.error("Failed to delete user:", error)
    }
  }

  const handleDeleteWebsite = async (websiteId: string) => {
    if (!confirm("Are you sure you want to delete this website?")) return

    try {
      await fetch(`/api/admin/websites/${websiteId}`, { method: "DELETE" })
      setWebsites(websites.filter((w) => w.id !== websiteId))
    } catch (error) {
      console.error("Failed to delete website:", error)
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Loading admin dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">Manage GenUI platform and users</p>
          </div>
          <Button onClick={() => router.push("/")} variant="outline">
            Back to App
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <div className="mt-2 text-sm text-gray-400">{stats.activeUsers} active this month</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Websites</p>
                    <p className="text-2xl font-bold">{stats.totalWebsites.toLocaleString()}</p>
                  </div>
                  <Globe className="w-8 h-8 text-green-400" />
                </div>
                <div className="mt-2 text-sm text-gray-400">{stats.websitesThisMonth} created this month</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="mt-2 text-sm text-gray-400">${stats.revenueThisMonth} this month</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Growth Rate</p>
                    <p className="text-2xl font-bold">+24%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
                <div className="mt-2 text-sm text-gray-400">vs last month</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Tier Distribution */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-blue-900/20 border-blue-800">
              <CardContent className="p-6 text-center">
                <h3 className="text-blue-400 font-semibold mb-2">Free Users</h3>
                <p className="text-3xl font-bold">{stats.freeUsers}</p>
                <p className="text-sm text-gray-400">
                  {((stats.freeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/20 border-purple-800">
              <CardContent className="p-6 text-center">
                <h3 className="text-purple-400 font-semibold mb-2">Pro Users</h3>
                <p className="text-3xl font-bold">{stats.proUsers}</p>
                <p className="text-sm text-gray-400">
                  {((stats.proUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-800">
              <CardContent className="p-6 text-center">
                <h3 className="text-yellow-400 font-semibold mb-2">Enterprise Users</h3>
                <p className="text-3xl font-bold">{stats.enterpriseUsers}</p>
                <p className="text-sm text-gray-400">
                  {((stats.enterpriseUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-gray-900">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="websites">Websites</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700"
                      />
                    </div>
                    <select
                      value={filterTier}
                      onChange={(e) => setFilterTier(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white rounded-md px-3 py-2"
                    >
                      <option value="all">All Tiers</option>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">User</th>
                        <th className="text-left py-3 px-4">Tier</th>
                        <th className="text-left py-3 px-4">Credits</th>
                        <th className="text-left py-3 px-4">Websites</th>
                        <th className="text-left py-3 px-4">Spent</th>
                        <th className="text-left py-3 px-4">Last Active</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                user.tier === "enterprise"
                                  ? "bg-yellow-600"
                                  : user.tier === "pro"
                                    ? "bg-purple-600"
                                    : "bg-blue-600"
                              }
                            >
                              {user.tier === "enterprise" && <Crown className="w-3 h-3 mr-1" />}
                              {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">${user.credits}</td>
                          <td className="py-3 px-4">{user.websitesGenerated}</td>
                          <td className="py-3 px-4">${user.totalSpent}</td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-400">
                              {new Date(user.lastActive).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="websites">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Website Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">Website</th>
                        <th className="text-left py-3 px-4">Owner</th>
                        <th className="text-left py-3 px-4">Language</th>
                        <th className="text-left py-3 px-4">Tier</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-left py-3 px-4">Created</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {websites.map((website) => (
                        <tr key={website.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium">{website.name}</p>
                              <p className="text-sm text-gray-400">{website.isPublic ? "Public" : "Private"}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{website.userName}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline">{website.language}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={website.tier === "pro" ? "bg-purple-600" : "bg-blue-600"}>
                              {website.tier}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{website.views.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-400">
                              {new Date(website.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteWebsite(website.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <CreditCard className="w-16 h-16 mx-auto mb-4" />
                  <p>Payment management interface coming soon...</p>
                  <p className="text-sm">Integration with OxaPay analytics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Platform Name</label>
                      <Input defaultValue="GenUI" className="bg-gray-800 border-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Domain</label>
                      <Input defaultValue="0xhub.pro" className="bg-gray-800 border-gray-700" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Pricing Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">AI Enhanced Price</label>
                      <Input defaultValue="5" type="number" className="bg-gray-800 border-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pro Price</label>
                      <Input defaultValue="10" type="number" className="bg-gray-800 border-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Domain Binding Price</label>
                      <Input defaultValue="5" type="number" className="bg-gray-800 border-gray-700" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">API Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">OxaPay API Key</label>
                      <Input
                        type="password"
                        placeholder="Enter OxaPay API key"
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">AI Model API Key</label>
                      <Input type="password" placeholder="Enter AI API key" className="bg-gray-800 border-gray-700" />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
