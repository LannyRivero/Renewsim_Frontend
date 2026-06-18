import { buildSimulationInsights } from '../utils/simulationInsights'
import type { SimulationDetails, SimulationCreateFormValues } from '../schemas/simulationSchema'
import type { SimulationResult, TechnologyItem } from '@/shared/types'

export type ComparableTechnology = {
  id: string
  name: string
  score: number
  efficiency: number
  co2Reduction: number
  progressWidth: string
}

export type ComparisonHeight = {
  label: 'Generación' | 'Ahorro' | 'CO2'
  value: number
  displayValue: string
  height: string
}

export type SimulationResultsMetric = {
  label: string
  value: string
  delta: string
  positive?: boolean
}

export type EffectiveSimulationResult = SimulationResult & Partial<SimulationDetails>

export type SimulationResultsViewModel = {
  effectiveResult: EffectiveSimulationResult | null
  recommendedTechnology: string
  resultLocation: string
  normalizedEnergyType: 'SOLAR' | 'WIND' | 'HYDRO'
  roiValue: string
  efficiencyValue: string
  energyValue: string
  paybackValue: string
  savingsValue: string
  co2Value: string
  climateSource: string
  climatePeriod: string
  averageTemperature: string
  comparableTechnologies: ComparableTechnology[]
  comparisonHeights: ComparisonHeight[]
  metrics: SimulationResultsMetric[]
  conclusion: string
}

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

function formatPercent(value: number) {
  return `${Number(value.toFixed(1))}%`
}

function barHeight(value: number, max: number, min = 18) {
  if (max <= 0) return `${min}%`
  return `${Math.max(min, Math.round((value / max) * 100))}%`
}

export function normalizeEnergyType(value: string): 'SOLAR' | 'WIND' | 'HYDRO' {
  const normalized = value.trim().toUpperCase()
  if (normalized === 'WIND') return 'WIND'
  if (normalized === 'HYDRO') return 'HYDRO'
  return 'SOLAR'
}

function buildEffectiveResult(
  data: SimulationDetails | null | undefined,
  lastResult: SimulationResult | null,
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
      climateSource: data.climateSource,
      climatePeriod: data.climatePeriod,
      temperature: data.temperature,
    }
  }

  return lastResult ?? null
}

function buildComparableTechnologies(
  technologies: TechnologyItem[],
  energyType: string,
): ComparableTechnology[] {
  const targetType = normalizeEnergyType(energyType)

  const ranked = technologies
    .filter((item) => normalizeEnergyType(item.energyType) === targetType)
    .map((item) => {
      const score =
        item.efficiency * 0.45 +
        item.capacityFactor * 0.25 +
        item.co2Reduction * 0.2 +
        Math.max(0, 100 - item.environmentalImpact) * 0.1

      return {
        id: item.id,
        name: item.name,
        score: Number(score.toFixed(1)),
        efficiency: item.efficiency,
        co2Reduction: item.co2Reduction,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const bestScore = ranked[0]?.score ?? 0

  return ranked.map((item) => ({
    ...item,
    progressWidth: `${Math.max(8, bestScore > 0 ? (item.score / bestScore) * 100 : 0)}%`,
  }))
}

export function buildSimulationResultsViewModel({
  data,
  lastResult,
  lastRunInput,
  technologies,
}: {
  data: SimulationDetails | null | undefined
  lastResult: SimulationResult | null
  lastRunInput: SimulationCreateFormValues | null
  technologies: TechnologyItem[]
}): SimulationResultsViewModel {
  const effectiveResult = buildEffectiveResult(data, lastResult)
  const resultLocation = effectiveResult?.location ?? 'N/A'
  const resultEnergyType = effectiveResult?.energyType ?? 'solar'
  const normalizedEnergyType = normalizeEnergyType(resultEnergyType)
  const insights = buildSimulationInsights(lastRunInput, effectiveResult)

  const energyGeneratedValue = effectiveResult?.energyGenerated ?? insights.energyGeneratedKwh
  const estimatedSavingsValue =
    typeof effectiveResult?.estimatedSavings === 'number'
      ? effectiveResult.estimatedSavings
      : Math.round(energyGeneratedValue * 0.11)
  const roiValue = `${typeof effectiveResult?.roi === 'number' ? effectiveResult.roi : insights.roiPercent}%`
  const efficiencyValue = `${insights.efficiencyPercent}%`
  const energyValue = `${energyGeneratedValue.toLocaleString('en-US')} kWh`
  const paybackYears =
    typeof effectiveResult?.budget === 'number' &&
    effectiveResult.budget > 0 &&
    typeof effectiveResult?.estimatedSavings === 'number' &&
    effectiveResult.estimatedSavings > 0
      ? Number((effectiveResult.budget / effectiveResult.estimatedSavings).toFixed(1))
      : insights.paybackYears
  const paybackValue = `${paybackYears} years`
  const savingsValue = `${formatCurrency(estimatedSavingsValue)}/year`
  const co2Value = `${insights.co2AvoidedTons} tons`
  const climateSource = effectiveResult?.climateSource ?? 'N/A'
  const climatePeriod = effectiveResult?.climatePeriod ?? 'N/A'
  const averageTemperature = typeof effectiveResult?.temperature === 'number' ? `${effectiveResult.temperature.toFixed(1)} C` : 'N/A'
  const comparableTechnologies = buildComparableTechnologies(technologies, resultEnergyType)

  const rawComparisonHeights = [
    { label: 'Generación' as const, value: energyGeneratedValue, displayValue: energyValue },
    { label: 'Ahorro' as const, value: estimatedSavingsValue, displayValue: formatCurrency(estimatedSavingsValue) },
    { label: 'CO2' as const, value: insights.co2AvoidedTons * 1000, displayValue: co2Value },
  ]
  const comparisonMax = Math.max(...rawComparisonHeights.map((item) => item.value), 1)
  const comparisonHeights = rawComparisonHeights.map((item) => ({
    ...item,
    height: barHeight(item.value, comparisonMax),
  }))

  return {
    effectiveResult,
    recommendedTechnology: insights.recommendedTechnology,
    resultLocation,
    normalizedEnergyType,
    roiValue,
    efficiencyValue,
    energyValue,
    paybackValue,
    savingsValue,
    co2Value,
    climateSource,
    climatePeriod,
    averageTemperature,
    comparableTechnologies,
    comparisonHeights,
    metrics: [
      { label: 'Energía generada', value: energyValue, delta: efficiencyValue },
      { label: 'ROI', value: roiValue, delta: 'Salida real' },
      { label: 'Ahorro estimado', value: savingsValue, delta: 'Salida real' },
      { label: 'Retorno', value: paybackValue, delta: 'Presupuesto vs ahorro', positive: false },
      { label: 'CO2 evitado', value: co2Value, delta: 'Estimación anual' },
    ],
    conclusion: `La simulación muestra un escenario con ${formatPercent(typeof effectiveResult?.roi === 'number' ? effectiveResult.roi : insights.roiPercent)} de ROI, ${savingsValue} de ahorro anual estimado y una producción de ${energyValue}. Esto te da una base real para comparar tecnologías sin salir del flujo.`,
  }
}
