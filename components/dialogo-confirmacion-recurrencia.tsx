"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DialogoConfirmacionRecurrenciaProps {
  abierto: boolean
  onClose: () => void
  onConfirmarSoloEsta: () => void
  onConfirmarTodas: () => void
  titulo: string
}

export function DialogoConfirmacionRecurrencia({
  abierto,
  onClose,
  onConfirmarSoloEsta,
  onConfirmarTodas,
  titulo,
}: DialogoConfirmacionRecurrenciaProps) {
  if (!abierto) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 theme-modal-backdrop">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 theme-modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold theme-modal-title">Eliminar tarea recurrente</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="theme-close-button">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <p>
            Estás eliminando una tarea recurrente: <strong>{titulo}</strong>
          </p>
          <p>¿Deseas eliminar solo esta instancia o todas las instancias de esta tarea recurrente?</p>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="theme-button-secondary">
              Cancelar
            </Button>
            <Button type="button" onClick={onConfirmarSoloEsta} className="theme-button-primary">
              Solo esta instancia
            </Button>
            <Button type="button" onClick={onConfirmarTodas} className="bg-red-500 text-white hover:bg-red-600">
              Todas las instancias
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
