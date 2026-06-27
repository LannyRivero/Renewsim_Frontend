import type { SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

export type EffectiveSimulationResult = SimulationResult & Partial<SimulationDetails>

export type SimulationDetailsViewModel = {
  effectiveResult: EffectiveSimulationResult | null
  location: string
  energyType: string
  displayTitle: string
  simulationName: string
  date: string
  roi: string
  efficiency: string
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  decisionDrivers: string[]
  capex: string
  opex: string
  revenue: string
  paybackYears: string
  npv: string
  irr: string
  energyGenerated: string
  averageTemperature: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  climateSource: string
  climatePeriod: string
}

type DecisionSummary = {
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  decisionDrivers: string[]
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

function formatDate(createdAt?: string) {
  if (!createdAt) return 'N/A'

  return new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatNumber(value: number, maximumFractionDigits = 1) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}

function formatEnergyTypeLabel(value: string) {
  const normalized = value.trim().toUpperCase()
  if (normalized === 'WIND') return 'Eólica'
  if (normalized === 'HYDRO') return 'Hidráulica'
  if (normalized === 'SOLAR') return 'Solar'
  return 'Simulación'
}

function buildCompactLocationLabel(location: string) {
  if (!location || location === 'N/A') return 'Escenario'

  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length >= 3) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
  }

  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`
  }

  return parts[0] ?? 'Escenario'
}

function isCoordinateLike(value: string) {
  return /^-?\d+(?:[.,]\d+)?\s*,\s*-?\d+(?:[.,]\d+)?$/.test(value.trim())
}

function buildDisplayTitle({
  simulationName,
  energyType,
  location,
}: {
  simulationName: string
  energyType: string
  location: string
}) {
  const energyLabel = formatEnergyTypeLabel(energyType)

  if (location && location !== 'N/A' && !isCoordinateLike(location)) {
    return `${energyLabel} · ${buildCompactLocationLabel(location)}`
  }

  const suffix = simulationName.includes(' - ') ? simulationName.split(' - ').slice(1).join(' - ') : ''
  if (suffix) {
    return `${energyLabel} · ${buildCompactLocationLabel(suffix)}`
  }

  return energyLabel
}

function buildEffectiveResult(
  data: SimulationDetails | null | undefined,
  requestedSimulationId: string | null,
  resultFromStore: SimulationResult | null,
): EffectiveSimulationResult | null {
  if (data) {
    return {
      id: data.id,
      name: data.name,
      location: data.location,
      energyType: data.energyType,
      roi: data.roi,
      efficiency: data.efficiency,
      projectSize: data.projectSize,
      budget: data.budget,
      energyGenerated: data.energyGenerated,
      estimatedSavings: data.estimatedSavings,
      irradiance: data.irradiance,
      windSpeed: data.windSpeed,
      hydrology: data.hydrology,
      temperature: data.temperature,
      climateSource: data.climateSource,
      climatePeriod: data.climatePeriod,
    }
  }

  if (requestedSimulationId) {
    return null
  }

  return resultFromStore ?? null
}

function buildDecisionSummary({
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
    drivers.push(`La eficiencia esperada de la alternativa ${energyTypeLabel.toLowerCase()} no está consolidada en esta corrida.`)
  } else if (efficiency < 15) {
    drivers.push(`La eficiencia operativa esperada para la alternativa ${energyTypeLabel.toLowerCase()} es baja y limita la solidez técnica del escenario.`)
  } else if (efficiency < 35) {
    drivers.push(`La eficiencia operativa esperada es intermedia y debería revisarse junto con capacidad, costos y condiciones climáticas.`)
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
    return {
      decisionStatus: 'No recomendado',
      decisionHeadline: 'El escenario no muestra una base suficiente para justificar inversión en su estado actual.',
      decisionSummary:
        'La combinación de retorno, plazo de recuperación y desempeño operativo sugiere revisar supuestos antes de elevar este caso a decisión.',
      decisionDrivers: drivers,
    }
  }

  if (hasGoodReturn && hasGoodPayback && hasGoodEfficiency) {
    return {
      decisionStatus: 'Recomendado',
      decisionHeadline: 'El escenario presenta una señal sólida para avanzar a evaluación ejecutiva y validación final.',
      decisionSummary:
        'Los indicadores económicos y operativos se alinean de forma favorable para sostener una conversación de inversión con mayor confianza.',
      decisionDrivers: drivers,
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
  }
}

export function buildSimulationDetailsViewModel({
  data,
  requestedSimulationId,
  resultFromStore,
}: {
  data: SimulationDetails | null | undefined
  requestedSimulationId: string | null
  resultFromStore: SimulationResult | null
}): SimulationDetailsViewModel {
  const effectiveResult = buildEffectiveResult(data, requestedSimulationId, resultFromStore)

  const energyType = effectiveResult?.energyType ?? 'Unknown'
  const roiNumber = typeof effectiveResult?.roi === 'number' ? effectiveResult.roi : null
  const efficiencyNumber = typeof effectiveResult?.efficiency === 'number' ? effectiveResult.efficiency : null
  const capexNumber = typeof data?.capex === 'number' ? data.capex : typeof effectiveResult?.budget === 'number' ? effectiveResult.budget : null
  const revenueNumber = typeof data?.revenue === 'number' ? data.revenue : typeof effectiveResult?.estimatedSavings === 'number' ? effectiveResult.estimatedSavings : null
  const paybackYearsNumber = typeof data?.paybackYears === 'number' ? data.paybackYears : null
  const location = effectiveResult?.location ?? 'N/A'
  const simulationName = effectiveResult?.name ?? `${energyType} Simulación`
  const displayTitle = buildDisplayTitle({ simulationName, energyType, location })
  const decisionSummary = buildDecisionSummary({
    roi: roiNumber,
    paybackYears: paybackYearsNumber,
    efficiency: efficiencyNumber,
    revenue: revenueNumber,
    capex: capexNumber,
    energyTypeLabel: formatEnergyTypeLabel(energyType),
  })

  return {
    effectiveResult,
    location,
    energyType,
    displayTitle,
    simulationName,
    date: formatDate(data?.createdAt),
    roi: roiNumber !== null ? `${formatNumber(roiNumber)}%` : 'N/D',
    efficiency: efficiencyNumber !== null ? `${formatNumber(efficiencyNumber)}%` : 'N/D',
    decisionStatus: decisionSummary.decisionStatus,
    decisionHeadline: decisionSummary.decisionHeadline,
    decisionSummary: decisionSummary.decisionSummary,
    decisionDrivers: decisionSummary.decisionDrivers,
    capex:
      capexNumber !== null ? formatCurrency(capexNumber) : 'N/D',
    opex: typeof data?.opex === 'number' ? formatCurrency(data.opex) : 'N/D',
    revenue:
      revenueNumber !== null ? formatCurrency(revenueNumber) : 'N/D',
    paybackYears: paybackYearsNumber !== null ? `${formatNumber(paybackYearsNumber)} años` : 'N/D',
    npv: typeof data?.npv === 'number' ? formatCurrency(data.npv) : 'N/D',
    irr: typeof data?.irr === 'number' ? `${formatNumber(data.irr)}%` : 'N/D',
    energyGenerated:
      typeof effectiveResult?.energyGenerated === 'number'
        ? `${Math.round(effectiveResult.energyGenerated).toLocaleString('en-US')} kWh`
        : 'N/D',
    averageTemperature: typeof effectiveResult?.temperature === 'number' ? `${effectiveResult.temperature.toFixed(1)} C` : 'N/D',
    irradiance: effectiveResult?.irradiance ?? 'N/D',
    windSpeed: effectiveResult?.windSpeed ?? 'N/D',
    hydrology: effectiveResult?.hydrology ?? 'N/D',
    climateSource: effectiveResult?.climateSource ?? 'N/D',
    climatePeriod: effectiveResult?.climatePeriod ?? 'N/D',
  }
}
