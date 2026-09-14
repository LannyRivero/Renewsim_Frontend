import type { EditSimulationValues } from '../schemas/simulationSchema'
import type { MonthlySeries, RealCreateSimulationRequest, SimulationDetailsResponse, SimulationSystemLosses } from '@/shared/types'

const DEFAULT_LOSSES: SimulationSystemLosses = {
  inverter: 0,
  temperature: 0,
  wiring: 0,
  soiling: 0,
  other: 0,
}

const DEFAULT_MONTHLY_CONSUMPTION: EditSimulationValues['monthlyConsumptionKwh'] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

export const DEFAULT_EDIT_SIMULATION_SYSTEM: Pick<
  EditSimulationValues,
  'installedCapacityKw' | 'performanceRatio' | 'degradationRateAnnualPct' | 'availabilityPct' | 'lossesPct'
> = {
  installedCapacityKw: 7.5,
  performanceRatio: 0.81,
  degradationRateAnnualPct: 0.5,
  availabilityPct: 99,
  lossesPct: DEFAULT_LOSSES,
}

export const DEFAULT_EDIT_SIMULATION_DEMAND: Pick<
  EditSimulationValues,
  'annualConsumptionKwh' | 'monthlyConsumptionKwh'
> = {
  annualConsumptionKwh: 10000,
  monthlyConsumptionKwh: DEFAULT_MONTHLY_CONSUMPTION,
}

export const DEFAULT_EDIT_SIMULATION_ECONOMICS: Pick<
  EditSimulationValues,
  'capexTotal' | 'currency' | 'opexAnnual' | 'electricityPurchasePricePerKwh' | 'exportPricePerKwh' | 'discountRatePct' | 'projectLifetimeYears'
> = {
  capexTotal: 315000,
  currency: 'EUR',
  opexAnnual: 7200,
  electricityPurchasePricePerKwh: 0.18,
  exportPricePerKwh: 0.07,
  discountRatePct: 8,
  projectLifetimeYears: 20,
}

export function buildSimulationSystemDefaults(data: SimulationDetailsResponse | null | undefined) {
  return {
    installedCapacityKw: data?.input.system.installedCapacityKw ?? DEFAULT_EDIT_SIMULATION_SYSTEM.installedCapacityKw,
    performanceRatio: data?.input.system.performanceRatio ?? DEFAULT_EDIT_SIMULATION_SYSTEM.performanceRatio,
    degradationRateAnnualPct: data?.input.system.degradationRateAnnualPct ?? DEFAULT_EDIT_SIMULATION_SYSTEM.degradationRateAnnualPct,
    availabilityPct: data?.input.system.availabilityPct ?? DEFAULT_EDIT_SIMULATION_SYSTEM.availabilityPct,
    lossesPct: data?.input.system.lossesPct ?? DEFAULT_EDIT_SIMULATION_SYSTEM.lossesPct,
  }
}

export function buildSimulationDemandDefaults(data: SimulationDetailsResponse | null | undefined) {
  return {
    annualConsumptionKwh: data?.input.demand.annualConsumptionKwh ?? DEFAULT_EDIT_SIMULATION_DEMAND.annualConsumptionKwh,
    monthlyConsumptionKwh: data?.input.demand.monthlyConsumptionKwh ?? DEFAULT_EDIT_SIMULATION_DEMAND.monthlyConsumptionKwh,
  }
}

export function buildSimulationEconomicsDefaults(data: SimulationDetailsResponse | null | undefined) {
  return {
    capexTotal: data?.input.economics.capexTotal ?? DEFAULT_EDIT_SIMULATION_ECONOMICS.capexTotal,
    currency: data?.input.economics.currency ?? DEFAULT_EDIT_SIMULATION_ECONOMICS.currency,
    opexAnnual: data?.input.economics.opexAnnual ?? DEFAULT_EDIT_SIMULATION_ECONOMICS.opexAnnual,
    electricityPurchasePricePerKwh:
      data?.input.economics.electricityPurchasePricePerKwh ?? DEFAULT_EDIT_SIMULATION_ECONOMICS.electricityPurchasePricePerKwh,
    exportPricePerKwh: data?.input.economics.exportPricePerKwh ?? DEFAULT_EDIT_SIMULATION_ECONOMICS.exportPricePerKwh,
    discountRatePct: data?.input.economics.discountRatePct ?? DEFAULT_EDIT_SIMULATION_ECONOMICS.discountRatePct,
    projectLifetimeYears: data?.input.economics.projectLifetimeYears ?? DEFAULT_EDIT_SIMULATION_ECONOMICS.projectLifetimeYears,
  }
}

function readNumber(form: FormData, key: string) {
  return Number(form.get(key) ?? 0)
}

export function parseSimulationSystem(form: FormData): Pick<
  EditSimulationValues,
  'installedCapacityKw' | 'performanceRatio' | 'degradationRateAnnualPct' | 'availabilityPct' | 'lossesPct'
> {
  return {
    installedCapacityKw: readNumber(form, 'installedCapacityKw'),
    performanceRatio: readNumber(form, 'performanceRatio'),
    degradationRateAnnualPct: readNumber(form, 'degradationRateAnnualPct'),
    availabilityPct: readNumber(form, 'availabilityPct'),
    lossesPct: {
      inverter: readNumber(form, 'lossesPct.inverter'),
      temperature: readNumber(form, 'lossesPct.temperature'),
      wiring: readNumber(form, 'lossesPct.wiring'),
      soiling: readNumber(form, 'lossesPct.soiling'),
      other: readNumber(form, 'lossesPct.other'),
    },
  }
}

export function parseSimulationDemand(form: FormData): Pick<
  EditSimulationValues,
  'annualConsumptionKwh' | 'monthlyConsumptionKwh'
> {
  return {
    annualConsumptionKwh: readNumber(form, 'annualConsumptionKwh'),
    monthlyConsumptionKwh: Array.from({ length: 12 }, (_, index) => readNumber(form, `monthlyConsumptionKwh.${index}`)) as EditSimulationValues['monthlyConsumptionKwh'],
  }
}

export function parseSimulationEconomics(form: FormData): Pick<
  EditSimulationValues,
  'capexTotal' | 'currency' | 'opexAnnual' | 'electricityPurchasePricePerKwh' | 'exportPricePerKwh' | 'discountRatePct' | 'projectLifetimeYears'
> {
  return {
    capexTotal: readNumber(form, 'capexTotal'),
    currency: 'EUR',
    opexAnnual: readNumber(form, 'opexAnnual'),
    electricityPurchasePricePerKwh: readNumber(form, 'electricityPurchasePricePerKwh'),
    exportPricePerKwh: readNumber(form, 'exportPricePerKwh'),
    discountRatePct: readNumber(form, 'discountRatePct'),
    projectLifetimeYears: readNumber(form, 'projectLifetimeYears'),
  }
}

function scaleMonthlyConsumptionKwh(monthlyPattern: MonthlySeries, nextAnnualConsumptionKwh: number): MonthlySeries {
  const currentTotal = monthlyPattern.reduce((sum, value) => sum + value, 0)

  if (currentTotal <= 0) {
    const monthlyBase = Number((nextAnnualConsumptionKwh / 12).toFixed(2))
    const values = Array.from({ length: 12 }, () => monthlyBase)
    values[11] = Number((nextAnnualConsumptionKwh - monthlyBase * 11).toFixed(2))
    return values as MonthlySeries
  }

  const scaled = monthlyPattern.map((value) => Number(((value / currentTotal) * nextAnnualConsumptionKwh).toFixed(2)))
  const scaledTotal = scaled.reduce((sum, value) => sum + value, 0)
  scaled[11] = Number((scaled[11] + (nextAnnualConsumptionKwh - scaledTotal)).toFixed(2))

  return scaled as MonthlySeries
}

function monthlyConsumptionApproximatelyMatchesAnnual(monthlyConsumptionKwh: MonthlySeries, annualConsumptionKwh: number) {
  const monthlyTotal = monthlyConsumptionKwh.reduce((sum, value) => sum + value, 0)
  return Math.abs(monthlyTotal - annualConsumptionKwh) <= 0.5
}

export function buildSimulationSystemPayload(values: EditSimulationValues): RealCreateSimulationRequest['system'] {
  return {
    installedCapacityKw: values.installedCapacityKw,
    performanceRatio: values.performanceRatio,
    degradationRateAnnualPct: values.degradationRateAnnualPct,
    availabilityPct: values.availabilityPct,
    lossesPct: values.lossesPct,
  }
}

export function buildSimulationDemandPayload(
  currentMonthly: MonthlySeries,
  values: EditSimulationValues,
): RealCreateSimulationRequest['demand'] {
  const submittedMonthly = values.monthlyConsumptionKwh as MonthlySeries
  const monthlyPattern = submittedMonthly.some((value) => value > 0) ? submittedMonthly : currentMonthly
  const monthlyConsumptionKwh = monthlyConsumptionApproximatelyMatchesAnnual(monthlyPattern, values.annualConsumptionKwh)
    ? monthlyPattern
    : scaleMonthlyConsumptionKwh(monthlyPattern, values.annualConsumptionKwh)

  return {
    annualConsumptionKwh: values.annualConsumptionKwh,
    monthlyConsumptionKwh,
  }
}

export function buildSimulationEconomicsPayload(values: EditSimulationValues): RealCreateSimulationRequest['economics'] {
  return {
    capexTotal: values.capexTotal,
    currency: values.currency,
    opexAnnual: values.opexAnnual,
    electricityPurchasePricePerKwh: values.electricityPurchasePricePerKwh,
    exportPricePerKwh: values.exportPricePerKwh,
    discountRatePct: values.discountRatePct,
    projectLifetimeYears: values.projectLifetimeYears,
  }
}
