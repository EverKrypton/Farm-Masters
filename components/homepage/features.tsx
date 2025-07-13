"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Download, Palette, Code, Search, Users, Shield, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Smartphone,
      title: "Fully Responsive",
      description: "Perfect experience on all devices - desktop, tablet, and mobile",
    },
    {
      icon: Download,
      title: "Multiple Export Formats",
      description: "Download in PNG, SVG, PDF, and more professional formats",
    },
    {
      icon: Palette,
      title: "Advanced Design Tools",
      description: "Professional-grade editing with layers, effects, and typography",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "API access, webhooks, and integration capabilities",
    },
    {
      icon: Search,
      title: "Smart Search",
      description: "Find templates, assets, and documentation instantly",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work together with real-time editing and commenting",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with global CDN delivery",
    },
  ]

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Professional Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every tool you need to create professional designs and documentation, backed by enterprise-grade
            infrastructure.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
