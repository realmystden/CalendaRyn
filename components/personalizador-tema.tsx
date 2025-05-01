"use client"

import { useState, useContext } from "react"
import { Check, RefreshCw, Paintbrush } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContextoTema } from "@/components/proveedor-tema"
import { COLORES_PREDEFINIDOS } from "@/lib/utilidades-tema"

export function PersonalizadorTema() {
  const {
    tema,
    coloresPersonalizados,
    cambiarColoresPersonalizados,
    resetearColores,
    usandoColoresPersonalizados,
    toggleColoresPersonalizados,
  } = useContext(ContextoTema)

  const [coloresTemp, setColoresTemp] = useState(
    coloresPersonalizados[tema] || { primary: "", secondary: "", accent: "" },
  )
  const [tabActiva, setTabActiva] = useState<string>("predefinidos")

  const handleColorChange = (tipo: "primary" | "secondary" | "accent", valor: string) => {
    setColoresTemp({
      ...coloresTemp,
      [tipo]: valor,
    })
  }

  const aplicarColores = () => {
    cambiarColoresPersonalizados(tema, coloresTemp)
    if (!usandoColoresPersonalizados[tema]) {
      toggleColoresPersonalizados(tema, true)
    }
  }

  const seleccionarColorPredefinido = (colores: {
    primary: string
    secondary: string
    accent: string
    nombre: string
  }) => {
    setColoresTemp(colores)
    cambiarColoresPersonalizados(tema, colores)
    if (!usandoColoresPersonalizados[tema]) {
      toggleColoresPersonalizados(tema, true)
    }
  }

  const coloresPredefinidosTema = COLORES_PREDEFINIDOS[tema as keyof typeof COLORES_PREDEFINIDOS] || []

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="theme-button ml-2">
          <Paintbrush className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Personalizar colores</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 theme-dropdown">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Personalizar tema{" "}
              {tema === "minimalist"
                ? "Minimalista"
                : tema === "futurista"
                  ? "Futurista"
                  : tema === "frutigerAero"
                    ? "Frutiger Aero"
                    : "Y2K"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => resetearColores(tema)}
              title="Restablecer colores por defecto"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="usar-colores-personalizados"
              checked={usandoColoresPersonalizados[tema]}
              onCheckedChange={(checked) => toggleColoresPersonalizados(tema, checked)}
              className="data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-800"
              thumbClassName="bg-white"
            />
            <Label htmlFor="usar-colores-personalizados">Usar colores personalizados</Label>
          </div>

          {usandoColoresPersonalizados[tema] && (
            <Tabs value={tabActiva} onValueChange={setTabActiva}>
              <TabsList className="w-full">
                <TabsTrigger value="predefinidos" className="flex-1">
                  Predefinidos
                </TabsTrigger>
                <TabsTrigger value="personalizado" className="flex-1">
                  Personalizado
                </TabsTrigger>
              </TabsList>

              <TabsContent value="predefinidos" className="pt-4">
                <div className="grid grid-cols-1 gap-3">
                  {coloresPredefinidosTema.map((color, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="justify-start h-auto py-2 px-3"
                      onClick={() => seleccionarColorPredefinido(color)}
                    >
                      <div className="flex items-center w-full">
                        <div className="flex space-x-2 flex-1">
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color.primary }}></div>
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color.secondary }}></div>
                        </div>
                        <span>{color.nombre}</span>
                        {coloresPersonalizados[tema]?.primary === color.primary && <Check className="h-4 w-4 ml-2" />}
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="personalizado" className="pt-4 space-y-4">
                <div>
                  <Label htmlFor="colorPrimario" className="theme-label">
                    Color primario
                  </Label>
                  <div className="flex items-center mt-1.5 space-x-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: coloresTemp.primary }}></div>
                    <Input
                      id="colorPrimario"
                      type="text"
                      value={coloresTemp.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="theme-input"
                    />
                    <Input
                      type="color"
                      value={coloresTemp.primary}
                      onChange={(e) => handleColorChange("primary", e.target.value)}
                      className="w-10 p-0 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="colorSecundario" className="theme-label">
                    Color secundario
                  </Label>
                  <div className="flex items-center mt-1.5 space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: coloresTemp.secondary }}
                    ></div>
                    <Input
                      id="colorSecundario"
                      type="text"
                      value={coloresTemp.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="theme-input"
                    />
                    <Input
                      type="color"
                      value={coloresTemp.secondary}
                      onChange={(e) => handleColorChange("secondary", e.target.value)}
                      className="w-10 p-0 h-8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="colorAcento" className="theme-label">
                    Color de acento
                  </Label>
                  <div className="flex items-center mt-1.5 space-x-2">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: coloresTemp.accent }}></div>
                    <Input
                      id="colorAcento"
                      type="text"
                      value={coloresTemp.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="theme-input"
                    />
                    <Input
                      type="color"
                      value={coloresTemp.accent}
                      onChange={(e) => handleColorChange("accent", e.target.value)}
                      className="w-10 p-0 h-8"
                    />
                  </div>
                </div>

                <Button onClick={aplicarColores} className="w-full theme-button-primary">
                  Aplicar colores
                </Button>
              </TabsContent>
            </Tabs>
          )}

          <div className="text-xs text-gray-500 pt-2 border-t">
            <p>Los colores se guardarán automáticamente para futuras sesiones.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
