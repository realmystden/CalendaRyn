// Actualizar las definiciones de temas para incluir fuentes específicas y mejorar el contraste del texto
export interface TipoTema {
  nombre: string
  fontFamily: string
  fontUrl?: string
  cssVars?: Record<string, string>
  borderRadius?: string
  buttonStyle?: "rounded" | "square" | "pill" | "neon" | "glass" | "retro"
  cardStyle?: "flat" | "raised" | "neon" | "glass" | "retro" | "pixel"
  animationLevel?: "none" | "subtle" | "moderate" | "high"
  coloresPersonalizados?: {
    primary: string
    secondary: string
    accent: string
  }
}

export const TEMAS: Record<string, TipoTema> = {
  minimalist: {
    nombre: "Minimalista",
    fontFamily: "var(--font-roboto), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderRadius: "4px",
    buttonStyle: "square",
    cardStyle: "flat",
    animationLevel: "subtle",
    coloresPersonalizados: {
      primary: "#333333",
      secondary: "#666666",
      accent: "#ffffff",
    },
    cssVars: {
      primary: "#333333",
      secondary: "#666666",
      accent: "#ffffff",
      background: "#ffffff",
      "background-alt": "#f5f5f5",
      text: "#333333",
      border: "#e0e0e0",
      "header-bg": "#ffffff",
      "footer-bg": "#ffffff",
      "task-bg": "#ffffff",
      "task-hover": "#f9f9f9",
      "button-bg": "#333333",
      "button-text": "#ffffff",
      "input-bg": "#ffffff",
      "input-border": "#e0e0e0",
      "input-text": "#333333",
      shadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      "grid-line": "#eeeeee",
      "tag-bg": "#f5f5f5",
      "tag-text": "#666666",
      "reminder-bg": "#f5f5f5",
      "reminder-text": "#666666",
      "sidebar-bg": "#ffffff",
      "content-bg": "#ffffff",
      "modal-bg": "#ffffff",
      "dropdown-bg": "#ffffff",
      "primary-gradient": "linear-gradient(135deg, #333333, #555555)",
      "background-gradient": "linear-gradient(135deg, #ffffff, #f5f5f5)",
      "backdrop-blur": "0px",
    },
  },
  futurista: {
    nombre: "Futurista",
    fontFamily: "var(--font-vt323), monospace",
    borderRadius: "2px",
    buttonStyle: "retro",
    cardStyle: "pixel",
    animationLevel: "high",
    coloresPersonalizados: {
      primary: "#00b4d8",
      secondary: "#4361ee",
      accent: "#e9ff70",
    },
    cssVars: {
      primary: "#00b4d8", // Bright teal
      secondary: "#4361ee", // Changed to royal blue
      accent: "#e9ff70", // Lime accent
      background: "#03071e", // Very dark navy
      "background-alt": "#14213d",
      text: "#e5e5e5", // Light gray for text
      border: "#00b4d8", // Match primary
      "header-bg": "#03071e",
      "footer-bg": "#03071e",
      "task-bg": "#14213d",
      "task-hover": "#1b2b52",
      "button-bg": "#00b4d8", // Match primary
      "button-text": "#03071e", // Dark text on bright buttons
      "input-bg": "#14213d",
      "input-border": "#00b4d8", // Match primary
      "input-text": "#e5e5e5",
      shadow: "0 0 8px rgba(0, 180, 216, 0.8)",
      "grid-line": "rgba(0, 180, 216, 0.3)",
      "tag-bg": "rgba(67, 97, 238, 0.2)",
      "tag-text": "#4361ee", // Match secondary
      "reminder-bg": "rgba(233, 255, 112, 0.2)",
      "reminder-text": "#e9ff70", // Match accent
      "sidebar-bg": "#14213d",
      "content-bg": "#14213d",
      "modal-bg": "#14213d",
      "dropdown-bg": "#14213d",
      "primary-gradient": "linear-gradient(135deg, #00b4d8, #4361ee)",
      "background-gradient": "linear-gradient(135deg, #03071e, #14213d)",
      "backdrop-blur": "0px",
      "primary-rgb": "0, 180, 216",
      "glitch-effect": "enabled",
    },
  },
  frutigerAero: {
    nombre: "Frutiger Aero",
    fontFamily: "var(--font-nunito), 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    borderRadius: "6px",
    buttonStyle: "glass",
    cardStyle: "glass",
    animationLevel: "moderate",
    coloresPersonalizados: {
      primary: "#0078d7",
      secondary: "#5db2ff",
      accent: "#ffffff",
    },
    cssVars: {
      primary: "#0078d7",
      secondary: "#5db2ff",
      accent: "#ffffff",
      background: "#e8f2fc",
      "background-alt": "#d4e8fc",
      text: "#1a365d", // Texto más oscuro para mejor contraste
      border: "#b3d6fc",
      "header-bg": "rgba(212, 232, 252, 0.9)",
      "footer-bg": "rgba(212, 232, 252, 0.9)",
      "task-bg": "rgba(255, 255, 255, 0.85)",
      "task-hover": "#f0f7ff",
      "button-bg": "#0078d7",
      "button-text": "#ffffff",
      "input-bg": "#ffffff",
      "input-border": "#b3d6fc",
      "input-text": "#1a365d", // Texto más oscuro para mejor contraste
      shadow: "0 0 15px rgba(179, 214, 252, 0.8)",
      "grid-line": "#b3d6fc80",
      "tag-bg": "#0078d720",
      "tag-text": "#0078d7",
      "reminder-bg": "#0078d720",
      "reminder-text": "#0078d7",
      "sidebar-bg": "rgba(212, 232, 252, 0.9)",
      "content-bg": "rgba(255, 255, 255, 0.85)",
      "modal-bg": "rgba(255, 255, 255, 0.95)",
      "dropdown-bg": "rgba(255, 255, 255, 0.95)",
      "primary-gradient": "linear-gradient(135deg, #0078d7, #5db2ff)",
      "background-gradient": "linear-gradient(135deg, #e8f2fc, #d4e8fc)",
      "backdrop-blur": "10px",
      "primary-rgb": "0, 120, 215",
    },
  },
  y2k: {
    nombre: "Y2K",
    fontFamily: "var(--font-comic-sans), 'Comic Sans MS', 'Comic Sans', cursive",
    borderRadius: "20px",
    buttonStyle: "pill",
    cardStyle: "retro",
    animationLevel: "high",
    coloresPersonalizados: {
      primary: "#ff66c4",
      secondary: "#6666ff",
      accent: "#ffff00",
    },
    cssVars: {
      primary: "#ff66c4",
      secondary: "#6666ff",
      accent: "#ffff00",
      background: "#ccffff",
      "background-alt": "#ffccff",
      text: "#333333",
      border: "#ff66c4",
      "header-bg": "#ffccff",
      "footer-bg": "#ffccff",
      "task-bg": "#ffffff",
      "task-hover": "#ffe6ff",
      "button-bg": "#ff66c4",
      "button-text": "#ffffff",
      "input-bg": "#ffffff",
      "input-border": "#ff66c4",
      "input-text": "#333333",
      shadow: "0 0 10px rgba(255, 102, 196, 0.5)",
      "grid-line": "#ff66c480",
      "tag-bg": "#6666ff20",
      "tag-text": "#6666ff",
      "reminder-bg": "#ffff0020",
      "reminder-text": "#333333",
      "sidebar-bg": "#ffccff",
      "content-bg": "#ffffff",
      "modal-bg": "#ffffff",
      "dropdown-bg": "#ffffff",
      "primary-gradient": "linear-gradient(135deg, #ff66c4, #6666ff)",
      "background-gradient": "linear-gradient(135deg, #ccffff, #ffccff)",
      "backdrop-blur": "0px",
      "primary-rgb": "255, 102, 196",
    },
  },
}

// Decoraciones específicas por tema
export const DECORACIONES = {
  minimalist: {
    elementos: [],
  },
  futurista: {
    elementos: [
      { tipo: "pixel", posicion: "random", color: "var(--primary)" },
      { tipo: "pixel", posicion: "random", color: "var(--secondary)" },
      { tipo: "scanline", posicion: "full", color: "var(--grid-line)" },
    ],
  },
  frutigerAero: {
    elementos: [
      { tipo: "reflejo", posicion: "bottom", color: "var(--border)" },
      { tipo: "brillo", posicion: "top-left", color: "var(--accent)" },
    ],
  },
  y2k: {
    elementos: [
      { tipo: "estrella", posicion: "random", color: "var(--accent)" },
      { tipo: "burbuja", posicion: "random", color: "var(--primary)" },
      { tipo: "burbuja", posicion: "random", color: "var(--secondary)" },
    ],
  },
}

// Animaciones por nivel
export const ANIMACIONES = {
  none: {},
  subtle: {
    hover: "transform: scale(1.02); transition: transform 0.2s ease;",
    active: "transform: scale(0.98); transition: transform 0.1s ease;",
    transition: "transition: all 0.3s ease;",
  },
  moderate: {
    hover: "transform: scale(1.05); transition: transform 0.2s ease;",
    active: "transform: scale(0.95); transition: transform 0.1s ease;",
    transition: "transition: all 0.3s ease;",
    entrada: "animation: fadeIn 0.3s ease;",
  },
  high: {
    hover: "transform: scale(1.08); transition: transform 0.2s ease;",
    active: "transform: scale(0.92); transition: transform 0.1s ease;",
    transition: "transition: all 0.3s ease;",
    entrada: "animation: fadeIn 0.5s ease;",
    flotante: "animation: float 3s ease-in-out infinite;",
    pulso: "animation: pulse 2s ease-in-out infinite;",
  },
}

// Función para actualizar las variables CSS basadas en los colores personalizados
export function actualizarVariablesCSS(tema: string, colores: { primary: string; secondary: string; accent: string }) {
  if (!TEMAS[tema] || !TEMAS[tema].cssVars) return {}

  const cssVars = { ...TEMAS[tema].cssVars }

  // Actualizar colores principales
  cssVars.primary = colores.primary
  cssVars.secondary = colores.secondary
  cssVars.accent = colores.accent

  // Actualizar colores derivados según el tema
  switch (tema) {
    case "minimalist":
      cssVars["button-bg"] = colores.primary
      cssVars.border = colores.primary === "#000000" ? "#e0e0e0" : `${colores.primary}40`
      cssVars["grid-line"] = colores.primary === "#000000" ? "#eeeeee" : `${colores.primary}20`
      cssVars["tag-bg"] = `${colores.primary}10`
      cssVars["tag-text"] = colores.primary
      cssVars["reminder-bg"] = `${colores.secondary}10`
      cssVars["reminder-text"] = colores.secondary
      cssVars["primary-gradient"] = `linear-gradient(135deg, ${colores.primary}, ${colores.secondary})`
      break
    case "futurista":
      cssVars.border = colores.primary
      cssVars["button-bg"] = colores.primary
      cssVars["input-border"] = colores.primary
      cssVars.shadow = `0 0 8px ${colores.primary}80`
      cssVars["grid-line"] = `${colores.primary}30`
      cssVars["tag-bg"] = `${colores.secondary}20`
      cssVars["tag-text"] = colores.secondary
      cssVars["reminder-bg"] = `${colores.accent}20`
      cssVars["reminder-text"] = colores.accent
      cssVars["primary-gradient"] = `linear-gradient(135deg, ${colores.primary}, ${colores.secondary})`
      break
    case "frutigerAero":
      cssVars["button-bg"] = colores.primary
      cssVars.border = `${colores.primary}80`
      cssVars.shadow = `0 0 15px ${colores.primary}80`
      cssVars["grid-line"] = `${colores.primary}40`
      cssVars["tag-bg"] = `${colores.primary}20`
      cssVars["tag-text"] = colores.primary
      cssVars["reminder-bg"] = `${colores.primary}20`
      cssVars["reminder-text"] = colores.primary
      cssVars["primary-gradient"] = `linear-gradient(135deg, ${colores.primary}, ${colores.secondary})`
      break
    case "y2k":
      cssVars.border = colores.primary
      cssVars["button-bg"] = colores.primary
      cssVars["input-border"] = colores.primary
      cssVars.shadow = `0 0 10px ${colores.primary}50`
      cssVars["grid-line"] = `${colores.primary}80`
      cssVars["tag-bg"] = `${colores.secondary}20`
      cssVars["tag-text"] = colores.secondary
      cssVars["reminder-bg"] = `${colores.accent}20`
      cssVars["reminder-text"] = "#333333"
      cssVars["primary-gradient"] = `linear-gradient(135deg, ${colores.primary}, ${colores.secondary})`
      break
  }

  // Convertir color primario a formato RGB para sombras
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${Number.parseInt(result[1], 16)}, ${Number.parseInt(result[2], 16)}, ${Number.parseInt(result[3], 16)}`
      : null
  }

  const rgbValue = hexToRgb(colores.primary)
  if (rgbValue) {
    cssVars["primary-rgb"] = rgbValue
  }

  return cssVars
}

// Colores predefinidos para cada tema
export const COLORES_PREDEFINIDOS = {
  minimalist: [
    { nombre: "Negro", primary: "#000000", secondary: "#333333", accent: "#ffffff" },
    { nombre: "Azul", primary: "#1a73e8", secondary: "#4285f4", accent: "#ffffff" },
    { nombre: "Verde", primary: "#0f9d58", secondary: "#34a853", accent: "#ffffff" },
    { nombre: "Rojo", primary: "#d93025", secondary: "#ea4335", accent: "#ffffff" },
    { nombre: "Morado", primary: "#673ab7", secondary: "#9c27b0", accent: "#ffffff" },
  ],
  futurista: [
    { nombre: "Cian", primary: "#00b4d8", secondary: "#4361ee", accent: "#e9ff70" },
    { nombre: "Rojo", primary: "#ff0a54", secondary: "#ff477e", accent: "#7bf1a8" },
    { nombre: "Verde", primary: "#00f5d4", secondary: "#00bbf9", accent: "#fee440" },
    { nombre: "Morado", primary: "#7b2cbf", secondary: "#9d4edd", accent: "#c77dff" },
    { nombre: "Naranja", primary: "#ff9500", secondary: "#ff4d00", accent: "#00eeff" },
  ],
  frutigerAero: [
    { nombre: "Azul", primary: "#0078d7", secondary: "#5db2ff", accent: "#ffffff" },
    { nombre: "Verde", primary: "#00b294", secondary: "#4cd3c2", accent: "#ffffff" },
    { nombre: "Rojo", primary: "#e81123", secondary: "#ff4c4c", accent: "#ffffff" },
    { nombre: "Morado", primary: "#744da9", secondary: "#9a7ad2", accent: "#ffffff" },
    { nombre: "Naranja", primary: "#f7630c", secondary: "#ff9e4f", accent: "#ffffff" },
  ],
  y2k: [
    { nombre: "Rosa", primary: "#ff66c4", secondary: "#6666ff", accent: "#ffff00" },
    { nombre: "Verde", primary: "#00ff66", secondary: "#66ffff", accent: "#ff66ff" },
    { nombre: "Azul", primary: "#6666ff", secondary: "#ff66c4", accent: "#ffff00" },
    { nombre: "Naranja", primary: "#ff9933", secondary: "#ff66c4", accent: "#66ffff" },
    { nombre: "Morado", primary: "#cc66ff", secondary: "#ff66c4", accent: "#ffff00" },
  ],
}

// Función para obtener los colores por defecto de un tema
export function obtenerColoresPorDefecto(tema: string): { primary: string; secondary: string; accent: string } {
  if (!TEMAS[tema] || !TEMAS[tema].coloresPersonalizados) {
    return { primary: "#333333", secondary: "#666666", accent: "#ffffff" }
  }
  return { ...TEMAS[tema].coloresPersonalizados }
}
