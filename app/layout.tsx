import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter, Orbitron, VT323 } from "next/font/google"
import { ProveedorTema } from "@/components/proveedor-tema"

// Configurar las fuentes
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

const vt323 = VT323({
  subsets: ["latin"],
  variable: "--font-vt323",
  weight: ["400"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "CalendaRyn",
  description: "Aplicación de calendario versátil con múltiples vistas y temas",
  icons: {
    icon: "/logo.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${orbitron.variable} ${vt323.variable}`}>
      <body className={inter.className}>
        <ProveedorTema>{children}</ProveedorTema>
      </body>
    </html>
  )
}
