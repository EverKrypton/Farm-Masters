"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Crown, Palette, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface TemplateGalleryProps {
  onSelectTemplate: (template: any) => void
  onStartFromScratch: () => void
  isPremium: boolean
  onUpgrade: () => void
}

export function TemplateGallery({ onSelectTemplate, onStartFromScratch, isPremium, onUpgrade }: TemplateGalleryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "tech", name: "Technology" },
    { id: "business", name: "Business" },
    { id: "creative", name: "Creative" },
    { id: "food", name: "Food & Beverage" },
    { id: "health", name: "Health & Wellness" },
    { id: "education", name: "Education" },
  ]

  const templates = [
    {
      id: 1,
      name: "Modern Tech",
      category: "tech",
      isPremium: false,
      preview: "/placeholder.svg?height=200&width=300",
      data: {
        text: "TechCorp",
        fontSize: 42,
        fontFamily: "Arial",
        color: "#2563eb",
        backgroundColor: "#ffffff",
        shapes: [{ type: "circle", x: 50, y: 50, radius: 20, color: "#2563eb" }],
        icons: [],
        layers: [],
      },
    },
    {
      id: 2,
      name: "Creative Studio",
      category: "creative",
      isPremium: true,
      preview: "/placeholder.svg?height=200&width=300",
      data: {
        text: "Creative",
        fontSize: 48,
        fontFamily: "Helvetica",
        color: "#7c3aed",
        backgroundColor: "#ffffff",
        shapes: [{ type: "triangle", x: 30, y: 30, width: 40, height: 40, color: "#7c3aed" }],
        icons: [],
        layers: [],
      },
    },
    {
      id: 3,
      name: "Business Pro",
      category: "business",
      isPremium: false,
      preview: "/placeholder.svg?height=200&width=300",
      data: {
        text: "Business",
        fontSize: 44,
        fontFamily: "Times New Roman",
        color: "#1f2937",
        backgroundColor: "#ffffff",
        shapes: [{ type: "rectangle", x: 40, y: 40, width: 60, height: 20, color: "#1f2937" }],
        icons: [],
        layers: [],
      },
    },
    // Add more templates...
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleTemplateClick = (template: any) => {
    if (template.isPremium && !isPremium) {
      onUpgrade()
      return
    }
    onSelectTemplate(template.data)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Choose a Template</h1>
          </div>

          <div className="flex items-center space-x-4">
            {!isPremium && (
              <Button onClick={onUpgrade} className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade for Premium Templates
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button onClick={onStartFromScratch} variant="outline" className="whitespace-nowrap bg-transparent">
              <Palette className="w-4 h-4 mr-2" />
              Start from Scratch
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
              onClick={() => handleTemplateClick(template)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  {template.isPremium && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Pro
                      </Badge>
                    </div>
                  )}
                  {template.isPremium && !isPremium && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium">Upgrade to Pro</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{template.category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No templates found matching your criteria.</p>
            <Button onClick={() => setSearchTerm("")} variant="outline" className="mt-4">
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
