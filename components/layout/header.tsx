"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, TrendingUp, Globe } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<Language>("es")
  const { t } = useTranslation(language)

  const navigation = [
    { name: t("services"), href: "#services" },
    { name: t("pricing"), href: "#pricing" },
    { name: t("api"), href: "/api-docs" },
    { name: t("support"), href: "/support" },
  ]

  const toggleLanguage = () => {
    setLanguage(language === "es" ? "en" : "es")
  }

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CubaBoost
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-600 hover:text-blue-600 transition-colors">
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="w-4 h-4 mr-2" />
              {language === "es" ? "EN" : "ES"}
            </Button>
            <Link href="/login">
              <Button variant="outline">{t("login")}</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">{t("register")}</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Button variant="ghost" size="sm" onClick={toggleLanguage} className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  {language === "es" ? "English" : "Español"}
                </Button>
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">{t("register")}</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
