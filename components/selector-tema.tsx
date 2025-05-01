"use client"

import { useContext } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ContextoTema } from "@/components/proveedor-tema"
import { TEMAS } from "@/lib/utilidades-tema"

export function SelectorTema() {
  const { tema, cambiarTema } = useContext(ContextoTema)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="theme-button">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-dropdown">
        <DropdownMenuLabel>Tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={tema} onValueChange={cambiarTema}>
          {Object.keys(TEMAS).map((nombreTema) => (
            <DropdownMenuRadioItem key={nombreTema} value={nombreTema} className="theme-dropdown-item">
              {TEMAS[nombreTema].nombre}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
