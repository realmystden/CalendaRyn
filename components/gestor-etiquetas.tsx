"use client"

import type React from "react"

import { useState } from "react"
import { X, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Etiqueta } from "@/components/calendario"

interface GestorEtiquetasProps {
  etiquetas: Etiqueta[]
  onAgregar: (etiqueta: Etiqueta) => void
  onEditar: (id: string, nombre: string, color: string) => void
  onEliminar: (id: string) => void
  onClose: () => void
}

const COLORES = [
  "#f87171", // rojo
  "#fb923c", // naranja
  "#facc15", // amarillo
  "#4ade80", // verde
  "#60a5fa", // azul
  "#a78bfa", // morado
  "#f472b6", // rosa
]

export function GestorEtiquetas({ etiquetas, onAgregar, onEditar, onEliminar, onClose }: GestorEtiquetasProps) {
  const [nombre, setNombre] = useState("")
  const [color, setColor] = useState(COLORES[0])
  const [etiquetaEditando, setEtiquetaEditando] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nombre.trim()) return

    if (etiquetaEditando) {
      onEditar(etiquetaEditando, nombre, color)
      setEtiquetaEditando(null)
    } else {
      const nuevaEtiqueta: Etiqueta = {
        id: Date.now().toString(),
        nombre,
        color,
      }
      onAgregar(nuevaEtiqueta)
    }

    setNombre("")
    setColor(COLORES[0])
  }

  const iniciarEdicion = (etiqueta: Etiqueta) => {
    setNombre(etiqueta.nombre)
    setColor(etiqueta.color)
    setEtiquetaEditando(etiqueta.id)
  }

  const cancelarEdicion = () => {
    setNombre("")
    setColor(COLORES[0])
    setEtiquetaEditando(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 theme-modal-backdrop">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 theme-modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold theme-modal-title">Gestionar Etiquetas</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="theme-close-button">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre" className="theme-label">
                Nombre de la etiqueta
              </Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la etiqueta"
                required
                className="theme-input"
              />
            </div>

            <div>
              <Label className="theme-label">Color</Label>
              <div className="flex gap-2 mt-2">
                {COLORES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-6 h-6 rounded-full ${c === color ? "ring-2 ring-offset-2 theme-color-selected" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {etiquetaEditando && (
                <Button type="button" variant="outline" onClick={cancelarEdicion} className="theme-button-secondary">
                  Cancelar
                </Button>
              )}
              <Button type="submit" className="theme-button-primary">
                {etiquetaEditando ? "Actualizar" : "Añadir"} Etiqueta
              </Button>
            </div>
          </div>
        </form>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium mb-3">Etiquetas existentes</h3>

          {etiquetas.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No hay etiquetas creadas</p>
          ) : (
            <div className="space-y-2">
              {etiquetas.map((etiqueta) => (
                <div key={etiqueta.id} className="flex items-center justify-between p-2 rounded-md theme-task">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: etiqueta.color }} />
                    <span>{etiqueta.nombre}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => iniciarEdicion(etiqueta)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500"
                      onClick={() => onEliminar(etiqueta.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
