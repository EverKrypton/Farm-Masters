"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, FileText, Zap, Users, Globe } from "lucide-react"
import Link from "next/link"

export function Services() {
  const services = [
    {
      icon: Palette,
      title: "Professional Logo Maker",
      description:
        "Create stunning logos with our advanced design tools. Choose from thousands of templates or start from scratch with our intuitive editor.",
      features: ["10,000+ Templates", "Vector Graphics", "Brand Guidelines", "Multiple Formats"],
      href: "/logo-maker",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FileText,
      title: "Documentation Builder",
      description:
        "Build beautiful, searchable documentation for your projects. Perfect for APIs, user guides, and knowledge bases.",
      features: ["Rich Text Editor", "Code Highlighting", "Team Collaboration", "Custom Domains"],
      href: "/docs-builder",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Zap,
      title: "Brand Identity Suite",
      description: "Complete brand identity solutions including business cards, letterheads, and social media assets.",
      features: ["Brand Consistency", "Print Ready", "Social Media Kits", "Style Guides"],
      href: "/brand-suite",
      color: "from-green-500 to-green-600",
    },
  ]

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Build Your Brand</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From logos to documentation, we provide professional-grade tools to help you create, communicate, and grow
            your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{service.description}</p>

                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href={service.href}>
                  <Button className="w-full mt-6">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Users, label: "Active Users", value: "50K+" },
            { icon: Palette, label: "Logos Created", value: "100K+" },
            { icon: FileText, label: "Docs Published", value: "25K+" },
            { icon: Globe, label: "Countries", value: "120+" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
