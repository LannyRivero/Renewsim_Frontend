import type {
  CurrencyCode,
  MonthlySeries,
  RecommendationStatus,
  SimulationRunStatus,
  SimulationSystemLosses,
  WarningSeverity,
} from './simulation'
import type { ResolvedLocation } from './simulation-location'

export interface RealSimulationSystemInput {
  installedCapacityKw: number
  performanceRatio: number
  degradationRateAnnualPct: number
  availabilityPct: number
  lossesPct: SimulationSystemLosses
}

export interface RealSimulationDemandInput {
  annualConsumptionKwh: number
  monthlyConsumptionKwh: MonthlySeries
}

export interface RealSimulationEconomicsInput {
  currency: CurrencyCode
  capexTotal: number
  opexAnnual: number
  electricityPurchasePricePerKwh: number
  exportPricePerKwh: number
  discountRatePct: number
  projectLifetimeYears: number
}

export interface RealCreateSimulationRequest {
  name: string
  energyType: string
  location: {
    label: string
    lat: number
    lon: number
    country: string
    countryCode: string
  }
  system: RealSimulationSystemInput
  demand: RealSimulationDemandInput
  economics: RealSimulationEconomicsInput
}

export interface RecommendationReason {
  area: 'economics' | 'technical' | 'resource' | 'assumptions'
  severity: 'positive' | 'warning' | 'critical'
  message: string
}

export interface SimulationWarning {
  severity: WarningSeverity
  code: string
  message: string
}

export interface ResourceSeries {
  source: 'PVGIS'
  period: string
  monthlyIrradianceKwhM2: MonthlySeries
  monthlyTemperatureC: MonthlySeries
}

export interface MonthlyEnergyBalanceItem {
  month: string
  generationKwh: number
  consumptionKwh: number
  selfConsumedKwh: number
  exportedKwh: number
  importedKwh: number
}

export interface FinancialYearItem {
  year: number
  savings: number
  exportRevenue: number
  opex: number
  replacementCost: number
  netCashFlow: number
  discountedCashFlow: number
  cumulativeCashFlow: number
}

export interface SimulationSummaryResponse {
  recommendation: RecommendationStatus
  headline: string
  summary: string
  reasons: RecommendationReason[]
}

export interface SimulationTechnicalResponse {
  annualGenerationKwh: number
  monthlyGenerationKwh: MonthlySeries
  specificYieldKwhPerKwp: number
  performanceRatio: number
  capacityFactorPct: number
  selfConsumptionRatePct: number
  coverageRatePct: number
  resource: ResourceSeries
  lossesPct: SimulationSystemLosses & {
    total: number
  }
  balanceByMonth: MonthlyEnergyBalanceItem[]
}

export interface SimulationFinancialResponse {
  currency: CurrencyCode
  annualSavings: number
  annualExportRevenue: number
  netAnnualBenefit: number
  paybackYears: number | null
  discountedPaybackYears: number | null
  npv: number
  irrPct: number | null
  lcoePerKwh: number
  yearlyCashFlows: FinancialYearItem[]
}

export interface SimulationAssumptionsResponse {
  discountRatePct: number
  projectLifetimeYears: number
  degradationRateAnnualPct: number
  electricityPurchasePricePerKwh: number
  exportPricePerKwh: number
  climateSource: 'PVGIS'
  climatePeriod: string
}

export interface SimulationDetailsResponse {
  id: string
  status: SimulationRunStatus
  createdAt: string
  updatedAt: string
  modelVersion: string
  technology: SimulationTechnology
  location: ResolvedLocation
  summary: SimulationSummaryResponse
  input: RealCreateSimulationRequest
  technical: SimulationTechnicalResponse
  financial: SimulationFinancialResponse
  assumptions: SimulationAssumptionsResponse
  warnings: SimulationWarning[]
}

export interface SimulationHistoryRow {
  id: string
  name: string
  technology: SimulationTechnology
  status: SimulationRunStatus
  createdAt: string
  locationLabel: string
  annualGenerationKwh: number
  annualSavings: number
  npv: number
  irrPct: number | null
  recommendation: RecommendationStatus
  modelVersion: string
  resourceSource: 'PVGIS'
}

export interface ListUserSimulationsResponse {
  items: SimulationHistoryRow[]
  total: number
}

export interface SimulationReportResponse extends SimulationDetailsResponse {
  report: {
    generatedAt: string
    generatedBy: string
    locale: string
  }
}

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}
