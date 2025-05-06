/**
 * Calcula la siguiente fecha de recurrencia basada en la fecha original y la configuración de recurrencia
 * @param fechaOriginal Fecha original del evento
 * @param tipo Tipo de recurrencia (diaria, semanal, mensual, anual)
 * @param intervalo Intervalo de recurrencia (cada cuántos días/semanas/meses/años)
 * @param iteracion Número de iteración para calcular múltiples ocurrencias
 * @returns Nueva fecha calculada
 */
export function calcularSiguienteFechaRecurrencia(
  fechaOriginal: Date,
  tipo: "diaria" | "semanal" | "mensual" | "anual",
  intervalo: number,
  iteracion = 1,
): Date {
  const nuevaFecha = new Date(fechaOriginal)
  const multiplicador = intervalo * iteracion

  switch (tipo) {
    case "diaria":
      nuevaFecha.setDate(fechaOriginal.getDate() + multiplicador)
      break

    case "semanal":
      nuevaFecha.setDate(fechaOriginal.getDate() + 7 * multiplicador)
      break

    case "mensual": {
      // Obtener el día del mes original
      const diaOriginal = fechaOriginal.getDate()

      // Avanzar los meses según el intervalo
      nuevaFecha.setMonth(fechaOriginal.getMonth() + multiplicador)

      // Obtener el último día del mes resultante
      const ultimoDiaMes = new Date(nuevaFecha.getFullYear(), nuevaFecha.getMonth() + 1, 0).getDate()

      // Si el día original es mayor que el último día del mes resultante,
      // usar el último día del mes resultante
      if (diaOriginal > ultimoDiaMes) {
        nuevaFecha.setDate(ultimoDiaMes)
      } else {
        nuevaFecha.setDate(diaOriginal)
      }
      break
    }

    case "anual":
      nuevaFecha.setFullYear(fechaOriginal.getFullYear() + multiplicador)

      // Manejar el 29 de febrero en años no bisiestos
      if (fechaOriginal.getMonth() === 1 && fechaOriginal.getDate() === 29) {
        const esBisiesto = (año: number) => (año % 4 === 0 && año % 100 !== 0) || año % 400 === 0

        if (!esBisiesto(nuevaFecha.getFullYear())) {
          nuevaFecha.setDate(28)
        }
      }
      break
  }

  return nuevaFecha
}

// Función mejorada para generar fechas recurrentes
export function generarFechasRecurrencia(
  fechaOriginal: Date,
  configuracion: {
    tipo: "diaria" | "semanal" | "mensual" | "anual"
    intervalo: number
    diasSemana?: number[]
    finalizacion?: {
      tipo: "nunca" | "despues" | "fecha"
      ocurrencias?: number
      fecha?: Date
    }
  },
  fechaInicio: Date,
  fechaFin: Date,
  tareaOriginal: any, // TODO: Define the type for tareaOriginal
  instanciasExcluidas: any[], // TODO: Define the type for instanciasExcluidas
): Date[] {
  const fechas: Date[] = []
  let contador = 0

  // Si la recurrencia es semanal con días específicos, manejarlo de forma especial
  if (configuracion.tipo === "semanal" && configuracion.diasSemana && configuracion.diasSemana.length > 0) {
    // Ordenar los días de la semana para procesarlos en orden
    const diasOrdenados = [...configuracion.diasSemana].sort((a, b) => a - b)

    // Obtener el día de la semana de la fecha original (0 = domingo, 1 = lunes, etc.)
    const diaSemanaOriginal = fechaOriginal.getDay()

    // Crear una fecha base que sea el primer día de la semana que contiene la fecha original
    const fechaBaseSemana = new Date(fechaOriginal)
    // Retroceder al domingo (0) de la semana actual
    fechaBaseSemana.setDate(fechaOriginal.getDate() - diaSemanaOriginal)

    // Generar todas las ocurrencias necesarias
    let iteracion = 0
    let continuar = true

    while (continuar) {
      // Calcular la fecha base para esta iteración (cada X semanas)
      const fechaBaseSemanaActual = new Date(fechaBaseSemana)
      fechaBaseSemanaActual.setDate(fechaBaseSemana.getDate() + 7 * configuracion.intervalo * iteracion)

      // Si la fecha base ya está después de la fecha fin, terminar
      if (fechaBaseSemanaActual > fechaFin) {
        break
      }

      // Para cada día seleccionado en la semana
      for (const diaSemana of diasOrdenados) {
        // Calcular la fecha para este día de la semana
        const fechaEvento = new Date(fechaBaseSemanaActual)
        fechaEvento.setDate(fechaBaseSemanaActual.getDate() + diaSemana)

        // Si la fecha está dentro del rango solicitado
        if (fechaEvento >= fechaInicio && fechaEvento <= fechaFin) {
          // No incluir la fecha original si está en el conjunto de fechas generadas
          const esFechaOriginal =
            fechaEvento.getDate() === fechaOriginal.getDate() &&
            fechaEvento.getMonth() === fechaOriginal.getMonth() &&
            fechaEvento.getFullYear() === fechaOriginal.getFullYear()

          if (!esFechaOriginal) {
            fechas.push(new Date(fechaEvento))
            contador++
          }
        }
      }

      // Verificar si debemos continuar según las condiciones de finalización
      if (configuracion.finalizacion) {
        if (
          configuracion.finalizacion.tipo === "despues" &&
          contador >= (configuracion.finalizacion.ocurrencias || 0)
        ) {
          continuar = false
        }
        if (
          configuracion.finalizacion.tipo === "fecha" &&
          configuracion.finalizacion.fecha &&
          fechaBaseSemanaActual > configuracion.finalizacion.fecha
        ) {
          continuar = false
        }
      }

      // Incrementar la iteración para la siguiente semana
      iteracion++

      // Límite de seguridad para evitar bucles infinitos
      if (iteracion > 200) {
        continuar = false
      }
    }

    // Incluir la fecha original si está en el rango
    if (fechaOriginal >= fechaInicio && fechaOriginal <= fechaFin) {
      // Verificar si el día de la semana de la fecha original está en los días seleccionados
      if (diasOrdenados.includes(diaSemanaOriginal)) {
        fechas.unshift(new Date(fechaOriginal))
        contador++
      }
    }
  } else {
    // Para otros tipos de recurrencia, usar el algoritmo original

    // Si la fecha original está en el rango, incluirla
    if (fechaOriginal >= fechaInicio && fechaOriginal <= fechaFin) {
      fechas.push(new Date(fechaOriginal))
      contador++
    }

    // Generar fechas recurrentes
    let fechaActual = new Date(fechaOriginal)
    let iteracion = 1

    while (true) {
      // Calcular la siguiente fecha según el tipo de recurrencia
      fechaActual = calcularSiguienteFechaRecurrencia(
        fechaOriginal,
        configuracion.tipo,
        configuracion.intervalo,
        iteracion,
      )
      iteracion++

      // Verificar si estamos fuera del rango
      if (fechaActual > fechaFin) break

      // Verificar si la fecha está en el rango
      if (fechaActual >= fechaInicio) {
        // Verificar si esta instancia está excluida (fue eliminada individualmente)
        const fechaISO = fechaActual.toISOString()
        const estaExcluida = instanciasExcluidas.some(
          (exclusion) =>
            exclusion.tareaOriginalId === tareaOriginal.id &&
            new Date(exclusion.fechaExcluida).toDateString() === fechaActual.toDateString(),
        )

        if (!estaExcluida) {
          fechas.push(new Date(fechaActual))
          contador++
        }
      }

      // Verificar condiciones de finalización
      if (configuracion.finalizacion) {
        if (
          configuracion.finalizacion.tipo === "despues" &&
          contador >= (configuracion.finalizacion.ocurrencias || 0)
        ) {
          break
        }
        if (
          configuracion.finalizacion.tipo === "fecha" &&
          configuracion.finalizacion.fecha &&
          fechaActual > configuracion.finalizacion.fecha
        ) {
          break
        }
      }

      // Límite de seguridad para evitar bucles infinitos
      if (iteracion > 200) break
    }
  }

  return fechas
}
