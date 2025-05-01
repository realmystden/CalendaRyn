"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Tag, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Tarea, Etiqueta } from "@/components/calendario"
import { obtenerNombreMes, obtenerDiasEnMes, obtenerPrimerDiaSemana } from "@/lib/utilidades-fecha"

interface VistaAnualProps {
  tareas: Tarea[]
  fechaActual: Date
  etiquetas: Etiqueta[]
  onSeleccionarMes: (fecha: Date) => void
}

export function VistaAnual({ tareas = [], fechaActual, etiquetas = [], onSeleccionarMes }: VistaAnualProps) {
  const [año, setAño] = useState(fechaActual.getFullYear())

  const añoAnterior = () => {
    setAño(año - 1)
  }

  const añoSiguiente = () => {
    setAño(año + 1)
  }

  // Generar los 12 meses
  const meses = Array.from({ length: 12 }, (_, i) => i)

  // Función para contar tareas en un mes
  const contarTareasMes = (mes: number) => {
    return tareas.filter((tarea) => {
      const fechaTarea = new Date(tarea.fecha)
      return fechaTarea.getMonth() === mes && fechaTarea.getFullYear() === año
    }).length
  }

  // Función para contar tareas con etiquetas en un mes
  const contarTareasConEtiquetasMes = (mes: number) => {
    return tareas.filter((tarea) => {
      const fechaTarea = new Date(tarea.fecha)
      return (
        fechaTarea.getMonth() === mes &&
        fechaTarea.getFullYear() === año &&
        tarea.etiquetas &&
        tarea.etiquetas.length > 0
      )
    }).length
  }

  // Función para contar tareas con recordatorios en un mes
  const contarTareasConRecordatoriosMes = (mes: number) => {
    return tareas.filter((tarea) => {
      const fechaTarea = new Date(tarea.fecha)
      return (
        fechaTarea.getMonth() === mes &&
        fechaTarea.getFullYear() === año &&
        tarea.recordatorios &&
        tarea.recordatorios.length > 0
      )
    }).length
  }

  // Función para generar mini calendario
  const generarMiniCalendario = (mes: number) => {
    const diasEnMes = obtenerDiasEnMes(año, mes)
    const primerDia = obtenerPrimerDiaSemana(año, mes)

    // Crear array para la cuadrícula del calendario
    const diasCalendario = Array(42).fill(null)

    for (let i = 0; i < diasEnMes; i++) {
      diasCalendario[primerDia + i] = i + 1
    }

    // Dividir en semanas
    const semanas = []
    for (let i = 0; i < 6; i++) {
      semanas.push(diasCalendario.slice(i * 7, (i + 1) * 7))
    }

    // Verificar si la última semana está vacía
    const ultimaSemana = semanas[5]
    const mostrarUltimaSemana = ultimaSemana.some((dia) => dia !== null)

    return semanas.slice(0, mostrarUltimaSemana ? 6 : 5)
  }

  // Verificar si un mes es el mes actual
  const esMesActual = (mes: number) => {
    const hoy = new Date()
    return mes === hoy.getMonth() && año === hoy.getFullYear()
  }

  // Verificar si una fecha tiene tareas
  const tieneTareas = (dia: number | null, mes: number) => {
    if (!dia) return false

    return tareas.some((tarea) => {
      const fechaTarea = new Date(tarea.fecha)
      return fechaTarea.getDate() === dia && fechaTarea.getMonth() === mes && fechaTarea.getFullYear() === año
    })
  }

  return (
    <div className="theme-view">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" size="icon" onClick={añoAnterior} className="theme-nav-button">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold theme-date-header">{año}</h2>
        <Button variant="outline" size="icon" onClick={añoSiguiente} className="theme-nav-button">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {meses.map((mes) => {
          const semanas = generarMiniCalendario(mes)
          const cantidadTareas = contarTareasMes(mes)
          const tareasConEtiquetas = contarTareasConEtiquetasMes(mes)
          const tareasConRecordatorios = contarTareasConRecordatoriosMes(mes)

          return (
            <div
              key={mes}
              className={`
                p-3 border rounded-lg cursor-pointer theme-month
                ${esMesActual(mes) ? "theme-current-month" : ""}
              `}
              onClick={() => onSeleccionarMes(new Date(año, mes, 1))}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium theme-month-name">{obtenerNombreMes(mes)}</h3>
                {cantidadTareas > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 rounded-full theme-task-count">{cantidadTareas}</span>
                    {tareasConEtiquetas > 0 && <Tag className="h-3.5 w-3.5 text-primary" />}
                    {tareasConRecordatorios > 0 && <Bell className="h-3.5 w-3.5 text-primary" />}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-7 gap-0">
                {["L", "M", "X", "J", "V", "S", "D"].map((dia) => (
                  <div key={dia} className="text-center text-xs theme-weekday-mini">
                    {dia}
                  </div>
                ))}

                {semanas.map((semana, semanaIndex) =>
                  semana.map((dia, diaIndex) => (
                    <div
                      key={`${semanaIndex}-${diaIndex}`}
                      className={`
                        h-5 w-5 flex items-center justify-center text-xs
                        ${dia ? "theme-day-mini" : "theme-day-disabled-mini"}
                        ${tieneTareas(dia, mes) ? "theme-day-with-tasks" : ""}
                      `}
                    >
                      {dia}
                    </div>
                  )),
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
