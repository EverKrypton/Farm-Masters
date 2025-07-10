"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Globe, Github, Settings, Wallet, Eye, Code, Rocket, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Project {
  id: string
  name: string
  description: string
  status: "draft" | "deployed" | "building"
  url?: string
  githubUrl?: string
  createdAt: string
  lastModified: string
}

export default function DashboardPage() {
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Photography Portfolio",
      description: "Modern portfolio for a professional photographer",
      status: "deployed",
      url: "https://photo-portfolio.vercel.app",
      githubUrl: "https://github.com/user/photo-portfolio",
      createdAt: "2024-01-15",
      lastModified: "2024-01-16",
    },
    {
      id: "2",
      name: "E-commerce Store",
      description: "Online store for handmade crafts",
      status: "building",
      createdAt: "2024-01-14",
      lastModified: "2024-01-14",
    },
    {
      id: "3",
      name: "Restaurant Website",
      description: "Local restaurant with menu and reservations",
      status: "draft",
      createdAt: "2024-01-13",
      lastModified: "2024-01-13",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed":
        return "bg-green-100 text-green-800"
      case "building":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Wallet className="w-4 h-4 mr-2" />
                0.5 ETH
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search projects..." className="pl-10" />
              </div>
              <Button variant="outline">All Status</Button>
              <Button variant="outline">Recent</Button>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Code className="w-4 h-4 mr-2" />
                            Edit Code
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      <span className="text-xs text-gray-500">Updated {project.lastModified}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {project.url && (
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Globe className="w-4 h-4 mr-2" />
                          Visit
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </Button>
                      )}
                      {project.status === "draft" && (
                        <Button size="sm" className="flex-1">
                          <Rocket className="w-4 h-4 mr-2" />
                          Deploy
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deployments">
            <Card>
              <CardHeader>
                <CardTitle>Deployment History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your deployment history will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle>Custom Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Manage your custom domains here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Your billing information and usage stats.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
