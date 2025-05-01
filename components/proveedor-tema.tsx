"use client"

import type React from "react"

import { createContext, useState, useEffect } from "react"
import { TEMAS, type TipoTema, actualizarVariablesCSS, obtenerColoresPorDefecto } from "@/lib/utilidades-tema"

interface ContextoTemaProps {
  tema: string
  cambiarTema: (tema: string) => void
  estilosTema: TipoTema
  coloresPersonalizados: Record<string, { primary: string; secondary: string; accent: string }>
  cambiarColoresPersonalizados: (tema: string, colores: { primary: string; secondary: string; accent: string }) => void
  resetearColores: (tema: string) => void
  usandoColoresPersonalizados: Record<string, boolean>
  toggleColoresPersonalizados: (tema: string, usar: boolean) => void
}

export const ContextoTema = createContext<ContextoTemaProps>({
  tema: "minimalist",
  cambiarTema: () => {},
  estilosTema: TEMAS.minimalist,
  coloresPersonalizados: {},
  cambiarColoresPersonalizados: () => {},
  resetearColores: () => {},
  usandoColoresPersonalizados: {},
  toggleColoresPersonalizados: () => {},
})

export function ProveedorTema({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState("minimalist")
  const [estilosTema, setEstilosTema] = useState<TipoTema>(TEMAS.minimalist)
  const [coloresPersonalizados, setColoresPersonalizados] = useState<
    Record<string, { primary: string; secondary: string; accent: string }>
  >({
    minimalist: { primary: "#000000", secondary: "#333333", accent: "#ffffff" },
    futurista: { ...obtenerColoresPorDefecto("futurista") },
    frutigerAero: { ...obtenerColoresPorDefecto("frutigerAero") },
    y2k: { ...obtenerColoresPorDefecto("y2k") },
  })
  const [usandoColoresPersonalizados, setUsandoColoresPersonalizados] = useState<Record<string, boolean>>({
    minimalist: false,
    futurista: false,
    frutigerAero: false,
    y2k: false,
  })

  // Cargar tema y colores personalizados del localStorage si existen
  useEffect(() => {
    const temaGuardado = localStorage.getItem("calendaRyn-tema")
    const coloresGuardados = localStorage.getItem("calendaRyn-colores-personalizados")
    const usandoColoresGuardados = localStorage.getItem("calendaRyn-usando-colores-personalizados")

    if (temaGuardado && TEMAS[temaGuardado]) {
      setTema(temaGuardado)
      setEstilosTema(TEMAS[temaGuardado])
      document.documentElement.style.setProperty("--font-family", TEMAS[temaGuardado].fontFamily)
    } else {
      setTema("minimalist")
      setEstilosTema(TEMAS.minimalist)
      document.documentElement.style.setProperty("--font-family", TEMAS.minimalist.fontFamily)
    }

    // Cargar colores personalizados si existen
    if (coloresGuardados) {
      try {
        const colores = JSON.parse(coloresGuardados)
        setColoresPersonalizados({
          ...coloresPersonalizados,
          ...colores,
        })
      } catch (error) {
        console.error("Error al cargar colores personalizados:", error)
      }
    }

    // Cargar configuración de uso de colores personalizados
    if (usandoColoresGuardados) {
      try {
        const usando = JSON.parse(usandoColoresGuardados)
        setUsandoColoresPersonalizados({
          ...usandoColoresPersonalizados,
          ...usando,
        })
      } catch (error) {
        console.error("Error al cargar configuración de colores personalizados:", error)
      }
    }

    // Aplicar colores según la configuración
    aplicarColoresSegunConfiguracion(
      temaGuardado || "minimalist",
      coloresGuardados ? JSON.parse(coloresGuardados) : coloresPersonalizados,
      usandoColoresGuardados ? JSON.parse(usandoColoresGuardados) : usandoColoresPersonalizados,
    )
  }, [])

  // Función para aplicar colores según la configuración
  const aplicarColoresSegunConfiguracion = (
    temaActual: string,
    colores: Record<string, { primary: string; secondary: string; accent: string }>,
    usando: Record<string, boolean>,
  ) => {
    if (usando[temaActual]) {
      // Usar colores personalizados
      const cssVarsActualizadas = actualizarVariablesCSS(temaActual, colores[temaActual])
      Object.entries(cssVarsActualizadas).forEach(([variable, valor]) => {
        document.documentElement.style.setProperty(`--${variable}`, valor)
      })
    } else {
      // Usar colores por defecto
      Object.entries(TEMAS[temaActual].cssVars || {}).forEach(([variable, valor]) => {
        document.documentElement.style.setProperty(`--${variable}`, valor)
      })
    }
  }

  const cambiarTema = (nuevoTema: string) => {
    if (TEMAS[nuevoTema]) {
      setTema(nuevoTema)
      setEstilosTema(TEMAS[nuevoTema])
      localStorage.setItem("calendaRyn-tema", nuevoTema)

      // Aplicar fuente
      document.documentElement.style.setProperty("--font-family", TEMAS[nuevoTema].fontFamily)

      // Aplicar colores según la configuración
      aplicarColoresSegunConfiguracion(nuevoTema, coloresPersonalizados, usandoColoresPersonalizados)

      // Cargar fuente si es necesario
      if (TEMAS[nuevoTema].fontUrl) {
        // Verificar si ya existe
        const existingLink = document.querySelector(`link[href="${TEMAS[nuevoTema].fontUrl}"]`)
        if (!existingLink) {
          const fontLink = document.createElement("link")
          fontLink.href = TEMAS[nuevoTema].fontUrl
          fontLink.rel = "stylesheet"
          document.head.appendChild(fontLink)
        }
      }
    }
  }

  const cambiarColoresPersonalizados = (
    temaNombre: string,
    colores: { primary: string; secondary: string; accent: string },
  ) => {
    const nuevosColores = {
      ...coloresPersonalizados,
      [temaNombre]: colores,
    }

    setColoresPersonalizados(nuevosColores)
    localStorage.setItem("calendaRyn-colores-personalizados", JSON.stringify(nuevosColores))

    // Si estamos usando colores personalizados para este tema, aplicarlos
    if (usandoColoresPersonalizados[temaNombre]) {
      const cssVarsActualizadas = actualizarVariablesCSS(temaNombre, colores)
      Object.entries(cssVarsActualizadas).forEach(([variable, valor]) => {
        document.documentElement.style.setProperty(`--${variable}`, valor)
      })
    }
  }

  const resetearColores = (temaNombre: string) => {
    const coloresPorDefecto = obtenerColoresPorDefecto(temaNombre)
    cambiarColoresPersonalizados(temaNombre, coloresPorDefecto)
  }

  const toggleColoresPersonalizados = (temaNombre: string, usar: boolean) => {
    const nuevaConfig = {
      ...usandoColoresPersonalizados,
      [temaNombre]: usar,
    }

    setUsandoColoresPersonalizados(nuevaConfig)
    localStorage.setItem("calendaRyn-usando-colores-personalizados", JSON.stringify(nuevaConfig))

    if (usar) {
      // Aplicar colores personalizados
      const cssVarsActualizadas = actualizarVariablesCSS(temaNombre, coloresPersonalizados[temaNombre])
      Object.entries(cssVarsActualizadas).forEach(([variable, valor]) => {
        document.documentElement.style.setProperty(`--${variable}`, valor)
      })
    } else {
      // Aplicar colores por defecto
      Object.entries(TEMAS[temaNombre].cssVars || {}).forEach(([variable, valor]) => {
        document.documentElement.style.setProperty(`--${variable}`, valor)
      })
    }
  }

  return (
    <ContextoTema.Provider
      value={{
        tema,
        cambiarTema,
        estilosTema,
        coloresPersonalizados,
        cambiarColoresPersonalizados,
        resetearColores,
        usandoColoresPersonalizados,
        toggleColoresPersonalizados,
      }}
    >
      <div className={`theme-${tema}`}>{children}</div>
    </ContextoTema.Provider>
  )
}
