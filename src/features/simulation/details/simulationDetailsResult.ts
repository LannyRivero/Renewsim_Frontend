import type { SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationDetailsResponse, SimulationResult } from '@/shared/types'
import type { EffectiveSimulationResult } from './simulationDetailsTypes'

export function buildEffectiveResult(
  data: SimulationDetails | null | undefined,
  realData: SimulationDetailsResponse | null | undefined,
  requestedSimulationId: string | null,
  resultFromStore: SimulationResult | null,
): EffectiveSimulationResult | null {
  if (realData) {
    return {
      id: realData.id,
      name: realData.input.name,
      location: realData.location.label,
      energyType: realData.technology,
      roi: realData.financial.irrPct ?? undefined,
      efficiency: Number((realData.technical.performanceRatio * 100).toFixed(1)),
      projectSize: realData.input.system.installedCapacityKw,
      budget: realData.input.economics.capexTotal,
      energyGenerated: realData.technical.annualGenerationKwh,
      estimatedSavings: realData.financial.annualSavings,
      irradiance: realData.technical.resource.monthlyIrradianceKwhM2[0],
      windSpeed: undefined,
      hydrology: undefined,
      temperature: realData.technical.resource.monthlyTemperatureC[0],
      climateSource: realData.assumptions.climateSource,
      climatePeriod: realData.assumptions.climatePeriod,
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
