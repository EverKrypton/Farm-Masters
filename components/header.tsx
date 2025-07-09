"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu, X, Github, ExternalLink } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white">GenUI</span>
            <div className="flex items-center gap-1">
              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">FREE</span>
              <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">NPX</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#examples" className="text-gray-300 hover:text-white transition-colors">
              Examples
            </a>
            <a href="#installation" className="text-gray-300 hover:text-white transition-colors">
              Installation
            </a>
            <a href="#environment" className="text-gray-300 hover:text-white transition-colors">
              Environment
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white"
              onClick={() => window.open("https://github.com/0xhub/genui", "_blank")}
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => window.open("https://0xhub.pro/docs", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Docs
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-800">
              <a
                href="#features"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#examples"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Examples
              </a>
              <a
                href="#installation"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Installation
              </a>
              <a
                href="#environment"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Environment
              </a>
              <div className="px-3 py-2 border-t border-gray-800 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white"
                  onClick={() => {
                    window.open("https://github.com/0xhub/genui", "_blank")
                    setIsMenuOpen(false)
                  }}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => {
                    window.open("https://0xhub.pro/docs", "_blank")
                    setIsMenuOpen(false)
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
