"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 lg:pt-40 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            Professional Design Tools for Everyone
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Create Stunning
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Logos & Docs{" "}
            </span>
            in Minutes
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional-grade logo maker and documentation builder. Create beautiful brands and comprehensive docs with
            our intuitive design tools - no design experience required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/logo-maker">
              <Button size="lg" className="w-full sm:w-auto">
                Start Creating Logos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/docs-builder">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Build Documentation
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="w-full sm:w-auto">
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Image/Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Logo Maker Preview */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-sm text-gray-500 mb-4">Logo Maker</div>
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-4">
                    <div className="text-2xl font-bold text-gray-700">Your Logo</div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded"></div>
                    <div className="w-8 h-8 bg-green-500 rounded"></div>
                  </div>
                </div>

                {/* Docs Builder Preview */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-sm text-gray-500 mb-4">Documentation Builder</div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
