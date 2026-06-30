import type { SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'
import type { EffectiveSimulationResult } from './simulationDetailsTypes'

export function buildEffectiveResult(
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
