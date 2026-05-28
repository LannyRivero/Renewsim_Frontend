import type { CreateSimulationPayload, SimulationResult } from '@/shared/types'

type InsightMetrics = {
  energyGeneratedKwh: number
  roiPercent: number
  efficiencyPercent: number
  paybackYears: number
  co2AvoidedTons: number
  recommendedTechnology: string
}

const ENERGY_FACTOR = {
  solar: 0.19,
  wind: 0.31,
  hydro: 0.42,
} as const

export function buildSimulationInsights(
  input: CreateSimulationPayload | null,
  result: SimulationResult | null,
): InsightMetrics {
  const projectSize = input?.projectSize ?? 500
  const climate = input?.climate ?? { irradiance: 4.5, windSpeed: 6, hydrology: 2.5 }
  const energyType = (input?.energyType ?? result?.energyType ?? 'solar') as 'solar' | 'wind' | 'hydro'

  const climateMultiplier =
    energyType === 'solar'
      ? climate.irradiance / 5
      : energyType === 'wind'
        ? climate.windSpeed / 7
        : climate.hydrology / 3

  const baseGeneration = projectSize * 32
  const energyGeneratedKwh = Math.round(baseGeneration * ENERGY_FACTOR[energyType] * climateMultiplier * 12)

  const efficiencyPercent =
    typeof result?.efficiency === 'number'
      ? Number(result.efficiency.toFixed(1))
      : Number(Math.min(97, 72 + climateMultiplier * 18 + ENERGY_FACTOR[energyType] * 10).toFixed(1))

  const roiPercent =
    typeof result?.roi === 'number'
      ? Number(result.roi.toFixed(1))
      : Number((6 + climateMultiplier * 6 + ENERGY_FACTOR[energyType] * 18).toFixed(1))

  const paybackYears = Number(Math.max(3, 16 - roiPercent / 2).toFixed(1))
  const co2AvoidedTons = Number((energyGeneratedKwh * 0.00038).toFixed(1))

  return {
    energyGeneratedKwh,
    roiPercent,
    efficiencyPercent,
    paybackYears,
    co2AvoidedTons,
    recommendedTechnology:
      energyType === 'solar' ? 'Solar Power' : energyType === 'wind' ? 'Wind Turbine' : 'Hydroelectric Plant',
  }
}
