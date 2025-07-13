"use client"

import { TrendingUp, Twitter, Instagram, Facebook, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const footerLinks = {
    servicios: [
      { name: "Instagram", href: "/services/instagram" },
      { name: "Facebook", href: "/services/facebook" },
      { name: "TikTok", href: "/services/tiktok" },
      { name: "YouTube", href: "/services/youtube" },
    ],
    empresa: [
      { name: "Sobre Nosotros", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Contacto", href: "/contact" },
      { name: "Afiliados", href: "/affiliates" },
    ],
    soporte: [
      { name: "Centro de Ayuda", href: "/help" },
      { name: "API Docs", href: "/api-docs" },
      { name: "Estado del Servicio", href: "/status" },
      { name: "Términos", href: "/terms" },
    ],
    legal: [
      { name: "Privacidad", href: "/privacy" },
      { name: "Términos de Uso", href: "/terms" },
      { name: "Política de Reembolso", href: "/refund" },
      { name: "GDPR", href: "/gdpr" },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CubaBoost</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              El panel SMM más confiable para impulsar tu presencia en redes sociales. Pagos en crypto, entrega
              instantánea.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4 capitalize">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 CubaBoost. Todos los derechos reservados.</p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">Hecho con ❤️ para la comunidad cubana</p>
        </div>
      </div>
    </footer>
  )
}
