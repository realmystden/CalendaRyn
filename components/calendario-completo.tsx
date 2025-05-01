"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarioCompacto } from "@/components/calendario-compacto"
import { VistaDiaria } from "@/components/vistas/vista-diaria"
import { VistaSemanal } from "@/components/vistas/vista-semanal"
import { VistaMensual } from "@/components/vistas/vista-mensual"
import { VistaAnual } from "@/components/vistas/vista-anual"
import { ModalTarea } from "@/components/modal-tarea"
import { DialogoConfirmacionRecurrencia } from "@/components/dialogo-confirmacion-recurrencia"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { generarFechasRecurrencia } from "@/lib/utilidades-recurrencia"
import { getBrowserClient } from "@/lib/supabase"
import { useAuth } from "@/components/auth/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export type Tarea = {
  id: string
  titulo: string
  descripcion: string
  fecha: Date
  horaInicio: string
  horaFin: string
  color: string
  etiquetas?: string[]
  recordatorios?: {
    id: string
    tareaId: string
    tiempo: number
    enviado: boolean
  }[]
  recurrencia?: {
    tipo: "ninguna" | "diaria" | "semanal" | "mensual" | "anual"
    intervalo: number
    diasSemana?: number[]
    tipoMensual?: "diaMes" | "posicionDia"
    posicionDia?: number
    diaSemana?: number
    finalizacion?: {
      tipo: "nunca" | "despues" | "fecha"
      ocurrencias?: number
      fecha?: Date
    }
  }
  tareaOriginalId?: string
  user_id?: string
}

// Tipo para instancias excluidas
type InstanciaExcluida = {
  id?: string
  tareaOriginalId: string
  fechaExcluida: string // Fecha en formato ISO
  user_id?: string
}

export function CalendarioCompleto() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [fechaActual, setFechaActual] = useState(new Date())
  const [modalAbierto, setModalAbierto] = useState(false)
  const [tareaEditar, setTareaEditar] = useState<Tarea | null>(null)
  const [vistaActual, setVistaActual] = useState("mensual")
  const [etiquetas, setEtiquetas] = useState<string[]>([])
  const [tareasConRecurrencias, setTareasConRecurrencias] = useState<Tarea[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para instancias excluidas (instancias individuales eliminadas)
  const [instanciasExcluidas, setInstanciasExcluidas] = useState<InstanciaExcluida[]>([])

  // Estado para el diálogo de confirmación de eliminación
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false)
  const [tareaEliminar, setTareaEliminar] = useState<Tarea | null>(null)

  const supabase = getBrowserClient()
  const { user } = useAuth()

  // Cargar tareas del usuario desde Supabase
  useEffect(() => {
    const cargarTareas = async () => {
      if (!user) {
        console.log("No hay usuario autenticado, no se cargarán tareas")
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)
      console.log("Iniciando carga de tareas para el usuario:", user.id)

      try {
        // Cargar tareas
        console.log("Consultando tabla calendar_events...")
        const { data: tareasData, error: tareasError } = await supabase
          .from("calendar_events")
          .select("*")
          .eq("user_id", user.id)

        if (tareasError) {
          console.error("Error al cargar tareas:", tareasError)
          throw tareasError
        }

        console.log(`Se encontraron ${tareasData?.length || 0} tareas`)

        // Cargar instancias excluidas
        console.log("Consultando tabla instancias_excluidas...")
        const { data: exclusionesData, error: exclusionesError } = await supabase
          .from("instancias_excluidas")
          .select("*")
          .eq("user_id", user.id)

        if (exclusionesError) {
          console.error("Error al cargar exclusiones:", exclusionesError)
          throw exclusionesError
        }

        console.log(`Se encontraron ${exclusionesData?.length || 0} exclusiones`)

        // Convertir las fechas de string a Date y mapear los nombres de columnas
        const tareasConFechas = (tareasData || [])
          .map((tarea: any) => {
            console.log("Procesando tarea:", tarea.id)
            try {
              return {
                id: tarea.id,
                titulo: tarea.title || "",
                descripcion: tarea.description || "",
                fecha: new Date(`${tarea.event_date}T00:00:00`),
                horaInicio: tarea.start_time ? tarea.start_time.substring(0, 5) : "00:00", // Convertir "HH:MM:SS" a "HH:MM"
                horaFin: tarea.end_time ? tarea.end_time.substring(0, 5) : "00:00", // Convertir "HH:MM:SS" a "HH:MM"
                color: tarea.color || "#f87171",
                etiquetas: tarea.tags || [],
                recordatorios: tarea.reminders || [],
                recurrencia: tarea.recurrence,
                tareaOriginalId: tarea.original_event_id,
                user_id: tarea.user_id,
              }
            } catch (err) {
              console.error("Error al procesar tarea:", tarea, err)
              return null
            }
          })
          .filter(Boolean)

        console.log("Tareas procesadas correctamente")
        setTareas(tareasConFechas)
        setInstanciasExcluidas(exclusionesData || [])
        console.log("Datos cargados con éxito")
      } catch (err: any) {
        console.error("Error al cargar datos:", err)
        setError(`Error al cargar tus tareas: ${err.message || "Error desconocido"}`)
      } finally {
        console.log("Finalizando carga de tareas")
        setIsLoading(false)
      }
    }

    if (user) {
      console.log("Usuario autenticado, cargando tareas...")
      cargarTareas()
    } else {
      console.log("No hay usuario autenticado, esperando...")
      setIsLoading(false)
    }
  }, [user])

  // Añade este useEffect después del useEffect de carga de tareas
  useEffect(() => {
    // Si está cargando, establecer un timeout para evitar carga infinita
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.log("Timeout de carga alcanzado")
        setIsLoading(false)
        setError("La carga está tomando demasiado tiempo. Por favor, recarga la página.")
      }, 10000) // 10 segundos de timeout

      return () => clearTimeout(timeoutId)
    }
  }, [isLoading])

  // Guardar tareas en Supabase cuando cambien
  const guardarTarea = async (tarea: Tarea) => {
    if (!user) return

    try {
      // Convertir fecha a formato ISO para la fecha del evento
      const eventDate = tarea.fecha.toISOString().split("T")[0]

      // Preparar datos para guardar (mapeando a los nombres de columnas de la base de datos)
      const tareaParaGuardar = {
        title: tarea.titulo,
        description: tarea.descripcion,
        event_date: eventDate,
        start_time: `${tarea.horaInicio}:00`, // Añadir segundos para el formato time
        end_time: `${tarea.horaFin}:00`, // Añadir segundos para el formato time
        color: tarea.color,
        tags: tarea.etiquetas || [],
        reminders: tarea.recordatorios || [],
        recurrence: tarea.recurrencia,
        original_event_id: tarea.tareaOriginalId,
        user_id: user.id,
      }

      if (tareaEditar) {
        // Actualizar tarea existente
        const { error } = await supabase
          .from("calendar_events")
          .update(tareaParaGuardar)
          .eq("id", tarea.id)
          .eq("user_id", user.id)

        if (error) throw error

        setTareas(tareas.map((t) => (t.id === tareaEditar.id ? { ...tarea, user_id: user.id } : t)))
      } else {
        // Agregar nueva tarea
        const { data, error } = await supabase.from("calendar_events").insert(tareaParaGuardar).select()

        if (error) throw error

        // Añadir la tarea con el ID generado por la base de datos
        if (data && data[0]) {
          const nuevaTarea = {
            ...tarea,
            id: data[0].id,
            user_id: user.id,
          }
          setTareas([...tareas, nuevaTarea])
        }
      }
    } catch (err) {
      console.error("Error al guardar tarea:", err)
      setError("Error al guardar la tarea. Por favor, intenta de nuevo.")
    }
  }

  const agregarTarea = (tarea: Tarea) => {
    if (tareaEditar) {
      // Editar tarea existente
      guardarTarea(tarea)
      setTareaEditar(null)
    } else {
      // Agregar nueva tarea
      guardarTarea(tarea)
    }
    setModalAbierto(false)
  }

  const editarTarea = (tarea: Tarea) => {
    setTareaEditar(tarea)
    setModalAbierto(true)
  }

  // Función para iniciar el proceso de eliminación
  const iniciarEliminarTarea = (tarea: Tarea) => {
    // Verificar si es una tarea recurrente o una instancia
    const esRecurrente = tarea.recurrencia && tarea.recurrencia.tipo !== "ninguna"
    const esInstanciaRecurrente = Boolean(tarea.tareaOriginalId)

    if (esRecurrente || esInstanciaRecurrente) {
      // Solo mostrar el diálogo de confirmación para tareas recurrentes o instancias
      setTareaEliminar(tarea)
      setDialogoEliminarAbierto(true)
    } else {
      // Si no es recurrente, eliminar directamente
      eliminarTareaDirecta(tarea.id)
    }
  }

  // Función para eliminar una tarea directamente (sin confirmación)
  const eliminarTareaDirecta = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase.from("calendar_events").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      setTareas(tareas.filter((tarea) => tarea.id !== id))
    } catch (err) {
      console.error("Error al eliminar tarea:", err)
      setError("Error al eliminar la tarea. Por favor, intenta de nuevo.")
    }
  }

  // Función para eliminar solo la instancia actual
  const eliminarSoloEstaInstancia = async () => {
    if (!tareaEliminar || !user) return

    try {
      if (tareaEliminar.tareaOriginalId) {
        // Es una instancia de una tarea recurrente
        // Añadir a la lista de instancias excluidas
        const nuevaExclusion: InstanciaExcluida = {
          tareaOriginalId: tareaEliminar.tareaOriginalId,
          fechaExcluida: tareaEliminar.fecha.toISOString(),
          user_id: user.id,
        }

        const { error } = await supabase.from("instancias_excluidas").insert(nuevaExclusion)

        if (error) throw error

        setInstanciasExcluidas([...instanciasExcluidas, nuevaExclusion])

        // Actualizar las tareas con recurrencias para reflejar la eliminación
        setTareasConRecurrencias(tareasConRecurrencias.filter((tarea) => tarea.id !== tareaEliminar.id))
      } else if (tareaEliminar.recurrencia && tareaEliminar.recurrencia.tipo !== "ninguna") {
        // Es una tarea original recurrente, excluir esta instancia específica
        const nuevaExclusion: InstanciaExcluida = {
          tareaOriginalId: tareaEliminar.id,
          fechaExcluida: tareaEliminar.fecha.toISOString(),
          user_id: user.id,
        }

        const { error } = await supabase.from("instancias_excluidas").insert(nuevaExclusion)

        if (error) throw error

        setInstanciasExcluidas([...instanciasExcluidas, nuevaExclusion])
      }
    } catch (err) {
      console.error("Error al excluir instancia:", err)
      setError("Error al excluir la instancia. Por favor, intenta de nuevo.")
    }

    setDialogoEliminarAbierto(false)
    setTareaEliminar(null)
  }

  // Función para eliminar todas las instancias
  const eliminarTodasLasInstancias = async () => {
    if (!tareaEliminar || !user) return

    try {
      // Si es una instancia, obtener el ID de la tarea original
      const idOriginal = tareaEliminar.tareaOriginalId || tareaEliminar.id

      // Eliminar la tarea original
      const { error: errorTarea } = await supabase
        .from("calendar_events")
        .delete()
        .eq("id", idOriginal)
        .eq("user_id", user.id)

      if (errorTarea) throw errorTarea

      // También eliminar cualquier exclusión relacionada con esta tarea
      const { error: errorExclusiones } = await supabase
        .from("instancias_excluidas")
        .delete()
        .eq("tareaoriginalid", idOriginal)
        .eq("user_id", user.id)

      if (errorExclusiones) throw errorExclusiones

      // Actualizar el estado local
      setTareas(tareas.filter((tarea) => tarea.id !== idOriginal))
      setInstanciasExcluidas(instanciasExcluidas.filter((exclusion) => exclusion.tareaOriginalId !== idOriginal))
    } catch (err) {
      console.error("Error al eliminar todas las instancias:", err)
      setError("Error al eliminar las instancias. Por favor, intenta de nuevo.")
    }

    setDialogoEliminarAbierto(false)
    setTareaEliminar(null)
  }

  const abrirModalNuevaTarea = () => {
    setTareaEditar(null)
    setModalAbierto(true)
  }

  // Generar instancias de tareas recurrentes
  useEffect(() => {
    // Obtener solo las tareas originales (no instancias)
    const tareasOriginales = tareas.filter((tarea) => !tarea.tareaOriginalId)

    // Filtrar tareas recurrentes
    const tareasRecurrentes = tareasOriginales.filter(
      (tarea) => tarea.recurrencia && tarea.recurrencia.tipo !== "ninguna",
    )

    if (tareasRecurrentes.length === 0) {
      setTareasConRecurrencias(tareas)
      return
    }

    // Rango de fechas para generar instancias (3 meses adelante y 1 mes atrás)
    const fechaInicio = new Date()
    fechaInicio.setMonth(fechaInicio.getMonth() - 1)
    fechaInicio.setHours(0, 0, 0, 0)

    const fechaFin = new Date()
    fechaFin.setMonth(fechaFin.getMonth() + 3)
    fechaFin.setHours(23, 59, 59, 999)

    // Eliminar todas las instancias existentes para regenerarlas
    const tareasBase = tareas.filter((tarea) => !tarea.tareaOriginalId)

    // Generar nuevas instancias
    const nuevasInstancias: Tarea[] = []

    tareasRecurrentes.forEach((tareaOriginal) => {
      if (!tareaOriginal.recurrencia) return

      const recurrencia = tareaOriginal.recurrencia
      const fechaOriginal = new Date(tareaOriginal.fecha)

      // Verificar si la tarea ha finalizado
      if (recurrencia.finalizacion) {
        if (
          recurrencia.finalizacion.tipo === "fecha" &&
          recurrencia.finalizacion.fecha &&
          recurrencia.finalizacion.fecha < fechaInicio
        ) {
          return // La tarea ya ha finalizado
        }
      }

      // Generar fechas recurrentes
      const fechasRecurrentes = generarFechasRecurrencia(fechaOriginal, recurrencia, fechaInicio, fechaFin)

      // Crear instancias para cada fecha generada
      fechasRecurrentes.forEach((fecha) => {
        // No crear instancia para la fecha original (ya existe como tarea original)
        if (
          fecha.getDate() === fechaOriginal.getDate() &&
          fecha.getMonth() === fechaOriginal.getMonth() &&
          fecha.getFullYear() === fechaOriginal.getFullYear()
        ) {
          return
        }

        // Verificar si esta instancia está excluida (fue eliminada individualmente)
        const fechaISO = fecha.toISOString()
        const estaExcluida = instanciasExcluidas.some(
          (exclusion) => exclusion.tareaOriginalId === tareaOriginal.id && exclusion.fechaExcluida === fechaISO,
        )

        if (estaExcluida) {
          return // No crear esta instancia porque fue excluida
        }

        // Crear un ID único para esta instancia
        const idInstancia = `${tareaOriginal.id}-${fechaISO}`

        nuevasInstancias.push({
          ...tareaOriginal,
          id: idInstancia,
          fecha: fecha,
          tareaOriginalId: tareaOriginal.id,
          // No heredar la recurrencia para evitar recursión
          recurrencia: undefined,
        })
      })
    })

    // Actualizar tareas con las nuevas instancias
    if (nuevasInstancias.length > 0 || tareas.some((t) => t.tareaOriginalId)) {
      setTareasConRecurrencias([...tareasBase, ...nuevasInstancias])
    }
  }, [tareas, fechaActual, instanciasExcluidas])

  useEffect(() => {
    // Si está cargando, establecer un timeout para evitar carga infinita
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        console.log("Timeout de carga alcanzado")
        setIsLoading(false)
        setError("La carga está tomando demasiado tiempo. Por favor, recarga la página.")
      }, 10000) // 10 segundos de timeout

      return () => clearTimeout(timeoutId)
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Cargando tu calendario...</p>
          <p className="text-xs text-muted-foreground">
            {user ? `Usuario: ${user.email}` : "No hay usuario autenticado"}
          </p>
        </div>
      </div>
    )
  }

  // Añade esto justo antes del return principal
  console.log("Renderizando calendario con", tareasConRecurrencias.length, "tareas")

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
      {error && (
        <Alert variant="destructive" className="col-span-full mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <CalendarioCompacto fechaActual={fechaActual} setFechaActual={setFechaActual} />

        <Button onClick={abrirModalNuevaTarea} className="w-full theme-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      <div>
        <Tabs value={vistaActual} onValueChange={setVistaActual} className="w-full">
          <TabsList className="mb-4 theme-tabs">
            <TabsTrigger value="diaria" className="theme-tab">
              Diaria
            </TabsTrigger>
            <TabsTrigger value="semanal" className="theme-tab">
              Semanal
            </TabsTrigger>
            <TabsTrigger value="mensual" className="theme-tab">
              Mensual
            </TabsTrigger>
            <TabsTrigger value="anual" className="theme-tab">
              Anual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diaria">
            <VistaDiaria
              tareas={tareasConRecurrencias}
              fechaActual={fechaActual}
              onEditarTarea={editarTarea}
              onEliminarTarea={iniciarEliminarTarea}
            />
          </TabsContent>

          <TabsContent value="semanal">
            <VistaSemanal
              tareas={tareasConRecurrencias}
              fechaActual={fechaActual}
              onEditarTarea={editarTarea}
              onEliminarTarea={iniciarEliminarTarea}
            />
          </TabsContent>

          <TabsContent value="mensual">
            <VistaMensual
              tareas={tareasConRecurrencias}
              fechaActual={fechaActual}
              onEditarTarea={editarTarea}
              onEliminarTarea={iniciarEliminarTarea}
            />
          </TabsContent>

          <TabsContent value="anual">
            <VistaAnual
              tareas={tareasConRecurrencias}
              fechaActual={fechaActual}
              onSeleccionarMes={(fecha) => {
                setFechaActual(fecha)
                setVistaActual("mensual")
              }}
            />
          </TabsContent>
        </Tabs>
      </div>

      {modalAbierto && (
        <ModalTarea
          abierto={modalAbierto}
          onClose={() => {
            setModalAbierto(false)
            setTareaEditar(null)
          }}
          onGuardar={agregarTarea}
          fechaSeleccionada={tareaEditar?.fecha || fechaActual}
          tareaEditar={tareaEditar}
          etiquetas={etiquetas}
        />
      )}

      {/* Diálogo de confirmación para eliminar tareas recurrentes */}
      {dialogoEliminarAbierto && tareaEliminar && (
        <DialogoConfirmacionRecurrencia
          abierto={dialogoEliminarAbierto}
          onClose={() => {
            setDialogoEliminarAbierto(false)
            setTareaEliminar(null)
          }}
          onConfirmarSoloEsta={eliminarSoloEstaInstancia}
          onConfirmarTodas={eliminarTodasLasInstancias}
          titulo={tareaEliminar.titulo}
        />
      )}
    </div>
  )
}
