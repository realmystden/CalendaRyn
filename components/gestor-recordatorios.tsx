"use client"
import { X, Bell, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { formatearFecha } from "@/lib/utilidades-fecha"
import type { Tarea } from "@/components/calendario"

interface GestorRecordatoriosProps {
  tareas: Tarea[]
  onActualizarTareas: (tareas: Tarea[]) => void
  onClose: () => void
}

export function GestorRecordatorios({ tareas, onActualizarTareas, onClose }: GestorRecordatoriosProps) {
  // Filtrar tareas que tienen recordatorios
  const tareasConRecordatorios = tareas.filter((tarea) => tarea.recordatorios && tarea.recordatorios.length > 0)

  const eliminarRecordatorio = (tareaId: string, recordatorioId: string) => {
    const nuevasTareas = tareas.map((tarea) => {
      if (tarea.id === tareaId) {
        return {
          ...tarea,
          recordatorios: tarea.recordatorios.filter((r) => r.id !== recordatorioId),
        }
      }
      return tarea
    })

    onActualizarTareas(nuevasTareas)
  }

  const resetearRecordatoriosEnviados = (tareaId: string) => {
    const nuevasTareas = tareas.map((tarea) => {
      if (tarea.id === tareaId) {
        return {
          ...tarea,
          recordatorios: tarea.recordatorios.map((r) => ({
            ...r,
            enviado: false,
          })),
        }
      }
      return tarea
    })

    onActualizarTareas(nuevasTareas)
  }

  const formatearTiempoRecordatorio = (minutos: number) => {
    if (minutos === 5) return "5 minutos antes"
    if (minutos === 15) return "15 minutos antes"
    if (minutos === 30) return "30 minutos antes"
    if (minutos === 60) return "1 hora antes"
    if (minutos === 120) return "2 horas antes"
    if (minutos === 1440) return "1 día antes"
    return `${minutos} minutos antes`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 theme-modal-backdrop">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 theme-modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold theme-modal-title">Gestionar Recordatorios</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="theme-close-button">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {tareasConRecordatorios.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hay recordatorios configurados</p>
          ) : (
            tareasConRecordatorios.map((tarea) => (
              <div key={tarea.id} className="p-3 rounded-md theme-task">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{tarea.titulo}</h3>
                    <p className="text-sm theme-task-time">
                      {formatearFecha(tarea.fecha, "corta")} - {tarea.horaInicio}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => resetearRecordatoriosEnviados(tarea.id)}
                    className="text-xs h-7"
                  >
                    Resetear
                  </Button>
                </div>

                <div className="space-y-1 mt-3">
                  <Label className="text-xs theme-label">Recordatorios:</Label>
                  {tarea.recordatorios.map((recordatorio) => (
                    <div key={recordatorio.id} className="flex items-center justify-between theme-reminder">
                      <div className="flex items-center">
                        <Bell className="h-3.5 w-3.5 mr-1.5 theme-reminder-icon" />
                        <span className="text-sm">{formatearTiempoRecordatorio(recordatorio.tiempo)}</span>
                        {recordatorio.enviado && (
                          <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">Enviado</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={() => eliminarRecordatorio(tarea.id, recordatorio.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          <div className="mt-4 pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">Información sobre recordatorios</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Los recordatorios se mostrarán como notificaciones del navegador</li>
              <li>• Es necesario aceptar los permisos de notificación</li>
              <li>• Los recordatorios solo funcionan cuando la aplicación está abierta</li>
              <li>• Usa "Resetear" para volver a recibir recordatorios ya enviados</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="theme-button-primary">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
