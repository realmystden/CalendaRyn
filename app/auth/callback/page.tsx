"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = getBrowserClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error during auth callback:", error)
        router.push("/auth/login")
        return
      }

      // Redirect to dashboard after successful authentication
      router.push("/dashboard")
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Autenticando...</p>
      </div>
    </div>
  )
}
