"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Plus, Bell, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TareaRecurrente, type ConfiguracionRecurrencia } from "@/components/tarea-recurrente"
import type { Tarea, Etiqueta, Recordatorio } from "@/components/calendario"

interface ModalTareaProps {
  abierto: boolean
  onClose: () => void
  onGuardar: (tarea: Tarea) => void
  fechaSeleccionada: Date
  tareaEditar?: Tarea | null
  etiquetas?: Etiqueta[]
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

const TIEMPOS_RECORDATORIO = [
  { valor: 5, etiqueta: "5 minutos antes" },
  { valor: 15, etiqueta: "15 minutos antes" },
  { valor: 30, etiqueta: "30 minutos antes" },
  { valor: 60, etiqueta: "1 hora antes" },
  { valor: 120, etiqueta: "2 horas antes" },
  { valor: 1440, etiqueta: "1 día antes" },
]

export function ModalTarea({
  abierto,
  onClose,
  onGuardar,
  fechaSeleccionada,
  tareaEditar,
  etiquetas = [],
}: ModalTareaProps) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fecha, setFecha] = useState(fechaSeleccionada.toISOString().split("T")[0])
  const [horaInicio, setHoraInicio] = useState("09:00")
  const [horaFin, setHoraFin] = useState("10:00")
  const [colorSeleccionado, setColorSeleccionado] = useState(COLORES[0])
  const [id, setId] = useState("")
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<string[]>([])
  const [recordatorios, setRecordatorios] = useState<Recordatorio[]>([])
  const [configuracionRecurrencia, setConfiguracionRecurrencia] = useState<ConfiguracionRecurrencia>({
    tipo: "ninguna",
    intervalo: 1,
    diasSemana: [new Date().getDay()],
    finalizacion: { tipo: "nunca" },
  })
  const [fechaObj, setFechaObj] = useState<Date>(new Date(fecha))

  // Si hay una tarea para editar, cargar sus datos
  useEffect(() => {
    if (tareaEditar) {
      setTitulo(tareaEditar.titulo)
      setDescripcion(tareaEditar.descripcion)
      setFecha(tareaEditar.fecha.toISOString().split("T")[0])
      setFechaObj(new Date(tareaEditar.fecha))
      setHoraInicio(tareaEditar.horaInicio)
      setHoraFin(tareaEditar.horaFin)
      setColorSeleccionado(tareaEditar.color)
      setId(tareaEditar.id)
      setEtiquetasSeleccionadas(tareaEditar.etiquetas || [])
      setRecordatorios(tareaEditar.recordatorios || [])

      // Si la tarea tiene configuración de recurrencia
      if (tareaEditar.recurrencia) {
        setConfiguracionRecurrencia(tareaEditar.recurrencia)
      } else {
        setConfiguracionRecurrencia({
          tipo: "ninguna",
          intervalo: 1,
          diasSemana: [tareaEditar.fecha.getDay()],
          finalizacion: { tipo: "nunca" },
        })
      }
    } else {
      // Valores por defecto para nueva tarea
      setTitulo("")
      setDescripcion("")
      setFecha(fechaSeleccionada.toISOString().split("T")[0])
      setFechaObj(new Date(fechaSeleccionada))
      setHoraInicio("09:00")
      setHoraFin("10:00")
      setColorSeleccionado(COLORES[0])
      setId("")
      setEtiquetasSeleccionadas([])
      setRecordatorios([])
      setConfiguracionRecurrencia({
        tipo: "ninguna",
        intervalo: 1,
        diasSemana: [fechaSeleccionada.getDay()],
        finalizacion: { tipo: "nunca" },
      })
    }
  }, [tareaEditar, fechaSeleccionada])

  // Actualizar fechaObj cuando cambia la fecha
  useEffect(() => {
    setFechaObj(new Date(fecha))
  }, [fecha])

  if (!abierto) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim()) return

    const nuevaTarea: Tarea = {
      id: id || Date.now().toString(),
      titulo,
      descripcion,
      fecha: new Date(fecha),
      horaInicio,
      horaFin,
      color: colorSeleccionado,
      etiquetas: etiquetasSeleccionadas,
      recordatorios,
      recurrencia: configuracionRecurrencia.tipo !== "ninguna" ? configuracionRecurrencia : undefined,
      tareaOriginalId: tareaEditar?.tareaOriginalId,
    }

    onGuardar(nuevaTarea)
  }

  const toggleEtiqueta = (etiquetaId: string) => {
    if (etiquetasSeleccionadas.includes(etiquetaId)) {
      setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter((id) => id !== etiquetaId))
    } else {
      setEtiquetasSeleccionadas([...etiquetasSeleccionadas, etiquetaId])
    }
  }

  const agregarRecordatorio = (tiempo: number) => {
    // Verificar si ya existe un recordatorio con este tiempo
    if (recordatorios.some((r) => r.tiempo === tiempo)) return

    const nuevoRecordatorio: Recordatorio = {
      id: Date.now().toString(),
      tareaId: id || Date.now().toString(),
      tiempo,
      enviado: false,
    }

    setRecordatorios([...recordatorios, nuevoRecordatorio])
  }

  const eliminarRecordatorio = (recordatorioId: string) => {
    setRecordatorios(recordatorios.filter((r) => r.id !== recordatorioId))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 theme-modal-backdrop">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 theme-modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold theme-modal-title">{tareaEditar ? "Editar Tarea" : "Nueva Tarea"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="theme-close-button">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo" className="theme-label">
                Título
              </Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la tarea"
                required
                className="theme-input"
              />
            </div>

            <div>
              <Label htmlFor="descripcion" className="theme-label">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción de la tarea"
                rows={3}
                className="theme-textarea"
              />
            </div>

            <div>
              <Label htmlFor="fecha" className="theme-label">
                Fecha
              </Label>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="theme-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horaInicio" className="theme-label">
                  Hora de inicio
                </Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  required
                  className="theme-input"
                />
              </div>

              <div>
                <Label htmlFor="horaFin" className="theme-label">
                  Hora de fin
                </Label>
                <Input
                  id="horaFin"
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  required
                  className="theme-input"
                />
              </div>
            </div>

            <div>
              <Label className="theme-label">Color</Label>
              <div className="flex gap-2 mt-2">
                {COLORES.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-6 h-6 rounded-full ${
                      color === colorSeleccionado ? "ring-2 ring-offset-2 theme-color-selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setColorSeleccionado(color)}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="theme-label">Etiquetas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {etiquetas && etiquetas.length > 0 ? (
                  etiquetas.map((etiqueta) => (
                    <div
                      key={etiqueta.id}
                      className={`theme-tag cursor-pointer ${
                        etiquetasSeleccionadas.includes(etiqueta.id) ? "ring-1 ring-offset-1" : "opacity-70"
                      }`}
                      style={{ backgroundColor: `${etiqueta.color}20`, color: etiqueta.color }}
                      onClick={() => toggleEtiqueta(etiqueta.id)}
                    >
                      {etiqueta.nombre}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No hay etiquetas disponibles</p>
                )}
              </div>
            </div>

            {/* Componente de recurrencia */}
            <TareaRecurrente
              configuracion={configuracionRecurrencia}
              onChange={setConfiguracionRecurrencia}
              fechaInicial={fechaObj}
            />

            {configuracionRecurrencia.tipo !== "ninguna" && (
              <div className="text-xs text-gray-500 italic mt-1 p-2 bg-gray-50 rounded-md border">
                <div className="flex items-center mb-1">
                  <RotateCw className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  <span className="font-medium">Información de recurrencia:</span>
                </div>
                <p>Esta tarea se repetirá según la configuración seleccionada.</p>
                {configuracionRecurrencia.tipo === "mensual" && fechaObj.getDate() > 28 && (
                  <p className="mt-1">
                    Para meses con menos días que el actual, la tarea aparecerá en el último día del mes.
                  </p>
                )}
                {configuracionRecurrencia.tipo === "anual" &&
                  fechaObj.getMonth() === 1 &&
                  fechaObj.getDate() === 29 && (
                    <p className="mt-1">En años no bisiestos, la tarea aparecerá el 28 de febrero.</p>
                  )}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center">
                <Label className="theme-label">Recordatorios</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Añadir
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="space-y-1">
                      {TIEMPOS_RECORDATORIO.map((tiempo) => (
                        <Button
                          key={tiempo.valor}
                          variant="ghost"
                          className="w-full justify-start text-sm"
                          onClick={() => agregarRecordatorio(tiempo.valor)}
                        >
                          {tiempo.etiqueta}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 mt-2">
                {recordatorios.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No hay recordatorios configurados</p>
                ) : (
                  recordatorios.map((recordatorio) => (
                    <div key={recordatorio.id} className="flex items-center justify-between theme-reminder">
                      <div className="flex items-center">
                        <Bell className="h-3.5 w-3.5 mr-1.5 theme-reminder-icon" />
                        <span>
                          {TIEMPOS_RECORDATORIO.find((t) => t.valor === recordatorio.tiempo)?.etiqueta ||
                            `${recordatorio.tiempo} minutos antes`}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => eliminarRecordatorio(recordatorio.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="theme-button-secondary">
                Cancelar
              </Button>
              <Button type="submit" className="theme-button-primary">
                {tareaEditar ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
