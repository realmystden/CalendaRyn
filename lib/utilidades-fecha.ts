export function obtenerNombreMes(mes: number): string {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  return meses[mes]
}

export function obtenerDiasEnMes(año: number, mes: number): number {
  return new Date(año, mes + 1, 0).getDate()
}

export function obtenerPrimerDiaSemana(año: number, mes: number): number {
  // Obtener el día de la semana del primer día del mes (0 = Domingo, 1 = Lunes, etc.)
  let primerDia = new Date(año, mes, 1).getDay()

  // Ajustar para que la semana comience en lunes (0 = Lunes, 6 = Domingo)
  primerDia = primerDia === 0 ? 6 : primerDia - 1

  return primerDia
}

export function obtenerDiasSemana(fechaInicio: Date): Date[] {
  const dias = []
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(fechaInicio)
    fecha.setDate(fechaInicio.getDate() + i)
    dias.push(fecha)
  }
  return dias
}

export function formatearFecha(
  fecha: Date,
  formato: "completa" | "corta" | "dia-semana" | "dia-semana-corto" | "mes-año",
): string {
  const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const diasSemanaCortados = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const diaSemana = diasSemana[fecha.getDay()]
  const diaSemanaCorto = diasSemanaCortados[fecha.getDay()]
  const dia = fecha.getDate()
  const mes = meses[fecha.getMonth()]
  const año = fecha.getFullYear()

  switch (formato) {
    case "completa":
      return `${diaSemana}, ${dia} de ${mes} de ${año}`
    case "corta":
      return `${dia}/${fecha.getMonth() + 1}/${año}`
    case "dia-semana":
      return diaSemana
    case "dia-semana-corto":
      return diaSemanaCorto
    case "mes-año":
      return `${mes} ${año}`
    default:
      return `${dia} de ${mes} de ${año}`
  }
}
