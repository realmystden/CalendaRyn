"use client"

import { useState } from "react"
import { RotateCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TipoRecurrencia = "ninguna" | "diaria" | "semanal" | "mensual" | "anual"

export type TipoRecurrenciaMensual = "diaMes" | "posicionDia"

export interface ConfiguracionRecurrencia {
  tipo: TipoRecurrencia
  intervalo: number
  diasSemana?: number[] // 0 = domingo, 1 = lunes, etc.
  tipoMensual?: TipoRecurrenciaMensual // diaMes (ej: día 15) o posicionDia (ej: segundo lunes)
  posicionDia?: number // 1 = primer, 2 = segundo, 3 = tercero, 4 = cuarto, 5 = último
  diaSemana?: number // 0 = domingo, 1 = lunes, etc. (para tipoMensual = posicionDia)
  finalizacion?: {
    tipo: "nunca" | "despues" | "fecha"
    ocurrencias?: number
    fecha?: Date
  }
}

interface TareaRecurrenteProps {
  configuracion: ConfiguracionRecurrencia
  onChange: (config: ConfiguracionRecurrencia) => void
  fechaInicial: Date
}

export function TareaRecurrente({ configuracion, onChange, fechaInicial }: TareaRecurrenteProps) {
  const [abierto, setAbierto] = useState(false)
  const [tabActiva, setTabActiva] = useState<string>("basico")

  const handleTipoChange = (tipo: TipoRecurrencia) => {
    const nuevaConfig = { ...configuracion, tipo }

    // Establecer valores por defecto según el tipo
    if (tipo === "semanal" && !nuevaConfig.diasSemana) {
      nuevaConfig.diasSemana = [fechaInicial.getDay()]
    } else if (tipo === "mensual") {
      nuevaConfig.tipoMensual = "diaMes" // Por defecto, usar el día del mes

      // Si es día 29, 30 o 31, ofrecer la opción de "último día del mes"
      const diaMes = fechaInicial.getDate()
      if (diaMes >= 29) {
        setTabActiva("avanzado")
      }
    } else if (tipo === "anual") {
      // Para recurrencia anual, no necesitamos configuración adicional
      // Se usará la misma fecha (día y mes) cada año
    }

    onChange(nuevaConfig)
  }

  const handleIntervaloChange = (intervalo: string) => {
    onChange({ ...configuracion, intervalo: Number.parseInt(intervalo) })
  }

  const handleDiaSemanaToggle = (dia: number) => {
    const diasActuales = configuracion.diasSemana || []
    // Si es el único día seleccionado, no permitir deseleccionarlo
    if (diasActuales.length === 1 && diasActuales.includes(dia)) {
      return
    }

    const nuevoDias = diasActuales.includes(dia) ? diasActuales.filter((d) => d !== dia) : [...diasActuales, dia]
    onChange({ ...configuracion, diasSemana: nuevoDias })
  }

  const handleTipoMensualChange = (tipo: TipoRecurrenciaMensual) => {
    const nuevaConfig = { ...configuracion, tipoMensual: tipo }

    if (tipo === "posicionDia") {
      // Calcular la posición del día en el mes (1º, 2º, 3º, 4º o último)
      const fecha = new Date(fechaInicial)
      const diaSemana = fecha.getDay()
      const diaMes = fecha.getDate()

      // Determinar qué número de semana es en el mes
      const posicion = Math.ceil(diaMes / 7)

      // Si es la última semana del mes, marcar como "último"
      const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate()
      const esUltimo = diaMes + 7 > ultimoDiaMes

      nuevaConfig.posicionDia = esUltimo ? 5 : posicion
      nuevaConfig.diaSemana = diaSemana
    }

    onChange(nuevaConfig)
  }

  const handlePosicionDiaChange = (posicion: string) => {
    onChange({ ...configuracion, posicionDia: Number.parseInt(posicion) })
  }

  const handleDiaSemanaChange = (dia: string) => {
    onChange({ ...configuracion, diaSemana: Number.parseInt(dia) })
  }

  const handleFinalizacionTipoChange = (tipo: "nunca" | "despues" | "fecha") => {
    const finalizacion = { ...configuracion.finalizacion, tipo } || { tipo }
    onChange({ ...configuracion, finalizacion })
  }

  const handleOcurrenciasChange = (ocurrencias: string) => {
    const finalizacion = {
      ...configuracion.finalizacion,
      tipo: "despues",
      ocurrencias: Number.parseInt(ocurrencias),
    }
    onChange({ ...configuracion, finalizacion })
  }

  const handleFechaFinChange = (fecha: string) => {
    const finalizacion = {
      ...configuracion.finalizacion,
      tipo: "fecha",
      fecha: new Date(fecha),
    }
    onChange({ ...configuracion, finalizacion })
  }

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const nombresDiasSemanaCompletos = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const posicionesDia = [
    { valor: "1", etiqueta: "Primer" },
    { valor: "2", etiqueta: "Segundo" },
    { valor: "3", etiqueta: "Tercer" },
    { valor: "4", etiqueta: "Cuarto" },
    { valor: "5", etiqueta: "Último" },
  ]

  // Obtener descripción legible de la recurrencia
  const obtenerDescripcionRecurrencia = (): string => {
    if (configuracion.tipo === "ninguna") return "No se repite"

    let descripcion = ""

    switch (configuracion.tipo) {
      case "diaria":
        descripcion = configuracion.intervalo === 1 ? "Todos los días" : `Cada ${configuracion.intervalo} días`
        break
      case "semanal":
        if (configuracion.intervalo === 1) {
          if (configuracion.diasSemana && configuracion.diasSemana.length === 7) {
            descripcion = "Todos los días"
          } else if (configuracion.diasSemana && configuracion.diasSemana.length === 1) {
            descripcion = `Todos los ${nombresDiasSemanaCompletos[configuracion.diasSemana[0]]}`
          } else if (configuracion.diasSemana) {
            descripcion = `Semanalmente los ${configuracion.diasSemana
              .map((d) => nombresDiasSemanaCompletos[d])
              .join(", ")}`
          }
        } else {
          descripcion = `Cada ${configuracion.intervalo} semanas`
          if (configuracion.diasSemana && configuracion.diasSemana.length > 0) {
            descripcion += ` los ${configuracion.diasSemana.map((d) => nombresDiasSemanaCompletos[d]).join(", ")}`
          }
        }
        break
      case "mensual":
        if (configuracion.tipoMensual === "diaMes") {
          descripcion =
            configuracion.intervalo === 1
              ? `El día ${fechaInicial.getDate()} de cada mes`
              : `El día ${fechaInicial.getDate()} cada ${configuracion.intervalo} meses`
        } else if (
          configuracion.tipoMensual === "posicionDia" &&
          configuracion.posicionDia &&
          configuracion.diaSemana !== undefined
        ) {
          const posicion = posicionesDia.find((p) => p.valor === configuracion.posicionDia?.toString())?.etiqueta || ""
          const diaSemana = nombresDiasSemanaCompletos[configuracion.diaSemana]
          descripcion =
            configuracion.intervalo === 1
              ? `El ${posicion.toLowerCase()} ${diaSemana.toLowerCase()} de cada mes`
              : `El ${posicion.toLowerCase()} ${diaSemana.toLowerCase()} cada ${configuracion.intervalo} meses`
        }
        break
      case "anual":
        const mes = new Intl.DateTimeFormat("es", { month: "long" }).format(fechaInicial)
        descripcion =
          configuracion.intervalo === 1
            ? `El ${fechaInicial.getDate()} de ${mes} cada año`
            : `El ${fechaInicial.getDate()} de ${mes} cada ${configuracion.intervalo} años`
        break
    }

    return descripcion
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <RotateCw className="h-4 w-4 text-primary" />
          <Label className="theme-label">Recurrencia</Label>
        </div>
        <Popover open={abierto} onOpenChange={setAbierto}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="theme-button">
              {configuracion.tipo === "ninguna" ? (
                "No se repite"
              ) : (
                <span className="flex items-center">
                  <RotateCw className="h-3.5 w-3.5 mr-1.5" />
                  {obtenerDescripcionRecurrencia()}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-4 theme-dropdown" align="end">
            <Tabs value={tabActiva} onValueChange={setTabActiva} className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="basico" className="flex-1">
                  Básico
                </TabsTrigger>
                <TabsTrigger value="avanzado" className="flex-1">
                  Avanzado
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basico" className="space-y-4">
                <RadioGroup
                  value={configuracion.tipo}
                  onValueChange={(v) => handleTipoChange(v as TipoRecurrencia)}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ninguna" id="r-ninguna" />
                    <Label htmlFor="r-ninguna">No se repite</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="diaria" id="r-diaria" />
                    <Label htmlFor="r-diaria">Diariamente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="semanal" id="r-semanal" />
                    <Label htmlFor="r-semanal">Semanalmente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mensual" id="r-mensual" />
                    <Label htmlFor="r-mensual">Mensualmente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anual" id="r-anual" />
                    <Label htmlFor="r-anual">Anualmente</Label>
                  </div>
                </RadioGroup>

                {configuracion.tipo !== "ninguna" && (
                  <>
                    <div className="space-y-2">
                      <Label>Repetir cada:</Label>
                      <div className="flex items-center space-x-2">
                        <Select value={configuracion.intervalo.toString()} onValueChange={handleIntervaloChange}>
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="1" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span>
                          {configuracion.tipo === "diaria" && "día(s)"}
                          {configuracion.tipo === "semanal" && "semana(s)"}
                          {configuracion.tipo === "mensual" && "mes(es)"}
                          {configuracion.tipo === "anual" && "año(s)"}
                        </span>
                      </div>
                    </div>

                    {configuracion.tipo === "semanal" && (
                      <div className="space-y-2">
                        <Label>Repetir en:</Label>
                        <div className="flex flex-wrap gap-1">
                          {diasSemana.map((dia, index) => (
                            <Button
                              key={index}
                              type="button"
                              size="sm"
                              variant={configuracion.diasSemana?.includes(index) ? "default" : "outline"}
                              className={`w-10 h-10 p-0 rounded-full ${
                                configuracion.diasSemana?.includes(index) ? "theme-day-selected" : ""
                              }`}
                              onClick={() => handleDiaSemanaToggle(index)}
                            >
                              {dia}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 border-t pt-2">
                      <Label>Finaliza:</Label>
                      <RadioGroup
                        value={configuracion.finalizacion?.tipo || "nunca"}
                        onValueChange={(v) => handleFinalizacionTipoChange(v as "nunca" | "despues" | "fecha")}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="nunca" id="f-nunca" />
                          <Label htmlFor="f-nunca">Nunca</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="despues" id="f-despues" />
                          <Label htmlFor="f-despues">Después de</Label>
                          {configuracion.finalizacion?.tipo === "despues" && (
                            <Select
                              value={configuracion.finalizacion.ocurrencias?.toString() || "10"}
                              onValueChange={handleOcurrenciasChange}
                            >
                              <SelectTrigger className="w-20 ml-2">
                                <SelectValue placeholder="10" />
                              </SelectTrigger>
                              <SelectContent>
                                {[5, 10, 15, 20, 25, 30, 50, 100].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {configuracion.finalizacion?.tipo === "despues" && <span>ocurrencias</span>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="fecha" id="f-fecha" />
                          <Label htmlFor="f-fecha">En fecha</Label>
                          {configuracion.finalizacion?.tipo === "fecha" && (
                            <input
                              type="date"
                              className="ml-2 px-2 py-1 border rounded theme-input"
                              value={
                                configuracion.finalizacion.fecha
                                  ? configuracion.finalizacion.fecha.toISOString().split("T")[0]
                                  : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                              }
                              onChange={(e) => handleFechaFinChange(e.target.value)}
                            />
                          )}
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="avanzado" className="space-y-4">
                {configuracion.tipo === "mensual" && (
                  <div className="space-y-4">
                    <RadioGroup
                      value={configuracion.tipoMensual || "diaMes"}
                      onValueChange={(v) => handleTipoMensualChange(v as TipoRecurrenciaMensual)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="diaMes" id="m-diaMes" />
                        <Label htmlFor="m-diaMes">El día {fechaInicial.getDate()} de cada mes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="posicionDia" id="m-posicionDia" />
                        <Label htmlFor="m-posicionDia">El</Label>
                        {configuracion.tipoMensual === "posicionDia" && (
                          <>
                            <Select
                              value={configuracion.posicionDia?.toString() || "1"}
                              onValueChange={handlePosicionDiaChange}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue placeholder="Primer" />
                              </SelectTrigger>
                              <SelectContent>
                                {posicionesDia.map((pos) => (
                                  <SelectItem key={pos.valor} value={pos.valor}>
                                    {pos.etiqueta}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={configuracion.diaSemana?.toString() || "1"}
                              onValueChange={handleDiaSemanaChange}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Lunes" />
                              </SelectTrigger>
                              <SelectContent>
                                {nombresDiasSemanaCompletos.map((dia, index) => (
                                  <SelectItem key={index} value={index.toString()}>
                                    {dia}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>del mes</span>
                          </>
                        )}
                      </div>
                    </RadioGroup>

                    <div className="text-sm text-gray-500 italic">
                      {configuracion.tipoMensual === "diaMes" && fechaInicial.getDate() > 28 && (
                        <p>Nota: Para meses con menos días, la tarea aparecerá en el último día del mes.</p>
                      )}
                    </div>
                  </div>
                )}

                {configuracion.tipo === "anual" && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      La tarea se repetirá el {fechaInicial.getDate()} de{" "}
                      {new Intl.DateTimeFormat("es", { month: "long" }).format(fechaInicial)} cada año.
                    </p>

                    {fechaInicial.getMonth() === 1 && fechaInicial.getDate() === 29 && (
                      <p className="text-sm text-gray-500 italic">
                        Nota: En años no bisiestos, la tarea aparecerá el 28 de febrero.
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setAbierto(false)} className="theme-button-primary" size="sm">
                <Check className="h-4 w-4 mr-1" />
                Aplicar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
