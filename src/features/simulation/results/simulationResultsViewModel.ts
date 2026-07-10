import { buildSimulationInsights } from '../utils/simulationInsights'
import type { SimulationDetails, SimulationCreateFormValues } from '../schemas/simulationSchema'
import type { SimulationDetailsResponse, SimulationResult, TechnologyItem } from '@/shared/types'
import {
  buildComparableTechnologies,
  buildComparisonHeights,
  normalizeEnergyType,
  type ComparableTechnology,
  type ComparisonHeight,
} from './simulationResultsComparison'
import { buildEffectiveResult, type EffectiveSimulationResult } from './simulationResultsResult'

export type SimulationResultsMetric = {
  label: string
  value: string
  delta: string
  positive?: boolean
}

export type SimulationResultsViewModel = {
  effectiveResult: EffectiveSimulationResult | null
  recommendedTechnology: string
  recommendationStatus?: string
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


export function buildSimulationResultsViewModel({
  data,
  realData,
  lastResult,
  lastRunInput,
  technologies,
}: {
  data: SimulationDetails | null | undefined
  realData?: SimulationDetailsResponse | null
  lastResult: SimulationResult | null
  lastRunInput: SimulationCreateFormValues | null
  technologies: TechnologyItem[]
}): SimulationResultsViewModel {
  const effectiveResult = buildEffectiveResult(data, realData, lastResult)
  const resultLocation = effectiveResult?.location ?? 'N/A'
  const resultEnergyType = effectiveResult?.energyType ?? 'solar'
  const normalizedEnergyType = normalizeEnergyType(resultEnergyType)
  const insights = buildSimulationInsights(lastRunInput, effectiveResult)

  const energyGeneratedValue = effectiveResult?.energyGenerated ?? insights.energyGeneratedKwh
  const estimatedSavingsValue =
    typeof effectiveResult?.estimatedSavings === 'number'
      ? effectiveResult.estimatedSavings
      : Math.round(energyGeneratedValue * 0.11)
  const roiValue = `${typeof effectiveResult?.roi === 'number' ? Number(effectiveResult.roi.toFixed(1)) : insights.roiPercent}%`
  const efficiencyValue = `${typeof effectiveResult?.efficiency === 'number' ? Number(effectiveResult.efficiency.toFixed(1)) : insights.efficiencyPercent}%`
  const energyValue = `${energyGeneratedValue.toLocaleString('en-US')} kWh`
  const paybackYears =
    typeof realData?.financial.paybackYears === 'number'
      ? realData.financial.paybackYears
      : typeof effectiveResult?.budget === 'number' &&
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

  const comparisonHeights = buildComparisonHeights(
    energyGeneratedValue,
    estimatedSavingsValue,
    insights.co2AvoidedTons,
    energyValue,
    formatCurrency(estimatedSavingsValue),
    co2Value,
  )

  return {
    effectiveResult,
    recommendedTechnology:
      realData?.summary.recommendation === 'recommended'
        ? 'Escenario recomendado'
        : realData?.summary.recommendation === 'viable_with_reservations'
          ? 'Escenario viable con reservas'
          : realData?.summary.recommendation === 'not_recommended'
            ? 'Escenario no recomendado'
            : insights.recommendedTechnology,
    recommendationStatus: realData?.summary.recommendation,
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
