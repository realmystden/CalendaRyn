"use client"

import { Bell, Tag, RotateCw } from "lucide-react"
import type { Tarea, Etiqueta } from "@/components/calendario"

interface TareaItemProps {
  tarea: Tarea
  etiquetas?: Etiqueta[]
  onEditar?: (tarea: Tarea) => void
  onEliminar?: (id: string) => void
}

export function TareaItem({ tarea, etiquetas = [], onEditar, onEliminar }: TareaItemProps) {
  // Filtrar etiquetas que pertenecen a esta tarea
  const etiquetasTarea = etiquetas.filter((etiqueta) => tarea.etiquetas && tarea.etiquetas.includes(etiqueta.id))

  // Verificar si la tarea tiene recordatorios
  const tieneRecordatorios = tarea.recordatorios && tarea.recordatorios.length > 0

  // Verificar si la tarea es recurrente
  const esRecurrente = (tarea.recurrencia && tarea.recurrencia.tipo !== "ninguna") || tarea.tareaOriginalId

  // Obtener texto descriptivo de la recurrencia
  const obtenerTextoRecurrencia = () => {
    if (!tarea.recurrencia && !tarea.tareaOriginalId) return ""

    // Si es una instancia de tarea recurrente
    if (tarea.tareaOriginalId) return "Recurrente"

    const { tipo, intervalo } = tarea.recurrencia!

    switch (tipo) {
      case "diaria":
        return intervalo === 1 ? "Diariamente" : `Cada ${intervalo} días`
      case "semanal":
        return intervalo === 1 ? "Semanalmente" : `Cada ${intervalo} semanas`
      case "mensual":
        return intervalo === 1 ? "Mensualmente" : `Cada ${intervalo} meses`
      case "anual":
        return intervalo === 1 ? "Anualmente" : `Cada ${intervalo} años`
      default:
        return ""
    }
  }

  const textoRecurrencia = obtenerTextoRecurrencia()

  return (
    <div
      className="p-3 rounded-md shadow-sm border theme-task"
      style={{ borderLeftColor: tarea.color, borderLeftWidth: "4px" }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{tarea.titulo}</h4>
          <div className="text-sm theme-task-time">
            {tarea.horaInicio} - {tarea.horaFin}
          </div>
          {tarea.descripcion && <p className="text-sm mt-1 theme-task-description">{tarea.descripcion}</p>}

          {/* Etiquetas */}
          <div className="flex flex-wrap mt-2">
            {/* Icono de recurrencia si aplica */}
            {esRecurrente && (
              <div
                className="theme-recurrence mr-1"
                style={{ backgroundColor: `${tarea.color}20`, color: tarea.color }}
              >
                <RotateCw className="h-3 w-3 mr-1" />
                {textoRecurrencia}
              </div>
            )}

            {/* Etiquetas normales */}
            {etiquetasTarea.length > 0 &&
              etiquetasTarea.map((etiqueta) => (
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

          {/* Recordatorios */}
          {tieneRecordatorios && (
            <div className="mt-2">
              <div className="theme-reminder">
                <Bell className="h-3 w-3 mr-1 theme-reminder-icon" />
                {tarea.recordatorios.length === 1 ? "1 recordatorio" : `${tarea.recordatorios.length} recordatorios`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
