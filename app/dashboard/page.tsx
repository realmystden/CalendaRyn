"use client"

import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { CalendarioCompleto } from "@/components/calendario-completo"
import { UserNav } from "@/components/auth/user-nav"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-2">
        <UserNav />
      </div>
      <main className="flex-grow p-4 md:p-8">
        <CalendarioCompleto />
      </main>
      <Footer />
    </div>
  )
}
