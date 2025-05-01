"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { obtenerNombreMes, obtenerDiasEnMes, obtenerPrimerDiaSemana } from "@/lib/utilidades-fecha"

interface CalendarioCompactoProps {
  fechaActual: Date
  setFechaActual: (fecha: Date) => void
}

const DIAS_SEMANA_CORTOS = ["L", "M", "X", "J", "V", "S", "D"]

export function CalendarioCompacto({ fechaActual, setFechaActual }: CalendarioCompactoProps) {
  const mes = fechaActual.getMonth()
  const año = fechaActual.getFullYear()
  const diaActual = fechaActual.getDate()

  const mesAnterior = () => {
    setFechaActual(new Date(año, mes - 1, 1))
  }

  const mesSiguiente = () => {
    setFechaActual(new Date(año, mes + 1, 1))
  }

  const seleccionarFecha = (dia: number) => {
    setFechaActual(new Date(año, mes, dia))
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

  return (
    <div className="p-3 rounded-lg theme-calendar-compact">
      <div className="flex justify-between items-center mb-3">
        <Button variant="ghost" size="icon" onClick={mesAnterior} className="theme-nav-button">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">
          {obtenerNombreMes(mes)} {año}
        </h3>
        <Button variant="ghost" size="icon" onClick={mesSiguiente} className="theme-nav-button">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {DIAS_SEMANA_CORTOS.map((dia) => (
          <div key={dia} className="text-xs font-medium py-1 theme-weekday">
            {dia}
          </div>
        ))}

        {semanas.slice(0, mostrarUltimaSemana ? 6 : 5).map((semana, semanaIndex) =>
          semana.map((dia, diaIndex) => (
            <div
              key={`${semanaIndex}-${diaIndex}`}
              className={`
                h-7 w-7 flex items-center justify-center text-xs rounded-full
                ${dia ? "cursor-pointer hover:bg-opacity-80 theme-day-hover" : ""}
                ${dia === diaActual ? "theme-day-selected" : "theme-day"}
              `}
              onClick={() => dia && seleccionarFecha(dia)}
            >
              {dia}
            </div>
          )),
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFechaActual(new Date())}
          className="text-xs theme-today-button"
        >
          Hoy
        </Button>
      </div>
    </div>
  )
}
