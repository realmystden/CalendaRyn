import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the browser
const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  console.log("Creando cliente Supabase con URL:", supabaseUrl ? "URL configurada" : "URL no configurada")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Error: Variables de entorno de Supabase no configuradas correctamente")
    // Proporcionar valores por defecto para evitar errores de ejecución
    return createClient(
      "https://example.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.J",
    )
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Singleton pattern for client-side Supabase client
let browserClient: ReturnType<typeof createBrowserClient> | null = null

export const getBrowserClient = () => {
  if (!browserClient) {
    console.log("Inicializando cliente Supabase para el navegador")
    browserClient = createBrowserClient()
  }
  return browserClient
}

// Server-side client (for server components and server actions)
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
