"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { UserNav } from "@/components/auth/user-nav"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-context"
import { getBrowserClient } from "@/lib/supabase"
import { SelectorTema } from "@/components/selector-tema"
import { PersonalizadorTema } from "@/components/personalizador-tema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Loader2, Trash2, User, Palette, Shield, LogOut } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

function SettingsContent() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("tema")
  const [username, setUsername] = useState("")
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [usernameSuccess, setUsernameSuccess] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const supabase = getBrowserClient()

  // Cargar el perfil del usuario al iniciar
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
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadUserProfile()
  }, [user, supabase])

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingUsername(true)
    setUsernameError(null)
    setUsernameSuccess(false)

    try {
      // Verificar si el nombre de usuario ya existe
      if (username.trim() === "") {
        setUsernameError("El nombre de usuario no puede estar vacío")
        setIsUpdatingUsername(false)
        return
      }

      // Actualizar o insertar el perfil del usuario
      const { error } = await supabase.from("user_profiles").upsert({
        user_id: user?.id,
        username: username,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        setUsernameError(error.message)
        return
      }

      setUsernameSuccess(true)
    } catch (err) {
      setUsernameError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.")
      console.error(err)
    } finally {
      setIsUpdatingUsername(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingPassword(true)
    setPasswordError(null)
    setPasswordSuccess(false)

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden")
      setIsUpdatingPassword(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres")
      setIsUpdatingPassword(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setPasswordError(error.message)
        return
      }

      setPasswordSuccess(true)
      setPassword("")
      setConfirmPassword("")
    } catch (err) {
      setPasswordError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.")
      console.error(err)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      setDeleteError("Por favor, introduce tu correo electrónico para confirmar")
      return
    }

    setIsDeletingAccount(true)
    setDeleteError(null)

    try {
      // Primero eliminamos los datos del usuario
      await supabase.from("user_profiles").delete().eq("user_id", user?.id)
      await supabase.from("calendar_events").delete().eq("user_id", user?.id)
      await supabase.from("configuracion_usuario").delete().eq("user_id", user?.id)
      await supabase.from("etiquetas").delete().eq("user_id", user?.id)
      await supabase.from("instancias_excluidas").delete().eq("user_id", user?.id)

      // Luego eliminamos la cuenta
      // Nota: Supabase no tiene una API directa para eliminar usuarios,
      // esto tendría que hacerse desde el panel de administración o con una función personalizada
      await signOut()
      window.location.href = "/"
    } catch (err) {
      setDeleteError("Ocurrió un error inesperado. Por favor, inténtalo de nuevo.")
      console.error(err)
      setIsDeletingAccount(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold theme-title">Configuración</h1>
            <UserNav />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="tema" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Tema</span>
              </TabsTrigger>
              <TabsTrigger value="cuenta" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Cuenta</span>
              </TabsTrigger>
              <TabsTrigger value="seguridad" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Seguridad</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tema" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalización del tema</CardTitle>
                  <CardDescription>Configura el aspecto visual de tu calendario</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Seleccionar tema</h3>
                    <div className="p-4 border rounded-md bg-muted/20">
                      <SelectorTema />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Personalizar colores</h3>
                    <div className="p-4 border rounded-md bg-muted/20">
                      <PersonalizadorTema />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cuenta" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la cuenta</CardTitle>
                  <CardDescription>Gestiona los detalles de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Correo electrónico</Label>
                    <div className="p-2 border rounded-md bg-muted/50">{user?.email}</div>
                  </div>

                  {isLoadingProfile ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateUsername} className="space-y-4">
                      {usernameError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{usernameError}</AlertDescription>
                        </Alert>
                      )}

                      {usernameSuccess && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <AlertDescription>Nombre de usuario actualizado correctamente.</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="username">Nombre de usuario</Label>
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="theme-input"
                        />
                      </div>

                      <Button type="submit" disabled={isUpdatingUsername}>
                        {isUpdatingUsername ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Actualizando...
                          </>
                        ) : (
                          "Actualizar nombre de usuario"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => signOut()} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </Button>

                  <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Eliminar cuenta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Eliminar cuenta</DialogTitle>
                        <DialogDescription>
                          Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos y no podrás
                          recuperarlos.
                        </DialogDescription>
                      </DialogHeader>

                      {deleteError && (
                        <Alert variant="destructive" className="my-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{deleteError}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-4 py-4">
                        <p>
                          Para confirmar, escribe tu correo electrónico: <strong>{user?.email}</strong>
                        </p>
                        <Input
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Escribe tu correo electrónico"
                          className="theme-input"
                        />
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount || deleteConfirmation !== user?.email}
                        >
                          {isDeletingAccount ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Eliminando...
                            </>
                          ) : (
                            "Eliminar permanentemente"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="seguridad" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                  <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    {passwordError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}

                    {passwordSuccess && (
                      <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertDescription>Contraseña actualizada correctamente.</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password">Nueva contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="theme-input"
                      />
                      <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 8 caracteres</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="theme-input"
                      />
                    </div>

                    <Button type="submit" disabled={isUpdatingPassword}>
                      {isUpdatingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Actualizando...
                        </>
                      ) : (
                        "Actualizar contraseña"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
