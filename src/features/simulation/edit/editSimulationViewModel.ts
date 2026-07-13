import type { EditSimulationValues } from '../schemas/simulationSchema'
import type { SimulationDetailsResponse, SimulationResult, SimulationSystemLosses } from '@/shared/types'

export type EditSimulationFormDefaults = EditSimulationValues & {
  technologyLabel: string
}

const LOSS_FIELDS = ['inverter', 'temperature', 'wiring', 'soiling', 'other'] as const
const DEFAULT_LOSSES: SimulationSystemLosses = {
  inverter: 0,
  temperature: 0,
  wiring: 0,
  soiling: 0,
  other: 0,
}
const DEFAULT_MONTHLY_CONSUMPTION: EditSimulationValues['monthlyConsumptionKwh'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

const DEFAULT_FORM_VALUES: Omit<EditSimulationFormDefaults, 'name' | 'location' | 'technology' | 'technologyLabel'> = {
  installedCapacityKw: 7.5,
  performanceRatio: 0.81,
  degradationRateAnnualPct: 0.5,
  availabilityPct: 99,
  lossesPct: DEFAULT_LOSSES,
  annualConsumptionKwh: 10000,
  monthlyConsumptionKwh: DEFAULT_MONTHLY_CONSUMPTION,
  capexTotal: 315000,
  currency: 'EUR',
  opexAnnual: 7200,
  electricityPurchasePricePerKwh: 0.18,
  exportPricePerKwh: 0.07,
  discountRatePct: 8,
  projectLifetimeYears: 20,
}

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

function buildDefaultSystem(data: SimulationDetailsResponse | null | undefined) {
  return {
    installedCapacityKw: data?.input.system.installedCapacityKw ?? DEFAULT_FORM_VALUES.installedCapacityKw,
    performanceRatio: data?.input.system.performanceRatio ?? DEFAULT_FORM_VALUES.performanceRatio,
    degradationRateAnnualPct: data?.input.system.degradationRateAnnualPct ?? DEFAULT_FORM_VALUES.degradationRateAnnualPct,
    availabilityPct: data?.input.system.availabilityPct ?? DEFAULT_FORM_VALUES.availabilityPct,
    lossesPct: data?.input.system.lossesPct ?? DEFAULT_FORM_VALUES.lossesPct,
  }
}

function buildDefaultDemand(data: SimulationDetailsResponse | null | undefined) {
  return {
    annualConsumptionKwh: data?.input.demand.annualConsumptionKwh ?? DEFAULT_FORM_VALUES.annualConsumptionKwh,
    monthlyConsumptionKwh: data?.input.demand.monthlyConsumptionKwh ?? DEFAULT_FORM_VALUES.monthlyConsumptionKwh,
  }
}

function buildDefaultEconomics(data: SimulationDetailsResponse | null | undefined) {
  return {
    capexTotal: data?.input.economics.capexTotal ?? DEFAULT_FORM_VALUES.capexTotal,
    currency: data?.input.economics.currency ?? DEFAULT_FORM_VALUES.currency,
    opexAnnual: data?.input.economics.opexAnnual ?? DEFAULT_FORM_VALUES.opexAnnual,
    electricityPurchasePricePerKwh:
      data?.input.economics.electricityPurchasePricePerKwh ?? DEFAULT_FORM_VALUES.electricityPurchasePricePerKwh,
    exportPricePerKwh: data?.input.economics.exportPricePerKwh ?? DEFAULT_FORM_VALUES.exportPricePerKwh,
    discountRatePct: data?.input.economics.discountRatePct ?? DEFAULT_FORM_VALUES.discountRatePct,
    projectLifetimeYears: data?.input.economics.projectLifetimeYears ?? DEFAULT_FORM_VALUES.projectLifetimeYears,
  }
}

function readNumber(form: FormData, key: string) {
  return Number(form.get(key) ?? 0)
}

function parseLosses(form: FormData): SimulationSystemLosses {
  return {
    inverter: readNumber(form, 'lossesPct.inverter'),
    temperature: readNumber(form, 'lossesPct.temperature'),
    wiring: readNumber(form, 'lossesPct.wiring'),
    soiling: readNumber(form, 'lossesPct.soiling'),
    other: readNumber(form, 'lossesPct.other'),
  }
}

function parseMonthlyConsumption(form: FormData): EditSimulationValues['monthlyConsumptionKwh'] {
  return Array.from({ length: 12 }, (_, index) => readNumber(form, `monthlyConsumptionKwh.${index}`)) as EditSimulationValues['monthlyConsumptionKwh']
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
    ...buildDefaultSystem(data),
    ...buildDefaultDemand(data),
    ...buildDefaultEconomics(data),
  }
}

export function parseEditSimulationForm(form: FormData): EditSimulationValues {
  return {
    name: String(form.get('name') ?? ''),
    location: String(form.get('location') ?? ''),
    technology: 'solar',
    installedCapacityKw: readNumber(form, 'installedCapacityKw'),
    performanceRatio: readNumber(form, 'performanceRatio'),
    degradationRateAnnualPct: readNumber(form, 'degradationRateAnnualPct'),
    availabilityPct: readNumber(form, 'availabilityPct'),
    lossesPct: parseLosses(form),
    annualConsumptionKwh: readNumber(form, 'annualConsumptionKwh'),
    monthlyConsumptionKwh: parseMonthlyConsumption(form),
    capexTotal: readNumber(form, 'capexTotal'),
    currency: 'EUR',
    opexAnnual: readNumber(form, 'opexAnnual'),
    electricityPurchasePricePerKwh: readNumber(form, 'electricityPurchasePricePerKwh'),
    exportPricePerKwh: readNumber(form, 'exportPricePerKwh'),
    discountRatePct: readNumber(form, 'discountRatePct'),
    projectLifetimeYears: readNumber(form, 'projectLifetimeYears'),
  }
}

export { LOSS_FIELDS }
