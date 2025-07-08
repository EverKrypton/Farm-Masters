import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/web3-provider"
import { SoundProvider } from "@/components/sound-manager"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CryptoRealm - NFT Gaming Platform",
  description: "Play, collect, and trade NFTs in the ultimate blockchain gaming experience",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SoundProvider>
          <Web3Provider>
            {children}
            <Toaster />
          </Web3Provider>
        </SoundProvider>
      </body>
    </html>
  )
}
