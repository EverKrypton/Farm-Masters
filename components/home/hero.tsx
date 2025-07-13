"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Shield, Globe } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import Link from "next/link"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="pt-24 pb-12 sm:pt-32 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Zap className="w-4 h-4 mr-2" />
            Panel SMM #1 en Cuba
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">{t("heroTitle")}</h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t("heroSubtitle")}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600">
                {t("getStarted")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#services">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                {t("viewServices")}
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              {t("securePayments")}
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              {t("instantDelivery")}
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-purple-500" />
              {t("support24")}
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { platform: "Instagram", icon: "📸", count: "10K+" },
                  { platform: "Facebook", icon: "👍", count: "5K+" },
                  { platform: "TikTok", icon: "🎵", count: "25K+" },
                  { platform: "YouTube", icon: "▶️", count: "2K+" },
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 text-center shadow-lg">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-900">{item.platform}</div>
                    <div className="text-sm text-gray-600">{item.count} servicios</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
