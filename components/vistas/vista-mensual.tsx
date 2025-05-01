"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Edit2, Trash2, Tag, Bell, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Tarea, Etiqueta } from "@/components/calendario"
import { obtenerNombreMes, obtenerDiasEnMes, obtenerPrimerDiaSemana } from "@/lib/utilidades-fecha"

interface VistaMensualProps {
  tareas: Tarea[]
  fechaActual: Date
  etiquetas?: Etiqueta[]
  onEditarTarea: (tarea: Tarea) => void
  onEliminarTarea: (tarea: Tarea) => void
}

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

export function VistaMensual({
  tareas = [],
  fechaActual,
  etiquetas = [],
  onEditarTarea,
  onEliminarTarea,
}: VistaMensualProps) {
  const [fecha, setFecha] = useState(fechaActual)
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null)

  const mes = fecha.getMonth()
  const año = fecha.getFullYear()

  const mesAnterior = () => {
    setFecha(new Date(año, mes - 1, 1))
    setDiaSeleccionado(null)
  }

  const mesSiguiente = () => {
    setFecha(new Date(año, mes + 1, 1))
    setDiaSeleccionado(null)
  }

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

  // Filtrar tareas para el día seleccionado
  const tareasDiaSeleccionado = diaSeleccionado
    ? tareas.filter((tarea) => {
        const fechaTarea = new Date(tarea.fecha)
        return (
          fechaTarea.getDate() === diaSeleccionado && fechaTarea.getMonth() === mes && fechaTarea.getFullYear() === año
        )
      })
    : []

  // Verificar si una fecha es hoy
  const esHoy = (dia: number | null) => {
    if (!dia) return false
    const hoy = new Date()
    return dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()
  }

  // Función para identificar si una tarea es recurrente
  const esRecurrente = (tarea: Tarea) => {
    return tarea.tareaOriginalId || (tarea.recurrencia && tarea.recurrencia.tipo !== "ninguna")
  }

  return (
    <div className="theme-view">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={mesAnterior} className="theme-nav-button">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-medium theme-date-header">
          {obtenerNombreMes(mes)} {año}
        </h2>
        <Button variant="outline" size="icon" onClick={mesSiguiente} className="theme-nav-button">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="text-center font-medium text-sm py-2 theme-weekday">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {semanas.slice(0, mostrarUltimaSemana ? 6 : 5).map((semana, semanaIndex) =>
          semana.map((dia, diaIndex) => (
            <div
              key={`${semanaIndex}-${diaIndex}`}
              className={`
                min-h-[100px] p-1 border rounded-md relative
                ${dia ? "cursor-pointer hover:bg-opacity-80 theme-day-hover" : "bg-gray-100/50 theme-day-disabled"}
                ${dia === diaSeleccionado ? "theme-day-selected" : "theme-day"}
                ${esHoy(dia) ? "theme-today" : ""}
              `}
              onClick={() => dia && setDiaSeleccionado(dia)}
            >
              {dia && (
                <>
                  <div className="text-sm font-medium">{dia}</div>
                  <div className="mt-1">
                    {tareas
                      .filter((tarea) => {
                        const fechaTarea = new Date(tarea.fecha)
                        return (
                          fechaTarea.getDate() === dia &&
                          fechaTarea.getMonth() === mes &&
                          fechaTarea.getFullYear() === año
                        )
                      })
                      .slice(0, 3)
                      .map((tarea) => {
                        // Verificar si la tarea tiene etiquetas o recordatorios
                        const tieneEtiquetas = tarea.etiquetas && tarea.etiquetas.length > 0
                        const tieneRecordatorios = tarea.recordatorios && tarea.recordatorios.length > 0
                        const tareaRecurrente = esRecurrente(tarea)

                        return (
                          <div
                            key={tarea.id}
                            className="text-xs truncate mb-1 p-1 rounded-sm theme-task-preview"
                            style={{ backgroundColor: `${tarea.color}30` }}
                          >
                            <div className="flex items-center">
                              <span className="truncate flex-1">
                                {tarea.horaInicio} - {tarea.titulo}
                              </span>
                              <div className="flex items-center space-x-1 ml-1">
                                {tareaRecurrente && <RotateCw className="h-2.5 w-2.5" />}
                                {tieneEtiquetas && <Tag className="h-2.5 w-2.5" />}
                                {tieneRecordatorios && <Bell className="h-2.5 w-2.5" />}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    {tareas.filter((tarea) => {
                      const fechaTarea = new Date(tarea.fecha)
                      return (
                        fechaTarea.getDate() === dia &&
                        fechaTarea.getMonth() === mes &&
                        fechaTarea.getFullYear() === año
                      )
                    }).length > 3 && (
                      <div className="text-xs theme-more-tasks">
                        +
                        {tareas.filter((tarea) => {
                          const fechaTarea = new Date(tarea.fecha)
                          return (
                            fechaTarea.getDate() === dia &&
                            fechaTarea.getMonth() === mes &&
                            fechaTarea.getFullYear() === año
                          )
                        }).length - 3}{" "}
                        más
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )),
        )}
      </div>

      {diaSeleccionado && (
        <div className="mt-4 theme-selected-day">
          <h3 className="text-lg font-medium mb-2 theme-selected-day-header">
            Tareas para el {diaSeleccionado} de {obtenerNombreMes(mes)}
          </h3>
          {tareasDiaSeleccionado.length > 0 ? (
            <div className="space-y-2">
              {tareasDiaSeleccionado
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                .map((tarea) => (
                  <div
                    key={tarea.id}
                    className="p-3 rounded-md shadow-sm border theme-task"
                    style={{ borderLeftColor: tarea.color, borderLeftWidth: "4px" }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{tarea.titulo}</h4>
                        <div className="text-sm theme-task-time">
                          {tarea.horaInicio} - {tarea.horaFin}
                        </div>
                        {tarea.descripcion && (
                          <p className="text-sm mt-1 theme-task-description">{tarea.descripcion}</p>
                        )}

                        {/* Etiquetas */}
                        {tarea.etiquetas && tarea.etiquetas.length > 0 && (
                          <div className="flex flex-wrap mt-2">
                            {tarea.etiquetas.map((etiquetaId) => {
                              const etiqueta = etiquetas.find((e) => e.id === etiquetaId)
                              if (!etiqueta) return null

                              return (
                                <div
                                  key={etiqueta.id}
                                  className="theme-tag"
                                  style={{ backgroundColor: `${etiqueta.color}20`, color: etiqueta.color }}
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {etiqueta.nombre}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Recordatorios */}
                        {tarea.recordatorios && tarea.recordatorios.length > 0 && (
                          <div className="mt-2">
                            <div className="theme-reminder">
                              <Bell className="h-3 w-3 mr-1 theme-reminder-icon" />
                              {tarea.recordatorios.length === 1
                                ? "1 recordatorio"
                                : `${tarea.recordatorios.length} recordatorios`}
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
                ))}
            </div>
          ) : (
            <p className="theme-no-tasks">No hay tareas para este día.</p>
          )}
        </div>
      )}
    </div>
  )
}
