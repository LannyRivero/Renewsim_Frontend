import type { SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationDetailsResponse, SimulationResult } from '@/shared/types'

export type EffectiveSimulationResult = SimulationResult & Partial<SimulationDetails>

export function buildEffectiveResult(
  data: SimulationDetails | null | undefined,
  realData: SimulationDetailsResponse | null | undefined,
  lastResult: SimulationResult | null,
): EffectiveSimulationResult | null {
  if (realData) {
    return {
      id: realData.id,
      name: realData.input.name,
      location: realData.location.label,
      energyType: realData.technology,
      roi: realData.financial.irrPct ?? undefined,
      efficiency: realData.technical.performanceRatio * 100,
      projectSize: realData.input.system.installedCapacityKw,
      budget: realData.input.economics.capexTotal,
      energyGenerated: realData.technical.annualGenerationKwh,
      estimatedSavings: realData.financial.annualSavings,
      irradiance: realData.technical.resource.monthlyIrradianceKwhM2[0],
      windSpeed: undefined,
      hydrology: undefined,
      climateSource: realData.assumptions.climateSource,
      climatePeriod: realData.assumptions.climatePeriod,
      temperature: realData.technical.resource.monthlyTemperatureC[0],
    }
  }

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
