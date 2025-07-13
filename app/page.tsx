"use client"

import { Hero } from "@/components/home/hero"
import { Stats } from "@/components/home/stats"
import { Services } from "@/components/home/services"
import { Features } from "@/components/home/features"
import { Pricing } from "@/components/home/pricing"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <Hero />
        <Stats />
        <Services />
        <Features />
        <Pricing />
      </main>

      <Footer />
    </div>
  )
}
