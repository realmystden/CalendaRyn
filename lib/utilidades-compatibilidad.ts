/**
 * Utilidades para manejar problemas de compatibilidad entre navegadores
 */

/**
 * Verifica si el navegador soporta notificaciones
 */
export function soportaNotificaciones(): boolean {
  return "Notification" in window
}

/**
 * Solicita permiso para mostrar notificaciones
 * @returns Promise que se resuelve con el estado del permiso
 */
export async function solicitarPermisoNotificaciones(): Promise<NotificationPermission> {
  if (!soportaNotificaciones()) {
    return "denied"
  }

  try {
    return await Notification.requestPermission()
  } catch (error) {
    console.error("Error al solicitar permiso para notificaciones:", error)
    return "denied"
  }
}

/**
 * Muestra una notificación de forma segura
 * @param titulo Título de la notificación
 * @param opciones Opciones de la notificación
 * @returns La notificación creada o null si no se pudo crear
 */
export function mostrarNotificacion(titulo: string, opciones?: NotificationOptions): Notification | null {
  if (!soportaNotificaciones() || Notification.permission !== "granted") {
    return null
  }

  try {
    return new Notification(titulo, opciones)
  } catch (error) {
    console.error("Error al mostrar notificación:", error)
    return null
  }
}

/**
 * Verifica si el navegador soporta localStorage
 */
export function soportaLocalStorage(): boolean {
  try {
    const test = "test"
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Guarda datos en localStorage de forma segura
 * @param clave Clave para guardar los datos
 * @param valor Valor a guardar
 * @returns true si se guardó correctamente, false en caso contrario
 */
export function guardarEnLocalStorage(clave: string, valor: any): boolean {
  if (!soportaLocalStorage()) {
    return false
  }

  try {
    localStorage.setItem(clave, JSON.stringify(valor))
    return true
  } catch (error) {
    console.error(`Error al guardar en localStorage (${clave}):`, error)
    return false
  }
}

/**
 * Obtiene datos de localStorage de forma segura
 * @param clave Clave para obtener los datos
 * @param valorPorDefecto Valor por defecto si no se encuentra la clave
 * @returns Los datos obtenidos o el valor por defecto
 */
export function obtenerDeLocalStorage<T>(clave: string, valorPorDefecto: T): T {
  if (!soportaLocalStorage()) {
    return valorPorDefecto
  }

  try {
    const valor = localStorage.getItem(clave)
    if (valor === null) {
      return valorPorDefecto
    }
    return JSON.parse(valor) as T
  } catch (error) {
    console.error(`Error al obtener de localStorage (${clave}):`, error)
    return valorPorDefecto
  }
}

/**
 * Detecta si el dispositivo es móvil
 */
export function esDispositivoMovil(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detecta si el navegador es Safari
 */
export function esSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

/**
 * Formatea una fecha de forma segura para todos los navegadores
 * @param fecha Fecha a formatear
 * @param opciones Opciones de formato
 * @returns Fecha formateada
 */
export function formatearFechaCompatible(fecha: Date, opciones?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat("es-ES", opciones).format(fecha)
  } catch (error) {
    // Fallback para navegadores antiguos
    const dia = fecha.getDate().toString().padStart(2, "0")
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0")
    const año = fecha.getFullYear()
    return `${dia}/${mes}/${año}`
  }
}
