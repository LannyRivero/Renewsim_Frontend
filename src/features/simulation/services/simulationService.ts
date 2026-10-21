import type { ResolvedLocation } from '@/shared/types'

export { resolveLocation, searchLocations } from './location/locationApiService'
export {
  createRealSimulation,
  deleteSimulationById,
  getRealSimulationById,
  getRealSimulationHistory,
  getSavedLocationSuggestions,
  updateSimulationById,
} from './simulations/simulationApiService'
export type { ResolvedLocation }
