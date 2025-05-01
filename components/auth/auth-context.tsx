"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getBrowserClient } from "@/lib/supabase"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null; success: boolean }>
  signUp: (email: string, password: string) => Promise<{ error: any | null; data: any | null; success: boolean }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any | null }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getBrowserClient()

  // Función para refrescar la sesión
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error("Error al refrescar sesión:", error)
        return
      }

      if (data.session) {
        setSession(data.session)
        setUser(data.session.user)
      } else {
        setSession(null)
        setUser(null)
      }
    } catch (err) {
      console.error("Error inesperado al refrescar sesión:", err)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true)

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error al obtener sesión:", error)
        }

        if (session) {
          console.log("Sesión encontrada, actualizando estado")
          setSession(session)
          setUser(session.user)
        } else {
          console.log("No hay sesión activa")
          setSession(null)
          setUser(null)
        }
      } catch (err) {
        console.error("Error inesperado al obtener sesión:", err)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Cambio de estado de autenticación:", event)

      if (currentSession) {
        setSession(currentSession)
        setUser(currentSession.user)
      } else {
        // Solo limpiamos el estado si el evento es de cierre de sesión
        if (event === "SIGNED_OUT") {
          setSession(null)
          setUser(null)
        }
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        console.error("Error en inicio de sesión:", error)
        return { error, success: false }
      }

      if (data.session) {
        console.log("Inicio de sesión exitoso, actualizando estado")
        setSession(data.session)
        setUser(data.session.user)
        return { error: null, success: true }
      } else {
        console.error("Inicio de sesión sin errores pero sin sesión")
        return { error: new Error("No se pudo iniciar sesión"), success: false }
      }
    } catch (err) {
      console.error("Error inesperado en inicio de sesión:", err)
      return { error: err, success: false }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return { data: null, error, success: false }
      }

      return { data, error: null, success: true }
    } catch (err) {
      return { data: null, error: err, success: false }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (err) {
      return { error: err }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
