"use client"

import { useState } from "react"
import type { Tarea } from "@/components/calendario"
import { obtenerDiasEnMes, obtenerPrimerDiaSemana, obtenerNombreMes } from "@/lib/utilidades-fecha"
import { TareaItem } from "@/components/tarea-item"

const DIAS_SEMANA = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

interface VistaCalendarioProps {
  año: number
  mes: number
  tareas: Tarea[]
}

export function VistaCalendario({ año, mes, tareas }: VistaCalendarioProps) {
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null)

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

  // Filtrar tareas para el día seleccionado
  const tareasDiaSeleccionado = diaSeleccionado
    ? tareas.filter((tarea) => {
        const fechaTarea = new Date(tarea.fecha)
        return (
          fechaTarea.getDate() === diaSeleccionado && fechaTarea.getMonth() === mes && fechaTarea.getFullYear() === año
        )
      })
    : []

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DIAS_SEMANA.map((dia) => (
          <div key={dia} className="text-center font-medium text-sm py-2">
            {dia}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-6">
        {semanas.map((semana, semanaIndex) =>
          semana.map((dia, diaIndex) => (
            <div
              key={`${semanaIndex}-${diaIndex}`}
              className={`
                min-h-[80px] p-1 border rounded-md relative
                ${dia ? "cursor-pointer hover:bg-gray-50" : "bg-gray-100/50"}
                ${dia === diaSeleccionado ? "ring-2 ring-primary ring-offset-2" : ""}
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
                      .slice(0, 2)
                      .map((tarea) => (
                        <div
                          key={tarea.id}
                          className="text-xs truncate mb-1 p-1 rounded-sm"
                          style={{ backgroundColor: `${tarea.color}30` }}
                        >
                          {tarea.horaInicio} - {tarea.titulo}
                        </div>
                      ))}
                    {tareas.filter((tarea) => {
                      const fechaTarea = new Date(tarea.fecha)
                      return (
                        fechaTarea.getDate() === dia &&
                        fechaTarea.getMonth() === mes &&
                        fechaTarea.getFullYear() === año
                      )
                    }).length > 2 && (
                      <div className="text-xs text-gray-500">
                        +
                        {tareas.filter((tarea) => {
                          const fechaTarea = new Date(tarea.fecha)
                          return (
                            fechaTarea.getDate() === dia &&
                            fechaTarea.getMonth() === mes &&
                            fechaTarea.getFullYear() === año
                          )
                        }).length - 2}{" "}
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
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">
            Tareas para el {diaSeleccionado} de {obtenerNombreMes(mes)}
          </h3>
          {tareasDiaSeleccionado.length > 0 ? (
            <div className="space-y-2">
              {tareasDiaSeleccionado
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                .map((tarea) => (
                  <TareaItem key={tarea.id} tarea={tarea} />
                ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay tareas para este día.</p>
          )}
        </div>
      )}
    </div>
  )
}
