import type { EditSimulationValues } from '../schemas/simulationSchema'
import type { SimulationDetailsResponse, SimulationResult } from '@/shared/types'
import {
  buildSimulationDemandDefaults,
  buildSimulationEconomicsDefaults,
  buildSimulationSystemDefaults,
  parseSimulationDemand,
  parseSimulationEconomics,
  parseSimulationSystem,
} from './editSimulationDomain'

export type EditSimulationFormDefaults = EditSimulationValues & {
  technologyLabel: string
}

const LOSS_FIELDS = ['inverter', 'temperature', 'wiring', 'soiling', 'other'] as const
function toTechnologyLabel(energyType?: string | null): string {
  const normalized = energyType?.toLowerCase()

  if (normalized === 'wind') return 'Eólica'
  if (normalized === 'hydro') return 'Hidroeléctrica'
  return 'Solar'
}

function buildDefaultIdentity(data: SimulationDetailsResponse | null | undefined, lastResult: SimulationResult | null) {
  const energyType = data?.technology ?? lastResult?.energyType ?? 'solar'

  return {
    name: data?.input.name ?? lastResult?.name ?? `${toTechnologyLabel(energyType)} Simulación`,
    location: data?.location.label ?? lastResult?.location ?? 'San Francisco, CA',
    technology: 'solar' as const,
    technologyLabel: toTechnologyLabel(energyType),
  }
}

export function buildEditSimulationFormDefaults({
  data,
  lastResult,
}: {
  data: SimulationDetailsResponse | null | undefined
  lastResult: SimulationResult | null
}): EditSimulationFormDefaults {
  return {
    ...buildDefaultIdentity(data, lastResult),
    ...buildSimulationSystemDefaults(data),
    ...buildSimulationDemandDefaults(data),
    ...buildSimulationEconomicsDefaults(data),
  }
}

export function parseEditSimulationForm(form: FormData): EditSimulationValues {
  return {
    name: String(form.get('name') ?? ''),
    location: String(form.get('location') ?? ''),
    technology: 'solar',
    ...parseSimulationSystem(form),
    ...parseSimulationDemand(form),
    ...parseSimulationEconomics(form),
  }
}

export { LOSS_FIELDS }
