import type { SimulationCreateFormInput } from './simulationCreateSchema'
import {
  DEFAULT_AVAILABILITY_PCT,
  DEFAULT_COORDINATE,
  DEFAULT_DEGRADATION_RATE_ANNUAL_PCT,
  DEFAULT_DISCOUNT_RATE_PCT,
  DEFAULT_EXPORT_PRICE_PER_KWH,
  DEFAULT_OPEX_ANNUAL,
  DEFAULT_PERFORMANCE_RATIO,
  DEFAULT_PROJECT_LIFETIME_YEARS,
  DEFAULT_SYSTEM_LOSSES_PCT,
  MONTHS_PER_YEAR,
} from './simulationSchemaConstants'

export const DEFAULT_MONTHLY_CONSUMPTION = Array.from({ length: MONTHS_PER_YEAR }, () => 0) as [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

export const DEFAULT_SIMULATION_FORM_VALUES: SimulationCreateFormInput = {
  name: '',
  technology: 'solar',
  locationSearch: '',
  location: {
    label: '',
    lat: DEFAULT_COORDINATE,
    lon: DEFAULT_COORDINATE,
    country: '',
    countryCode: '',
  },
  system: {
    installedCapacityKw: '',
    performanceRatio: DEFAULT_PERFORMANCE_RATIO,
    degradationRateAnnualPct: DEFAULT_DEGRADATION_RATE_ANNUAL_PCT,
    availabilityPct: DEFAULT_AVAILABILITY_PCT,
    lossesPct: { ...DEFAULT_SYSTEM_LOSSES_PCT },
  },
  demand: {
    annualConsumptionKwh: '',
    monthlyConsumptionKwh: [...DEFAULT_MONTHLY_CONSUMPTION],
  },
  economics: {
    currency: 'EUR',
    capexTotal: '',
    opexAnnual: DEFAULT_OPEX_ANNUAL,
    electricityPurchasePricePerKwh: '',
    exportPricePerKwh: DEFAULT_EXPORT_PRICE_PER_KWH,
    discountRatePct: DEFAULT_DISCOUNT_RATE_PCT,
    projectLifetimeYears: DEFAULT_PROJECT_LIFETIME_YEARS,
  },
}
