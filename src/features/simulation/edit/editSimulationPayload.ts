import { getRealSimulationById, searchLocations } from '../services/simulationService'
import type { EditSimulationValues } from '../schemas/simulationSchema'
import type { RealCreateSimulationRequest } from '@/shared/types'
import { resolveCountryName } from '@/shared/utils/countryName'
import {
  buildSimulationDemandPayload,
  buildSimulationEconomicsPayload,
  buildSimulationSystemPayload,
} from './editSimulationDomain'

async function resolveEditedLocation(
  currentPayload: RealCreateSimulationRequest,
  nextLocationLabel: string,
): Promise<RealCreateSimulationRequest['location']> {
  if (nextLocationLabel === currentPayload.location.label) {
    return currentPayload.location
  }

  const matches = await searchLocations(nextLocationLabel, 1)
  const bestMatch = matches[0]

  if (!bestMatch) {
    throw new Error('No se pudo resolver la nueva ubicación seleccionada.')
  }

  return {
    label: bestMatch.label,
    lat: bestMatch.lat,
    lon: bestMatch.lon,
    country: resolveCountryName(bestMatch.country, bestMatch.countryCode),
    countryCode: bestMatch.countryCode.trim().toUpperCase(),
  }
}

export async function buildUpdatedSimulationPayload(
  currentSimulation: Awaited<ReturnType<typeof getRealSimulationById>>,
  values: EditSimulationValues,
): Promise<RealCreateSimulationRequest> {
  const currentPayload = currentSimulation.input

  if (values.technology !== 'solar') {
    throw new Error('Por ahora el backend real solo soporta simulaciones solares.')
  }

  const location = await resolveEditedLocation(currentPayload, values.location)

  return {
    name: values.name,
    location,
    system: buildSimulationSystemPayload(values),
    demand: buildSimulationDemandPayload(currentPayload.demand.monthlyConsumptionKwh, values),
    economics: buildSimulationEconomicsPayload(values),
  }
}
