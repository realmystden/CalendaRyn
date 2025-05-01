"use client"

import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { CalendarioCompleto } from "@/components/calendario-completo"
import { UserNav } from "@/components/auth/user-nav"
import { getBrowserClient } from "@/lib/supabase"

// Componente de depuración
function DebugInfo() {
  const checkSupabase = async () => {
    try {
      const supabase = getBrowserClient()
      const { data, error } = await supabase.from("calendar_events").select("count(*)")
      if (error) {
        console.error("Error al verificar conexión:", error)
        alert(`Error de conexión: ${error.message}`)
      } else {
        console.log("Conexión exitosa:", data)
        alert(`Conexión exitosa. Conteo: ${JSON.stringify(data)}`)
      }
    } catch (err) {
      console.error("Error inesperado:", err)
      alert(`Error inesperado: ${err}`)
    }
  }

  return (
    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
      <h3 className="font-medium mb-2">Herramientas de depuración</h3>
      <button onClick={checkSupabase} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
        Verificar conexión a Supabase
      </button>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-2">
        <UserNav />
        <DebugInfo />
      </div>
      <main className="flex-grow p-4 md:p-8">
        <CalendarioCompleto />
      </main>
      <Footer />
    </div>
  )
}
