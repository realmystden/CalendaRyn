"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Edit2, Trash2, Tag, Bell, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Tarea, Etiqueta } from "@/components/calendario"
import { obtenerDiasSemana, formatearFecha } from "@/lib/utilidades-fecha"

interface VistaSemanalProps {
  tareas: Tarea[]
  fechaActual: Date
  etiquetas?: Etiqueta[]
  onEditarTarea: (tarea: Tarea) => void
  onEliminarTarea: (tarea: Tarea) => void
}

const HORAS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

export function VistaSemanal({
  tareas = [],
  fechaActual,
  etiquetas = [],
  onEditarTarea,
  onEliminarTarea,
}: VistaSemanalProps) {
  const [fechaInicio, setFechaInicio] = useState<Date>(new Date())

  // Calcular el inicio de la semana (lunes) cuando cambia la fecha actual
  useEffect(() => {
    const fecha = new Date(fechaActual)
    const diaSemana = fecha.getDay() || 7 // 0 es domingo, lo convertimos a 7
    fecha.setDate(fecha.getDate() - (diaSemana - 1)) // Retroceder al lunes
    setFechaInicio(fecha)
  }, [fechaActual])

  const semanaAnterior = () => {
    const nuevaFecha = new Date(fechaInicio)
    nuevaFecha.setDate(fechaInicio.getDate() - 7)
    setFechaInicio(nuevaFecha)
  }

  const semanaSiguiente = () => {
    const nuevaFecha = new Date(fechaInicio)
    nuevaFecha.setDate(fechaInicio.getDate() + 7)
    setFechaInicio(nuevaFecha)
  }

  // Obtener los 7 días de la semana
  const diasSemana = obtenerDiasSemana(fechaInicio)

  // Función para obtener tareas de un día específico
  const obtenerTareasDia = (dia: Date, hora: number) => {
    return tareas.filter((tarea) => {
      const fechaTarea = new Date(tarea.fecha)
      const horaTarea = Number.parseInt(tarea.horaInicio.split(":")[0])

      return (
        fechaTarea.getDate() === dia.getDate() &&
        fechaTarea.getMonth() === dia.getMonth() &&
        fechaTarea.getFullYear() === dia.getFullYear() &&
        horaTarea === hora
      )
    })
  }

  // Verificar si una fecha es hoy
  const esHoy = (fecha: Date) => {
    const hoy = new Date()
    return (
      fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    )
  }

  // Función para identificar si una tarea es recurrente
  const esRecurrente = (tarea: Tarea) => {
    return tarea.tareaOriginalId || (tarea.recurrencia && tarea.recurrencia.tipo !== "ninguna")
  }

  return (
    <div className="theme-view">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={semanaAnterior} className="theme-nav-button">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-medium theme-date-header">
          {formatearFecha(fechaInicio, "mes-año")} - Semana {Math.ceil(fechaInicio.getDate() / 7)}
        </h2>
        <Button variant="outline" size="icon" onClick={semanaSiguiente} className="theme-nav-button">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Cabecera con los días */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="theme-hour-header"></div>
            {diasSemana.map((dia, index) => (
              <div
                key={index}
                className={`text-center py-2 font-medium theme-day-header ${esHoy(dia) ? "theme-today" : ""}`}
              >
                <div>{formatearFecha(dia, "dia-semana-corto")}</div>
                <div className="text-lg">{dia.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Filas de horas */}
          <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
            {HORAS.map((hora) => (
              <div key={hora} className="grid grid-cols-8 gap-1 mb-1">
                <div className="text-right pr-2 py-2 text-sm theme-hour">{hora}:00</div>

                {diasSemana.map((dia, index) => {
                  const tareasDia = obtenerTareasDia(dia, hora)

                  return (
                    <div key={index} className="min-h-[60px] border-t theme-hour-cell">
                      {tareasDia.map((tarea) => {
                        // Filtrar etiquetas que pertenecen a esta tarea
                        const etiquetasTarea = etiquetas.filter(
                          (etiqueta) => tarea.etiquetas && tarea.etiquetas.includes(etiqueta.id),
                        )

                        // Verificar si la tarea tiene recordatorios
                        const tieneRecordatorios = tarea.recordatorios && tarea.recordatorios.length > 0

                        // Verificar si es una tarea recurrente
                        const tareaRecurrente = esRecurrente(tarea)

                        return (
                          <div
                            key={tarea.id}
                            className="p-1 mb-1 rounded-sm text-xs theme-task"
                            style={{ borderLeftColor: tarea.color, borderLeftWidth: "3px" }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="truncate">
                                <div className="font-medium truncate">{tarea.titulo}</div>
                                <div className="text-xs theme-task-time">
                                  {tarea.horaInicio} - {tarea.horaFin}
                                </div>

                                {/* Iconos de etiquetas, recordatorios y recurrencia */}
                                <div className="flex items-center mt-1 space-x-1">
                                  {tareaRecurrente && <RotateCw className="h-3 w-3" style={{ color: tarea.color }} />}
                                  {etiquetasTarea.length > 0 && (
                                    <Tag className="h-3 w-3" style={{ color: etiquetasTarea[0].color }} />
                                  )}
                                  {tieneRecordatorios && <Bell className="h-3 w-3 theme-reminder-icon" />}
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 theme-task-button">
                                    <span className="sr-only">Abrir menú</span>
                                    <svg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 15 15"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3"
                                    >
                                      <path
                                        d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                        fill="currentColor"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                      ></path>
                                    </svg>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="theme-dropdown">
                                  <DropdownMenuItem
                                    onClick={() => onEditarTarea(tarea)}
                                    className="theme-dropdown-item"
                                  >
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onEliminarTarea(tarea)}
                                    className="theme-dropdown-item text-red-500"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
