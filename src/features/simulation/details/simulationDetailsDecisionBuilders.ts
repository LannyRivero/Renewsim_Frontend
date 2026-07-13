import type { DecisionSummary, DetailSectionContent } from './simulationDetailsTypes'

export function buildDecisionSummary({
  roi,
  paybackYears,
  efficiency,
  revenue,
  capex,
  energyTypeLabel,
}: {
  roi: number | null
  paybackYears: number | null
  efficiency: number | null
  revenue: number | null
  capex: number | null
  energyTypeLabel: string
}): DecisionSummary {
  const drivers: string[] = []
  const technicalLabel = energyTypeLabel.toLowerCase()

  if (roi === null) {
    drivers.push('El escenario todavía no cuenta con una lectura completa de retorno para sostener una recomendación firme.')
  } else if (roi < 0) {
    drivers.push('El retorno proyectado es negativo, por lo que el escenario no recupera valor bajo las condiciones actuales.')
  } else if (roi < 8) {
    drivers.push('El retorno proyectado es positivo pero todavía débil para justificar una decisión inmediata de inversión.')
  } else {
    drivers.push('El retorno proyectado aporta una base económica más favorable para avanzar con evaluación ejecutiva.')
  }

  if (paybackYears === null) {
    drivers.push('No hay un tiempo de retorno consolidado disponible, lo que reduce la capacidad de defensa financiera del escenario.')
  } else if (paybackYears > 10) {
    drivers.push('El tiempo de retorno es extenso y exige una justificación estratégica más fuerte para priorizar esta alternativa.')
  } else if (paybackYears > 6) {
    drivers.push('El tiempo de retorno es moderado y conviene contrastarlo con objetivos de inversión y horizonte operativo.')
  } else {
    drivers.push('El tiempo de retorno se mantiene en un rango razonable para una evaluación ejecutiva positiva.')
  }

  if (efficiency === null) {
    drivers.push(`La eficiencia esperada de la alternativa ${technicalLabel} no está consolidada en esta corrida.`)
  } else if (efficiency < 15) {
    drivers.push(`La eficiencia operativa esperada para la alternativa ${technicalLabel} es baja y limita la solidez técnica del escenario.`)
  } else if (efficiency < 35) {
    drivers.push('La eficiencia operativa esperada es intermedia y debería revisarse junto con capacidad, costos y condiciones climáticas.')
  } else {
    drivers.push('La eficiencia operativa esperada acompaña una lectura técnica más consistente del escenario.')
  }

  const hasWeakReturn = roi !== null && roi < 0
  const hasSlowPayback = paybackYears !== null && paybackYears > 10
  const hasLowEfficiency = efficiency !== null && efficiency < 15
  const hasGoodReturn = roi !== null && roi >= 8
  const hasGoodPayback = paybackYears !== null && paybackYears <= 6
  const hasGoodEfficiency = efficiency !== null && efficiency >= 35

  if (hasWeakReturn || hasSlowPayback || hasLowEfficiency) {
    const mainSignal = hasWeakReturn
      ? 'Retorno insuficiente para defender inversión.'
      : hasSlowPayback
        ? 'Horizonte de recuperación demasiado largo para priorización.'
        : 'Desempeño técnico débil para sostener el caso.'

    return {
      decisionStatus: 'No recomendado',
      decisionHeadline: 'El escenario no muestra una base suficiente para justificar inversión en su estado actual.',
      decisionSummary:
        'La combinación de retorno, plazo de recuperación y desempeño operativo sugiere revisar supuestos antes de elevar este caso a decisión.',
      decisionDrivers: drivers,
      mainSignal,
      mainRisk: 'Escalar este escenario sin corregir supuestos puede inmovilizar presupuesto en un caso con baja defensa económica o técnica.',
      nextAction: 'Revisar supuestos de costo, recurso y dimensionamiento antes de volver a presentarlo para priorización.',
    }
  }

  if (hasGoodReturn && hasGoodPayback && hasGoodEfficiency) {
    return {
      decisionStatus: 'Recomendado',
      decisionHeadline: 'El escenario presenta una señal sólida para avanzar a evaluación ejecutiva y validación final.',
      decisionSummary:
        'Los indicadores económicos y operativos se alinean de forma favorable para sostener una conversación de inversión con mayor confianza.',
      decisionDrivers: drivers,
      mainSignal: 'Retorno, recuperación y desempeño técnico se alinean de forma favorable.',
      mainRisk: 'La principal reserva es validar sensibilidad de costos y supuestos operativos antes de comprometer inversión final.',
      nextAction: 'Pasar a validación final con contraste de supuestos, sensibilidad y cierre financiero.',
    }
  }

  const financialGap =
    typeof revenue === 'number' && typeof capex === 'number' && revenue > 0 ? Number((capex / revenue).toFixed(1)) : null

  return {
    decisionStatus: 'Viable con reservas',
    decisionHeadline: 'El escenario puede seguir evaluándose, pero todavía necesita validaciones antes de defender inversión.',
    decisionSummary:
      financialGap !== null
        ? `La relación entre inversión e ingreso esperado sugiere una revisión adicional del caso antes de priorizarlo. Horizonte simple de recuperación: ${financialGap} años.`
        : 'Los indicadores disponibles permiten continuar el análisis, aunque todavía no alcanzan una señal suficientemente concluyente.',
    decisionDrivers: drivers,
    mainSignal: 'El caso tiene señales positivas, pero todavía no alcanza una defensa suficientemente concluyente.',
    mainRisk: 'Si no se contrastan sensibilidad, retorno y desempeño operativo, la priorización puede quedar expuesta frente a dirección o finanzas.',
    nextAction: 'Comparar escenarios, correr sensibilidad y cerrar validaciones antes de elevar recomendación de inversión.',
  }
}

export function buildSummarySection({
  decisionStatus,
  decisionHeadline,
  decisionSummary,
  roi,
  paybackYears,
  mainSignal,
  mainRisk,
  nextAction,
}: {
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  roi: string
  paybackYears: string
  mainSignal: string
  mainRisk: string
  nextAction: string
}): DetailSectionContent {
  return {
    sectionLabel: 'Decisión',
    title: 'Lectura para decisión',
    summary: decisionHeadline,
    primaryMetrics: [
      { label: 'Recomendación', value: decisionStatus, helper: decisionSummary },
      { label: 'ROI', value: roi },
      { label: 'Tiempo de retorno', value: paybackYears },
    ],
    supportingMetrics: [
      { label: 'Señal principal', value: mainSignal },
      { label: 'Riesgo principal', value: mainRisk },
      { label: 'Próximo paso', value: nextAction },
    ],
  }
}

function getSummaryClimateMetric({
  energyType,
  irradiance,
  windSpeed,
  hydrology,
}: {
  energyType: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
}) {
  const normalized = energyType.trim().toUpperCase()

  if (normalized === 'WIND') {
    return {
      label: 'Velocidad del viento',
      value: `${windSpeed} m/s`,
    }
  }

  if (normalized === 'HYDRO') {
    return {
      label: 'Hidrología',
      value: String(hydrology),
    }
  }

  return {
    label: 'Irradiancia',
    value: `${irradiance} kWh/m2/día`,
  }
}

export function buildSummarySnapshotSection({
  energyType,
  irradiance,
  windSpeed,
  hydrology,
  revenue,
  capex,
  location,
  decisionDrivers,
}: {
  energyType: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  revenue: string
  capex: string
  location: string
  decisionDrivers: string[]
}): DetailSectionContent {
  const climateMetric = getSummaryClimateMetric({
    energyType,
    irradiance,
    windSpeed,
    hydrology,
  })

  return {
    sectionLabel: 'Decisión',
    title: 'Sustento de la recomendación',
    summary: 'Señales que hoy explican la recomendación y qué conviene revisar antes de mover inversión.',
    primaryMetrics: [
      { label: 'Retorno', value: 'Señal económica', helper: decisionDrivers[0] ?? 'Sin lectura disponible.' },
      { label: 'Recuperación', value: 'Horizonte de inversión', helper: decisionDrivers[1] ?? 'Sin lectura disponible.' },
      { label: 'Desempeño técnico', value: 'Condición operativa', helper: decisionDrivers[2] ?? 'Sin lectura disponible.' },
    ],
    supportingMetrics: [
      { label: 'Ingreso estimado', value: revenue, helper: `Inversión inicial: ${capex}` },
      { label: climateMetric.label, value: climateMetric.value },
      { label: 'Ubicación', value: location },
    ],
  }
}
