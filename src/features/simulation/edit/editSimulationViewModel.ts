import type { EditSimulationValues, SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

export type EnergySourceOption = 'Paneles solares' | 'Turbina eólica' | 'Hidroeléctrica'

export type EditSimulationFormDefaults = EditSimulationValues & {
  energySource: EnergySourceOption
}

const DEFAULT_FORM_VALUES: Omit<EditSimulationFormDefaults, 'simulationName' | 'location' | 'energySource'> = {
  systemSizeKw: 7.5,
  annualConsumptionKwh: 10000,
  incentives: 1500,
  electricityRate: 0.18,
}

function toEnergySourceOption(energyType?: string | null): EnergySourceOption {
  const normalized = energyType?.toLowerCase()

  if (normalized === 'wind') return 'Turbina eólica'
  if (normalized === 'hydro') return 'Hidroeléctrica'
  return 'Paneles solares'
}

export function toNormalizedEnergyType(energySource: string): 'solar' | 'wind' | 'hydro' {
  if (energySource === 'Turbina eólica') return 'wind'
  if (energySource === 'Hidroeléctrica') return 'hydro'
  return 'solar'
}

export function buildEditSimulationFormDefaults({
  data,
  lastResult,
}: {
  data: SimulationDetails | null | undefined
  lastResult: SimulationResult | null
}): EditSimulationFormDefaults {
  const energyType = data?.energyType ?? lastResult?.energyType ?? 'Energía'
  const location = data?.location ?? lastResult?.location ?? 'San Francisco, CA'

  return {
    simulationName: `${energyType} Simulación`,
    location,
    energySource: toEnergySourceOption(data?.energyType ?? lastResult?.energyType),
    ...DEFAULT_FORM_VALUES,
  }
}

export function parseEditSimulationForm(form: FormData): EditSimulationValues {
  return {
    simulationName: String(form.get('simulationName') ?? ''),
    location: String(form.get('location') ?? ''),
    energySource: String(form.get('energySource') ?? ''),
    systemSizeKw: Number(form.get('systemSizeKw') ?? 0),
    annualConsumptionKwh: Number(form.get('annualConsumptionKwh') ?? 0),
    incentives: Number(form.get('incentives') ?? 0),
    electricityRate: Number(form.get('electricityRate') ?? 0),
  }
}
