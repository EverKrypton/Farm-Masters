"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sparkles,
  Wand2,
  Code2,
  Zap,
  ArrowRight,
  Upload,
  FileImage,
  AlertCircle,
  Smartphone,
  Globe,
  Terminal,
} from "lucide-react"
import Header from "@/components/header"
import CommunityShowcase from "@/components/community-showcase"
import GenerationInterface from "@/components/generation-interface"

export default function HomePage() {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState("basic-free")
  const [selectedLanguage, setSelectedLanguage] = useState("nextjs")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWebsite, setGeneratedWebsite] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const modelOptions = [
    {
      value: "basic-free",
      label: "🆓 Basic AI",
      description: "Standard generation",
      features: ["Basic templates", "Standard AI", "Free hosting", "NPX installation"],
    },
    {
      value: "advanced-ai",
      label: "🚀 Advanced AI",
      description: "Enhanced generation",
      features: ["Advanced templates", "Better AI", "Custom designs", "NPX installation"],
    },
    {
      value: "pro-ai",
      label: "👑 Pro AI",
      description: "Professional grade",
      features: ["Premium templates", "Best AI", "Complex layouts", "NPX installation"],
    },
  ]

  const languageOptions = [
    { value: "nextjs", label: "⚛️ Next.js", description: "React with SSR" },
    { value: "react", label: "⚛️ React", description: "Single Page App" },
    { value: "vue", label: "💚 Vue.js", description: "Progressive framework" },
    { value: "angular", label: "🅰️ Angular", description: "Full framework" },
    { value: "vanilla", label: "🌐 HTML/CSS/JS", description: "Pure web technologies" },
    { value: "svelte", label: "🧡 Svelte", description: "Compile-time framework" },
  ]

  const selectedModelData = modelOptions.find((m) => m.value === selectedModel)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
          language: selectedLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.website) {
        setGeneratedWebsite(data.website)
      } else {
        throw new Error(data.error || "Generation failed")
      }
    } catch (error) {
      console.error("Generation failed:", error)
      setError(error instanceof Error ? error.message : "Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  if (isGenerating || generatedWebsite) {
    return (
      <GenerationInterface
        prompt={prompt}
        isGenerating={isGenerating}
        generatedWebsite={generatedWebsite}
        selectedModel={selectedModel}
        selectedLanguage={selectedLanguage}
        onBack={() => {
          setGeneratedWebsite(null)
          setIsGenerating(false)
          setError(null)
        }}
        onNewGeneration={() => {
          setGeneratedWebsite(null)
          setPrompt("")
          setError(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Free Badge */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 bg-gray-900 rounded-full p-1">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/20 text-green-400">
              <Globe className="w-3 h-3" />
              <span className="text-xs font-medium">100% Free</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
              <Terminal className="w-3 h-3" />
              <span className="text-xs font-medium">NPX Ready</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400">
              <Smartphone className="w-3 h-3" />
              <span className="text-xs font-medium">Cross-Platform</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Free AI Website Generator • NPX Installation • No Auth Required</span>
            <span className="sm:hidden">Free AI Generator • NPX Ready</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Generate & Install
            <br />
            <span className="text-white">Instantly</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Create professional websites with AI and install them locally with a single NPX command. Works everywhere -
            VS Code, Termux, Windows, macOS, Linux.
          </p>

          {/* Main Input - Mobile Optimized */}
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your website... (e.g., 'Modern portfolio for a designer with dark theme')"
                  className="w-full h-12 sm:h-16 bg-gray-900/90 border-gray-700 text-white placeholder-gray-400 pr-4 sm:pr-40 text-sm sm:text-lg rounded-xl backdrop-blur-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />

                {/* Desktop Controls */}
                <div className="hidden sm:flex absolute right-3 top-3 items-center gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-10 px-6"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate & Install
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="sm:hidden mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">AI Model:</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-gray-800 border-gray-600 text-white text-sm rounded-lg px-3 py-2"
                  >
                    {modelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Framework:</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full bg-gray-800 border-gray-600 text-white text-sm rounded-lg px-3 py-2"
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label} - {option.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Generate & Install
              </Button>
            </div>

            {/* Desktop Model & Language Selection */}
            <div className="hidden sm:flex justify-center gap-6 mt-6">
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white text-sm rounded-lg px-4 py-2 min-w-[180px]"
                >
                  {modelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label className="text-sm text-gray-400 mb-2">Framework</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white text-sm rounded-lg px-4 py-2 min-w-[180px]"
                >
                  {languageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Model Features Display */}
          {selectedModelData && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                <h3 className="font-medium mb-2">{selectedModelData.label} Features:</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedModelData.features.map((feature, index) => (
                    <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-left flex-1">
                  <p className="text-red-400 font-medium text-sm sm:text-base">Generation Error</p>
                  <p className="text-red-300 text-xs sm:text-sm mt-1">{error}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  ×
                </Button>
              </div>
            </div>
          )}

          {/* Upload Options - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 hover:text-white h-10 sm:h-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Upload Design</span>
              <span className="sm:hidden">Upload</span>
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 bg-gray-900/50 hover:bg-gray-800 text-gray-300 hover:text-white h-10 sm:h-auto"
            >
              <FileImage className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">From Screenshot</span>
              <span className="sm:hidden">Screenshot</span>
            </Button>
          </div>
        </div>

        {/* NPX Installation Guide */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <Terminal className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h2 className="text-2xl font-bold mb-2">NPX Installation</h2>
                <p className="text-gray-400">Install your generated website locally with a single command</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Generate</h3>
                  <p className="text-sm text-gray-400">Describe your website and let AI create it</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Copy Command</h3>
                  <p className="text-sm text-gray-400">Get your unique NPX installation command</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Install & Run</h3>
                  <p className="text-sm text-gray-400">Run the command in your terminal and start coding</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-950 rounded-lg">
                <p className="text-sm text-gray-400 mb-2">Example installation:</p>
                <code className="text-green-400 text-sm">npx @genui/my-portfolio@latest</code>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-20">
          <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-800/30 hover:border-blue-600/50 transition-all duration-300">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Cross-Platform NPX</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Works on Windows, macOS, Linux, VS Code, Termux, and any environment with Node.js.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-800/30 hover:border-purple-600/50 transition-all duration-300">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Full Source Access</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Complete source code with proper file structure, ready for customization and deployment.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-800/30 hover:border-emerald-600/50 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">No Authentication</h3>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                No sign-up required. Generate unlimited websites instantly without any barriers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Environment Setup Guide */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-20">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Environment Setup</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">Development Environment</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">VS Code</p>
                      <p className="text-xs text-gray-400">Open terminal and run NPX command</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">Termux (Android)</p>
                      <p className="text-xs text-gray-400">pkg install nodejs && npx command</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">Windows/macOS/Linux</p>
                      <p className="text-xs text-gray-400">Any terminal with Node.js 16+</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-400">Required Environment</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">Node.js 16+</p>
                      <p className="text-xs text-gray-400">Required for NPX and package installation</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">NPM/Yarn/PNPM</p>
                      <p className="text-xs text-gray-400">Package manager for dependencies</p>
                    </div>
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">Internet Connection</p>
                      <p className="text-xs text-gray-400">For downloading packages and dependencies</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section - Mobile Optimized */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-purple-800/30">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Start Building Now</h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
              No registration, no limits, no downloads. Just generate and install with NPX.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto"
              onClick={() => document.querySelector("input")?.focus()}
            >
              Generate Website
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </div>
        </div>

        <CommunityShowcase />
      </main>
    </div>
  )
}
