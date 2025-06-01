import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Farm Masters',
  description: 'Created for Farmers and Degens',
  generator: '@ograinhard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
