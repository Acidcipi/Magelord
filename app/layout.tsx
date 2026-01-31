import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Geist, Geist_Mono } from "next/font/google"
import ClientLayout from "./ClientLayout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MageLord - Juego de Estrategia y Magia",
  description: "Conquista reinos, domina la magia y forja tu leyenda en MageLord",
  icons: {
    icon: "/images/icono-mago-magelord.jpg",
    apple: "/images/icono-mago-magelord.jpg",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
