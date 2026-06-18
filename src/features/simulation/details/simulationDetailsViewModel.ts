import { buildSimulationInsights } from '../utils/simulationInsights'
import type { SimulationDetails, SimulationCreateFormValues } from '../schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

type EnergyProfile = {
  label: string
  roiBonus: number
  savingsMultiplier: number
  co2Multiplier: number
  investmentMultiplier: number
}

export type EffectiveSimulationResult = SimulationResult & Partial<SimulationDetails>

export type EnergyComparisonRow = {
  energySource: string
  initialInvestment: string
  annualSavings: string
  roi: string
  co2Reduction: string
}

export type SimulationDetailsViewModel = {
  effectiveResult: EffectiveSimulationResult | null
  location: string
  energyType: string
  simulationName: string
  date: string
  roi: string
  efficiency: string
  comparisonRows: EnergyComparisonRow[]
  totalInvestment: string
  totalSavings: string
  averageTemperature: string
  co2Reduction: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  climateSource: string
  climatePeriod: string
}

const ENERGY_PROFILES: EnergyProfile[] = [
  {
    label: 'Paneles solares',
    roiBonus: 0,
    savingsMultiplier: 1,
    co2Multiplier: 1,
    investmentMultiplier: 1,
  },
  {
    label: 'Turbina eólica',
    roiBonus: -1.2,
    savingsMultiplier: 1.2,
    co2Multiplier: 1.35,
    investmentMultiplier: 1.55,
  },
  {
    label: 'Hidroeléctrica',
    roiBonus: -0.4,
    savingsMultiplier: 1.4,
    co2Multiplier: 1.7,
    investmentMultiplier: 2.1,
  },
]

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

export function buildSimulationDetailsViewModel({
  data,
  requestedSimulationId,
  resultFromStore,
  lastRunInput,
}: {
  data: SimulationDetails | null | undefined
  requestedSimulationId: string | null
  resultFromStore: SimulationResult | null
  lastRunInput: SimulationCreateFormValues | null
}): SimulationDetailsViewModel {
  const effectiveResult = buildEffectiveResult(data, requestedSimulationId, resultFromStore)
  const insights = buildSimulationInsights(lastRunInput, effectiveResult)

  const energyType = effectiveResult?.energyType ?? 'Unknown'
  const comparisonRows = ENERGY_PROFILES.map((profile) => {
    const annualSavings = insights.energyGeneratedKwh * 0.11 * profile.savingsMultiplier
    const initialInvestment = (effectiveResult?.budget ?? lastRunInput?.budget ?? 1_000_000) * 0.1 * profile.investmentMultiplier
    const simulatedRoi = Math.max(2, insights.roiPercent + profile.roiBonus)

    return {
      energySource: profile.label,
      initialInvestment: formatCurrency(initialInvestment),
      annualSavings: `${formatCurrency(annualSavings)}/year`,
      roi: `${simulatedRoi.toFixed(1)}%`,
      co2Reduction: `${(insights.co2AvoidedTons * profile.co2Multiplier).toFixed(1)} tons`,
    }
  })

  const totalInvestment = comparisonRows.reduce((sum, row) => {
    const raw = Number(row.initialInvestment.replace(/[$,]/g, ''))
    return sum + raw
  }, 0)
  const totalSavings = comparisonRows.reduce((sum, row) => {
    const raw = Number(row.annualSavings.replace('/year', '').replace(/[$,]/g, ''))
    return sum + raw
  }, 0)

  return {
    effectiveResult,
    location: effectiveResult?.location ?? 'N/A',
    energyType,
    simulationName: effectiveResult?.name ?? `${energyType} Simulación`,
    date: formatDate(data?.createdAt),
    roi: typeof effectiveResult?.roi === 'number' ? `${effectiveResult.roi}%` : `${insights.roiPercent}%`,
    efficiency:
      typeof effectiveResult?.efficiency === 'number'
        ? `${effectiveResult.efficiency}%`
        : `${insights.efficiencyPercent}%`,
    comparisonRows,
    totalInvestment: formatCurrency(totalInvestment),
    totalSavings: `${formatCurrency(totalSavings)}/año`,
    averageTemperature: typeof effectiveResult?.temperature === 'number' ? `${effectiveResult.temperature.toFixed(1)} C` : 'N/A',
    co2Reduction: `${insights.co2AvoidedTons} toneladas/año`,
    irradiance: effectiveResult?.irradiance ?? 'N/D',
    windSpeed: effectiveResult?.windSpeed ?? 'N/D',
    hydrology: effectiveResult?.hydrology ?? 'N/D',
    climateSource: effectiveResult?.climateSource ?? 'N/D',
    climatePeriod: effectiveResult?.climatePeriod ?? 'N/D',
  }
}
