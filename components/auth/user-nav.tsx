"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, LogOut, Calendar } from "lucide-react"
import { getBrowserClient } from "@/lib/supabase"

export function UserNav() {
  const { user, signOut } = useAuth()
  const [username, setUsername] = useState("")
  const supabase = getBrowserClient()

  useEffect(() => {
    async function loadUserProfile() {
      if (!user) return

      try {
        const { data, error } = await supabase.from("user_profiles").select("username").eq("user_id", user.id).single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 es el código para "no se encontraron resultados"
          console.error("Error al cargar el perfil:", error)
          return
        }

        // Si encontramos un perfil, usamos el nombre de usuario
        if (data?.username) {
          setUsername(data.username)
        } else {
          // Si no hay perfil, usamos el email como nombre de usuario predeterminado
          setUsername(user.email?.split("@")[0] || "")
        }
      } catch (err) {
        console.error("Error inesperado al cargar el perfil:", err)
      }
    }

    loadUserProfile()
  }, [user, supabase])

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" className="font-medium">
          <Link href="/auth/login">Iniciar sesión</Link>
        </Button>
        <Button asChild className="font-medium">
          <Link href="/auth/register">Registrarse</Link>
        </Button>
      </div>
    )
  }

  // Usar el nombre de usuario si está disponible, o las iniciales del correo electrónico
  const initials = username
    ? username.substring(0, 2).toUpperCase()
    : user.email
      ? user.email.split("@")[0].substring(0, 2).toUpperCase()
      : "U"

  const displayName = username || user.email?.split("@")[0] || "Usuario"

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendario</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <span>Ajustes</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()} className="text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
