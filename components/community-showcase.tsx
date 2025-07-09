"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, GitFork, Eye } from "lucide-react"

export default function CommunityShowcase() {
  const showcaseProjects = [
    {
      id: 1,
      name: "Modern Portfolio",
      description: "Clean portfolio website with dark theme and animations",
      image: "/placeholder.svg?height=200&width=300",
      author: "Anonymous",
      framework: "Next.js",
      stars: 42,
      forks: 12,
      views: 1200,
      tags: ["Portfolio", "Dark Theme", "Animations"],
      npxCommand: "npx @genui/modern-portfolio@latest",
    },
    {
      id: 2,
      name: "Business Landing",
      description: "Professional business landing page with contact forms",
      image: "/placeholder.svg?height=200&width=300",
      author: "Anonymous",
      framework: "React",
      stars: 38,
      forks: 8,
      views: 890,
      tags: ["Business", "Landing Page", "Forms"],
      npxCommand: "npx @genui/business-landing@latest",
    },
    {
      id: 3,
      name: "Blog Template",
      description: "Minimalist blog template with markdown support",
      image: "/placeholder.svg?height=200&width=300",
      author: "Anonymous",
      framework: "Next.js",
      stars: 56,
      forks: 15,
      views: 1500,
      tags: ["Blog", "Markdown", "Minimalist"],
      npxCommand: "npx @genui/blog-template@latest",
    },
    {
      id: 4,
      name: "E-commerce Store",
      description: "Full-featured e-commerce store with cart functionality",
      image: "/placeholder.svg?height=200&width=300",
      author: "Anonymous",
      framework: "Vue.js",
      stars: 73,
      forks: 22,
      views: 2100,
      tags: ["E-commerce", "Shopping Cart", "Responsive"],
      npxCommand: "npx @genui/ecommerce-store@latest",
    },
    {
      id: 5,
      name: "Dashboard App",
      description: "Admin dashboard with charts and data visualization",
      image: "/placeholder.svg?height=200&width=300",
      author: "Anonymous",
      framework: "React",
      stars: 91,
      forks: 28,
      views: 2800,
      tags: ["Dashboard", "Charts", "Admin"],
      npxCommand: "npx @genui/dashboard-app@latest",
    },
    {
      id: 6,
      name: "Restaurant Menu",
      description: "Interactive restaurant menu with online ordering",
      image: "/placeholder.svg?height=200&width=300",
      author: "Anonymous",
      framework: "Svelte",
      stars: 34,
      forks: 9,
      views: 670,
      tags: ["Restaurant", "Menu", "Ordering"],
      npxCommand: "npx @genui/restaurant-menu@latest",
    },
  ]

  return (
    <section id="examples" className="mb-12 sm:mb-20">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Community Showcase</h2>
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
          Discover websites created by our community. All projects are free to install and customize.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {showcaseProjects.map((project) => (
          <Card
            key={project.id}
            className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 group"
          >
            <CardContent className="p-0">
              {/* Project Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {project.framework}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400">by {project.author}</p>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" />
                    <span>{project.forks}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{project.views}</span>
                  </div>
                </div>

                {/* NPX Command */}
                <div className="bg-gray-800 rounded-md p-3 mb-4">
                  <code className="text-xs text-green-400 break-all">{project.npxCommand}</code>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-xs"
                    onClick={() => navigator.clipboard.writeText(project.npxCommand)}
                  >
                    Copy NPX
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:text-white text-xs bg-transparent"
                    onClick={() =>
                      window.open(`https://${project.name.toLowerCase().replace(/\s+/g, "-")}.0xhub.pro`, "_blank")
                    }
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8 sm:mt-12">
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 sm:p-8 border border-purple-800/30">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">Share Your Creation</h3>
          <p className="text-gray-300 mb-6 text-sm sm:text-base">
            Built something amazing? Share it with the community and inspire others.
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={() => window.open("https://github.com/0xhub/genui-showcase", "_blank")}
          >
            Submit Your Project
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
