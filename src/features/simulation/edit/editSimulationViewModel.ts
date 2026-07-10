import type { EditSimulationValues } from '../schemas/simulationSchema'
import type { SimulationDetailsResponse, SimulationResult } from '@/shared/types'

export type EnergySourceOption = 'Paneles solares' | 'Turbina eólica' | 'Hidroeléctrica'

export type EditSimulationFormDefaults = EditSimulationValues & {
  energySource: EnergySourceOption
}

const DEFAULT_FORM_VALUES: Omit<EditSimulationFormDefaults, 'simulationName' | 'location' | 'energySource'> = {
  systemSizeKw: 7.5,
  annualConsumptionKwh: 10000,
  incentives: 0,
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
  data: SimulationDetailsResponse | null | undefined
  lastResult: SimulationResult | null
}): EditSimulationFormDefaults {
  const energyType = data?.technology ?? lastResult?.energyType ?? 'Energía'
  const location = data?.location.label ?? lastResult?.location ?? 'San Francisco, CA'
  const simulationName = data?.input.name ?? lastResult?.name ?? `${energyType} Simulación`

  return {
    simulationName,
    location,
    energySource: toEnergySourceOption(data?.technology ?? lastResult?.energyType),
    systemSizeKw: data?.input.system.installedCapacityKw ?? DEFAULT_FORM_VALUES.systemSizeKw,
    annualConsumptionKwh: data?.input.demand.annualConsumptionKwh ?? DEFAULT_FORM_VALUES.annualConsumptionKwh,
    incentives: DEFAULT_FORM_VALUES.incentives,
    electricityRate: data?.input.economics.electricityPurchasePricePerKwh ?? DEFAULT_FORM_VALUES.electricityRate,
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
