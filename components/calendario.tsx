"use client"
import { useState, useEffect } from "react"
import type { ConfiguracionRecurrencia } from "@/components/tarea-recurrente"
import { generarFechasRecurrencia } from "@/lib/utilidades-recurrencia"

export type Etiqueta = {
  id: string
  nombre: string
  color: string
}

export type Recordatorio = {
  id: string
  tareaId: string
  tiempo: number // minutos antes
  enviado: boolean
}

export type Tarea = {
  id: string
  titulo: string
  descripcion: string
  fecha: Date
  horaInicio: string
  horaFin: string
  color: string
  etiquetas: string[] // IDs de etiquetas
  recordatorios: Recordatorio[]
  recurrencia?: ConfiguracionRecurrencia
  tareaOriginalId?: string // Para instancias de tareas recurrentes
}

type TipoVista = "diaria" | "semanal" | "mensual" | "anual"

export function Calendario() {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([])
  const [fechaActual, setFechaActual] = useState(new Date())
  const [modalAbierto, setModalAbierto] = useState(false)
  const [tareaEditar, setTareaEditar] = useState<Tarea | null>(null)
  const [tipoVista, setTipoVista] = useState<TipoVista>("mensual")
  const [etiquetasFiltradas, setEtiquetasFiltradas] = useState<string[]>([])
  const [mostrarGestorEtiquetas, setMostrarGestorEtiquetas] = useState(false)
  const [mostrarGestorRecordatorios, setMostrarGestorRecordatorios] = useState(false)
  const [mostrarRecurrentes, setMostrarRecurrentes] = useState(true)

  // Cargar tareas y etiquetas del localStorage al iniciar
  useEffect(() => {
    const tareasGuardadas = localStorage.getItem("tareas")
    if (tareasGuardadas) {
      try {
        const tareasParseadas = JSON.parse(tareasGuardadas).map((tarea: any) => ({
          ...tarea,
          fecha: new Date(tarea.fecha),
          etiquetas: tarea.etiquetas || [],
          recordatorios: tarea.recordatorios || [],
          recurrencia: tarea.recurrencia || { tipo: "ninguna", intervalo: 1 },
        }))
        setTareas(tareasParseadas)
      } catch (error) {
        console.error("Error al cargar tareas:", error)
      }
    }

    const etiquetasGuardadas = localStorage.getItem("etiquetas")
    if (etiquetasGuardadas) {
      try {
        setEtiquetas(JSON.parse(etiquetasGuardadas))
      } catch (error) {
        console.error("Error al cargar etiquetas:", error)
      }
    } else {
      // Etiquetas por defecto
      const etiquetasDefault = [
        { id: "1", nombre: "Trabajo", color: "#f87171" },
        { id: "2", nombre: "Personal", color: "#60a5fa" },
        { id: "3", nombre: "Importante", color: "#facc15" },
      ]
      setEtiquetas(etiquetasDefault)
      localStorage.setItem("etiquetas", JSON.stringify(etiquetasDefault))
    }
  }, [])

  // Guardar tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas))
  }, [tareas])

  // Guardar etiquetas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("etiquetas", JSON.stringify(etiquetas))
  }, [etiquetas])

  // Verificar recordatorios cada minuto
  useEffect(() => {
    const verificarRecordatorios = () => {
      const ahora = new Date()

      tareas.forEach((tarea) => {
        if (!tarea.recordatorios) return

        tarea.recordatorios.forEach((recordatorio) => {
          if (recordatorio.enviado) return

          const fechaTarea = new Date(tarea.fecha)
          const [horas, minutos] = tarea.horaInicio.split(":").map(Number)
          fechaTarea.setHours(horas, minutos, 0, 0)

          // Restar el tiempo del recordatorio
          const tiempoRecordatorio = new Date(fechaTarea.getTime() - recordatorio.tiempo * 60000)

          // Si es hora de mostrar el recordatorio
          if (ahora >= tiempoRecordatorio && ahora <= fechaTarea) {
            // Mostrar notificación
            if (Notification.permission === "granted") {
              new Notification("Recordatorio: " + tarea.titulo, {
                body: `Comienza en ${recordatorio.tiempo} minutos - ${tarea.horaInicio}`,
                icon: "/logo.png",
              })
            }

            // Marcar como enviado
            setTareas(
              tareas.map((t) => {
                if (t.id === tarea.id) {
                  return {
                    ...t,
                    recordatorios: t.recordatorios.map((r) => {
                      if (r.id === recordatorio.id) {
                        return { ...r, enviado: true }
                      }
                      return r
                    }),
                  }
                }
                return t
              }),
            )
          }
        })
      })
    }

    // Solicitar permiso para notificaciones
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }

    const intervalo = setInterval(verificarRecordatorios, 60000) // Cada minuto
    verificarRecordatorios() // Verificar inmediatamente al cargar

    return () => clearInterval(intervalo)
  }, [tareas])

  // Generar instancias de tareas recurrentes
  useEffect(() => {
    // Obtener solo las tareas originales (no instancias)
    const tareasOriginales = tareas.filter((tarea) => !tarea.tareaOriginalId)

    // Filtrar tareas recurrentes
    const tareasRecurrentes = tareasOriginales.filter(
      (tarea) => tarea.recurrencia && tarea.recurrencia.tipo !== "ninguna",
    )

    if (tareasRecurrentes.length === 0) return

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
      const recurrencia = tareaOriginal.recurrencia!
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

      // Generar fechas recurrentes usando la nueva utilidad
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
    if (nuevasInstancias.length > 0 || tareas.some((t) => t.tareaOriginalId)) {
      setTareas([...tareasBase, ...nuevasInstancias])
    }
  }, [fechaActual, tareas.filter((t) => !t.tareaOriginalId).length]) // Regenerar cuando cambie la fecha actual o se agregue/elimine una tarea original

  const agregarTarea = (tarea: Tarea) => {
    if (tareaEditar) {
      // Si estamos editando una instancia de tarea recurrente
      if (tareaEditar.tareaOriginalId) {
        // Preguntar si quiere editar todas las instancias o solo esta
        const editarTodas = window.confirm(
          "¿Desea aplicar estos cambios a todas las instancias de esta tarea recurrente?",
        )

        if (editarTodas) {
          // Encontrar la tarea original
          const tareaOriginal = tareas.find((t) => t.id === tareaEditar.tareaOriginalId)

          if (tareaOriginal) {
            // Actualizar la tarea original
            const nuevaTareaOriginal = {
              ...tareaOriginal,
              titulo: tarea.titulo,
              descripcion: tarea.descripcion,
              horaInicio: tarea.horaInicio,
              horaFin: tarea.horaFin,
              color: tarea.color,
              etiquetas: tarea.etiquetas,
              recordatorios: tarea.recordatorios,
              recurrencia: tarea.recurrencia,
            }

            // Actualizar todas las instancias
            setTareas(
              tareas.map((t) => {
                if (t.id === tareaOriginal.id) {
                  return nuevaTareaOriginal
                } else if (t.tareaOriginalId === tareaOriginal.id) {
                  return {
                    ...t,
                    titulo: tarea.titulo,
                    descripcion: tarea.descripcion,
                    horaInicio: tarea.horaInicio,
                    horaFin: tarea.horaFin,
                    color: tarea.color,
                    etiquetas: tarea.etiquetas,
                    recordatorios: tarea.recordatorios,
                  }
                }
                return t
              }),
            )
          }
        } else {
          // Solo actualizar esta instancia
          setTareas(tareas.map((t) => (t.id === tareaEditar.id ? tarea : t)))
        }
      } else {
        // Editar tarea normal o tarea original
        setTareas(
          tareas.map((t) => {
            if (t.id === tareaEditar.id) {
              return tarea
            } else if (t.tareaOriginalId === tareaEditar.id) {
              // Actualizar también las instancias si cambian ciertos campos
              return {
                ...t,
                titulo: tarea.titulo,
                descripcion: tarea.descripcion,
                horaInicio: tarea.horaInicio,
                horaFin: tarea.horaFin,
                color: tarea.color,
                etiquetas: tarea.etiquetas,
                recordatorios: tarea.recordatorios,
              }
            }
            return t
          }),
        )
      }
      setTareaEditar(null)
    } else {
      // Agregar nueva tarea
      setTareas([...tareas, tarea])
    }
    setModalAbierto(false)
  }

  const eliminarTarea = (id: string) => {
    // Verificar si es una tarea recurrente o una instancia
    const tarea = tareas.find((t) => t.id === id)

    if (tarea?.tareaOriginalId) {
      // Es una instancia de tarea recurrente
      const eliminarTodas = window.confirm("¿Desea eliminar todas las instancias de esta tarea recurrente?")

      if (eliminarTodas) {
        // Eliminar la tarea original y todas sus instancias
        setTareas(tareas.filter((t) => t.id !== tarea.tareaOriginalId && t.tareaOriginalId !== tarea.tareaOriginalId))
      } else {
        // Solo eliminar esta instancia
        setTareas(tareas.filter((t) => t.id !== id))
      }
    } else {
      // Eliminar la tarea y todas sus instancias si es recurrente
      setTareas(tareas.filter((t) => t.id !== id && t.tareaOriginalId !== id))
    }
  }

  const abrirModalEditar = (tarea: Tarea) => {
    setTareaEditar(tarea)
    setModalAbierto(true)
  }

  const agregarEtiqueta = (etiqueta: Etiqueta) => {
    setEtiquetas([...etiquetas, etiqueta])
  }

  const editarEtiqueta = (id: string, nombre: string, color: string) => {
    setEtiquetas(etiquetas.map((e) => (e.id === id ? { ...e, nombre, color } : e)))
  }

  const eliminarEtiqueta = (id: string) => {
    setEtiquetas(etiquetas.filter((e) => e.id !== id))
  }

  // Let's create a utility function to handle recurring dates properly, especially for edge cases like months with varying days:
}
