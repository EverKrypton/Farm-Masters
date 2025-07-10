"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Wand2,
  Rocket,
  Github,
  Globe,
  Wallet,
  Code2,
  Palette,
  Monitor,
  Smartphone,
  ArrowRight,
  Star,
  Users,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate website")
      }

      if (result.success) {
        router.push(`/editor/${result.data.id}`)
      } else {
        throw new Error(result.error || "Unknown error occurred")
      }
    } catch (error) {
      console.error("Generation error:", error)
      alert(error instanceof Error ? error.message : "An error occurred while generating your website.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">WebCraft Studio</h1>
              <p className="text-xs text-purple-300">AI-Powered Website Builder</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/gallery" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Gallery
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Star className="w-3 h-3 mr-1" />
              Next-Generation Website Builder
            </Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            Create Websites
            <br />
            <span className="text-4xl md:text-6xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              with AI Power
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into stunning, professional websites in seconds. Deploy instantly, integrate with
            GitHub, and manage everything from one powerful platform.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-12 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>50,000+ websites created</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Average: 15 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
        </div>

        {/* Main Generator */}
        <div className="max-w-4xl mx-auto mb-20">
          <Card className="p-8 shadow-2xl border-0 bg-white/5 backdrop-blur-sm border border-white/10">
            <CardContent className="p-0 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 text-white">Describe Your Vision</h2>
                <p className="text-gray-400">Tell us what kind of website you want to create</p>
              </div>

              <Textarea
                placeholder="Example: Create a modern SaaS landing page with a hero section, feature highlights, pricing table, and testimonials. Use a clean, professional design with blue and white colors."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 text-lg resize-none border-2 border-white/20 bg-white/5 text-white placeholder:text-gray-500 focus:border-purple-500 transition-colors"
              />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg py-6"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-3" />
                      Generate Website
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Templates */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPrompt(
                      "Create a modern business landing page with hero section, services, testimonials, and contact form",
                    )
                  }
                  className="text-xs bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-purple-400"
                >
                  <Monitor className="w-3 h-3 mr-2" />
                  Business Site
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPrompt(
                      "Build a creative portfolio website with image gallery, project showcase, and contact information",
                    )
                  }
                  className="text-xs bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-purple-400"
                >
                  <Palette className="w-3 h-3 mr-2" />
                  Portfolio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPrompt("Design an e-commerce store with product catalog, shopping cart, and checkout process")
                  }
                  className="text-xs bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-purple-400"
                >
                  <Smartphone className="w-3 h-3 mr-2" />
                  E-commerce
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPrompt("Create a blog website with article listings, individual post pages, and author profiles")
                  }
                  className="text-xs bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-purple-400"
                >
                  <Code2 className="w-3 h-3 mr-2" />
                  Blog
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Card className="p-6 text-center border-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <Wand2 className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">AI Generation</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced AI creates pixel-perfect websites from your descriptions in seconds
            </p>
          </Card>

          <Card className="p-6 text-center border-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
              <Github className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">GitHub Integration</h3>
            <p className="text-gray-400 leading-relaxed">
              Push your generated code to GitHub repositories with full version control
            </p>
          </Card>

          <Card className="p-6 text-center border-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-500/30">
              <Rocket className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Instant Deploy</h3>
            <p className="text-gray-400 leading-relaxed">
              Deploy your websites to production with custom domains in just one click
            </p>
          </Card>

          <Card className="p-6 text-center border-0 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
              <Wallet className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Crypto Payments</h3>
            <p className="text-gray-400 leading-relaxed">
              Pay with Ethereum for premium features like custom domains and GitHub integration
            </p>
          </Card>
        </div>

        {/* Pricing Preview */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-4 text-white">Simple, Transparent Pricing</h2>
          <p className="text-gray-400 mb-8">Website generation is free. Pay only for premium features.</p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 border-0 bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-white">Free</h3>
                <div className="text-3xl font-bold mb-4 text-purple-400">$0</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Unlimited website generation</li>
                  <li>✓ Live preview</li>
                  <li>✓ Code editing</li>
                  <li>✓ Basic deployment</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 border-0 bg-white/5 backdrop-blur-sm border border-purple-500/50 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">Popular</Badge>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-white">Custom Domain</h3>
                <div className="text-3xl font-bold mb-4 text-purple-400">$5</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Everything in Free</li>
                  <li>✓ Custom domain binding</li>
                  <li>✓ SSL certificates</li>
                  <li>✓ Professional branding</li>
                </ul>
              </div>
            </Card>

            <Card className="p-6 border-0 bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-white">GitHub Integration</h3>
                <div className="text-3xl font-bold mb-4 text-purple-400">$10</div>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Everything in Free</li>
                  <li>✓ GitHub repository push</li>
                  <li>✓ Version control</li>
                  <li>✓ Code collaboration</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 border border-purple-500/30 backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of creators who trust WebCraft Studio</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Globe className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Start Building Free
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
