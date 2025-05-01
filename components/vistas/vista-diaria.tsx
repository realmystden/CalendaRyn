"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit2, Trash2, Tag, Bell, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Tarea, Etiqueta } from "@/components/calendario"
import { formatearFecha } from "@/lib/utilidades-fecha"

interface VistaDiariaProps {
  tareas: Tarea[]
  fechaActual: Date
  etiquetas?: Etiqueta[]
  onEditarTarea: (tarea: Tarea) => void
  onEliminarTarea: (tarea: Tarea) => void
}

const HORAS = Array.from({ length: 24 }, (_, i) => i)

export function VistaDiaria({
  tareas = [],
  fechaActual,
  etiquetas = [],
  onEditarTarea,
  onEliminarTarea,
}: VistaDiariaProps) {
  const [fecha, setFecha] = useState(fechaActual)

  const diaAnterior = () => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setDate(fecha.getDate() - 1)
    setFecha(nuevaFecha)
  }

  const diaSiguiente = () => {
    const nuevaFecha = new Date(fecha)
    nuevaFecha.setDate(fecha.getDate() + 1)
    setFecha(nuevaFecha)
  }

  // Filtrar tareas para el día actual
  const tareasDia = tareas.filter((tarea) => {
    const fechaTarea = new Date(tarea.fecha)
    return (
      fechaTarea.getDate() === fecha.getDate() &&
      fechaTarea.getMonth() === fecha.getMonth() &&
      fechaTarea.getFullYear() === fecha.getFullYear()
    )
  })

  // Organizar tareas por hora
  const tareasPorHora: Record<number, Tarea[]> = {}

  tareasDia.forEach((tarea) => {
    const hora = Number.parseInt(tarea.horaInicio.split(":")[0])
    if (!tareasPorHora[hora]) {
      tareasPorHora[hora] = []
    }
    tareasPorHora[hora].push(tarea)
  })

  // Verificar si es hoy
  const esHoy = () => {
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
        <Button variant="outline" size="icon" onClick={diaAnterior} className="theme-nav-button">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className={`text-xl font-medium theme-date-header ${esHoy() ? "theme-today-text" : ""}`}>
          {formatearFecha(fecha, "completa")}
        </h2>
        <Button variant="outline" size="icon" onClick={diaSiguiente} className="theme-nav-button">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-280px)] theme-timeline">
        {HORAS.map((hora) => {
          const horaFormateada = hora.toString().padStart(2, "0") + ":00"
          const tareasHora = tareasPorHora[hora] || []

          return (
            <div key={hora} className="flex mb-2 theme-hour-row">
              <div className="w-16 text-right pr-4 pt-2 text-sm theme-hour">{horaFormateada}</div>
              <div className="flex-1 min-h-[60px] border-t theme-hour-content">
                {tareasHora.map((tarea) => {
                  // Filtrar etiquetas que pertenecen a esta tarea
                  const etiquetasTarea = etiquetas.filter(
                    (etiqueta) => tarea.etiquetas && tarea.etiquetas.includes(etiqueta.id),
                  )

                  // Verificar si la tarea tiene recordatorios
                  const tieneRecordatorios = tarea.recordatorios && tarea.recordatorios.length > 0

                  return (
                    <div
                      key={tarea.id}
                      className="p-2 mb-1 rounded-md theme-task"
                      style={{ borderLeftColor: tarea.color, borderLeftWidth: "4px" }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{tarea.titulo}</h4>
                          <div className="text-xs theme-task-time">
                            {tarea.horaInicio} - {tarea.horaFin}
                          </div>
                          {tarea.descripcion && (
                            <p className="text-sm mt-1 theme-task-description">{tarea.descripcion}</p>
                          )}

                          {/* Etiquetas */}
                          {etiquetasTarea.length > 0 && (
                            <div className="flex flex-wrap mt-2">
                              {etiquetasTarea.map((etiqueta) => (
                                <div
                                  key={etiqueta.id}
                                  className="theme-tag"
                                  style={{ backgroundColor: `${etiqueta.color}20`, color: etiqueta.color }}
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {etiqueta.nombre}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Recordatorios */}
                          {tieneRecordatorios && (
                            <div className="mt-2">
                              <div className="theme-reminder">
                                <Bell className="h-3 w-3 mr-1 theme-reminder-icon" />
                                {tarea.recordatorios.length === 1
                                  ? "1 recordatorio"
                                  : `${tarea.recordatorios.length} recordatorios`}
                              </div>
                            </div>
                          )}

                          {/* Icono de recurrencia */}
                          {esRecurrente(tarea) && (
                            <div className="mt-2">
                              <div className="theme-recurrence">
                                <RotateCw className="h-3 w-3 mr-1 theme-recurrence-icon" />
                                {tarea.recurrencia
                                  ? tarea.recurrencia.tipo === "diaria"
                                    ? "Diariamente"
                                    : tarea.recurrencia.tipo === "semanal"
                                      ? "Semanalmente"
                                      : tarea.recurrencia.tipo === "mensual"
                                        ? "Mensualmente"
                                        : tarea.recurrencia.tipo === "anual"
                                          ? "Anualmente"
                                          : ""
                                  : "Recurrente"}
                              </div>
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 theme-task-button">
                              <span className="sr-only">Abrir menú</span>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
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
                            <DropdownMenuItem onClick={() => onEditarTarea(tarea)} className="theme-dropdown-item">
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
