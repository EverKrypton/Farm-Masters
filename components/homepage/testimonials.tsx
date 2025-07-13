"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Startup Founder",
      company: "TechFlow",
      content:
        "CreativeStudio helped us create a professional brand identity in just hours. The logo maker is incredibly intuitive and the results are stunning.",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "DataCorp",
      content:
        "The documentation builder is a game-changer. We moved from scattered docs to a beautiful, searchable knowledge base that our team actually uses.",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "GrowthLab",
      content:
        "Professional quality without the professional price tag. We've created everything from logos to complete brand guidelines using CreativeStudio.",
      rating: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Trusted by Thousands of Businesses</h2>
          <p className="text-xl text-gray-600">See what our customers are saying about CreativeStudio</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
