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
import { Plus } from "lucide-react"
import { generarFechasRecurrencia } from "@/lib/utilidades-recurrencia"

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
}

export function CalendarioCompleto() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [fechaActual, setFechaActual] = useState(new Date())
  const [modalAbierto, setModalAbierto] = useState(false)
  const [tareaEditar, setTareaEditar] = useState<Tarea | null>(null)
  const [vistaActual, setVistaActual] = useState("mensual")
  const [etiquetas, setEtiquetas] = useState<string[]>([]) // Assuming etiquetas are strings
  const [tareasConRecurrencias, setTareasConRecurrencias] = useState<Tarea[]>([])

  // Estado para el diálogo de confirmación de eliminación
  const [dialogoEliminarAbierto, setDialogoEliminarAbierto] = useState(false)
  const [tareaEliminar, setTareaEliminar] = useState<Tarea | null>(null)

  // Cargar tareas del localStorage
  useEffect(() => {
    const tareasGuardadas = localStorage.getItem("calendaRyn-tareas")
    if (tareasGuardadas) {
      try {
        const tareasParseadas = JSON.parse(tareasGuardadas)
        // Convertir las fechas de string a Date
        const tareasConFechas = tareasParseadas.map((tarea: any) => ({
          ...tarea,
          fecha: new Date(tarea.fecha),
        }))
        setTareas(tareasConFechas)
      } catch (error) {
        console.error("Error al cargar tareas:", error)
      }
    }
  }, [])

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("calendaRyn-tareas", JSON.stringify(tareas))
  }, [tareas])

  const agregarTarea = (tarea: Tarea) => {
    if (tareaEditar) {
      // Editar tarea existente
      setTareas(tareas.map((t) => (t.id === tareaEditar.id ? tarea : t)))
      setTareaEditar(null)
    } else {
      // Agregar nueva tarea
      setTareas([...tareas, tarea])
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
    if (tarea.recurrencia?.tipo !== "ninguna" || tarea.tareaOriginalId) {
      setTareaEliminar(tarea)
      setDialogoEliminarAbierto(true)
    } else {
      // Si no es recurrente, eliminar directamente
      eliminarTareaDirecta(tarea.id)
    }
  }

  // Función para eliminar una tarea directamente (sin confirmación)
  const eliminarTareaDirecta = (id: string) => {
    setTareas(tareas.filter((tarea) => tarea.id !== id))
  }

  // Función para eliminar solo la instancia actual
  const eliminarSoloEstaInstancia = () => {
    if (!tareaEliminar) return

    setTareas(tareas.filter((tarea) => tarea.id !== tareaEliminar.id))
    setDialogoEliminarAbierto(false)
    setTareaEliminar(null)
  }

  // Función para eliminar todas las instancias
  const eliminarTodasLasInstancias = () => {
    if (!tareaEliminar) return

    // Si es una instancia, obtener el ID de la tarea original
    const idOriginal = tareaEliminar.tareaOriginalId || tareaEliminar.id

    // Eliminar la tarea original y todas sus instancias
    setTareas(tareas.filter((tarea) => tarea.id !== idOriginal && tarea.tareaOriginalId !== idOriginal))

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

        // Crear un ID único para esta instancia
        const idInstancia = `${tareaOriginal.id}-${fecha.toISOString()}`

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
    setTareasConRecurrencias([...tareasBase, ...nuevasInstancias])
  }, [tareas, fechaActual])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
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
