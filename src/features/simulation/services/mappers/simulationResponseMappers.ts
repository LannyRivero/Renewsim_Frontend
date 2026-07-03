import type {
  ListUserSimulationsResponse,
  MonthlyEnergyBalanceItem,
  MonthlySeries,
  RealCreateSimulationRequest,
  RecommendationReason,
  ResolvedLocation,
  ResourceSeries,
  SimulationDetailsResponse,
  SimulationFinancialResponse,
  SimulationHistoryItem,
  SimulationHistoryRow,
  SimulationResult,
  SimulationRunStatus,
  SimulationWarning,
} from '@/shared/types'
import { simulationDetailsSchema, type SimulationDetails } from '../../schemas/simulationSchema'

type RawSimulation = Record<string, unknown>

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

function toMonthlySeries(value: unknown): MonthlySeries {
  const numbers = Array.isArray(value) ? value.map((item) => readNumber(item)) : []

  return [
    numbers[0] ?? 0,
    numbers[1] ?? 0,
    numbers[2] ?? 0,
    numbers[3] ?? 0,
    numbers[4] ?? 0,
    numbers[5] ?? 0,
    numbers[6] ?? 0,
    numbers[7] ?? 0,
    numbers[8] ?? 0,
    numbers[9] ?? 0,
    numbers[10] ?? 0,
    numbers[11] ?? 0,
  ]
}

function normalizeEnergyType(value: string): string {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'solar' || normalized === 'wind' || normalized === 'hydro') {
    return normalized
  }

  return value
}

function readLocationName(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>
    if (typeof candidate.name === 'string' && candidate.name.trim().length > 0) {
      if (typeof candidate.country === 'string' && candidate.country.trim().length > 0) {
        return `${candidate.name}, ${candidate.country}`
      }

      return candidate.name
    }
  }

  return 'Ubicación no disponible'
}

function looksLikeCoordinates(value: string): boolean {
  return /^-?\d+(?:[.,]\d+)?\s*,\s*-?\d+(?:[.,]\d+)?(?:\s*,\s*[A-Za-z]{2,})?$/.test(value.trim())
}

function inferLocationFromName(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const normalized = value.trim()
  const separatorIndex = normalized.indexOf(' - ')

  if (separatorIndex === -1) return null

  const locationPart = normalized.slice(separatorIndex + 3).trim()
  return locationPart.length > 0 ? locationPart : null
}

function toPercent(value: unknown, fallback: string): string {
  if (typeof value === 'number') return `${Math.round(value)}%`
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.includes('%') ? value : `${value}%`
  }
  return fallback
}

function formatDate(value: unknown): string {
  if (typeof value !== 'string' && typeof value !== 'number') return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function toSimulationResult(value: unknown): SimulationResult | null {
  if (!value || typeof value !== 'object') return null

  const candidate = value as Record<string, unknown>
  const rawId = candidate.id

  if (typeof rawId !== 'string' && typeof rawId !== 'number') {
    return null
  }

  const rawLocation = candidate.location
  const rawEnergyType = candidate.energyType ?? candidate.technology
  const normalizedLocation =
    typeof rawLocation === 'string'
      ? rawLocation
      : rawLocation && typeof rawLocation === 'object' && typeof (rawLocation as { name?: unknown }).name === 'string'
        ? (rawLocation as { name: string }).name
        : undefined

  return {
    id: String(rawId),
    name: typeof candidate.name === 'string' ? candidate.name : undefined,
    status: typeof candidate.status === 'string' ? candidate.status : undefined,
    createdAt: typeof candidate.createdAt === 'string' ? candidate.createdAt : undefined,
    location: normalizedLocation,
    energyType: typeof rawEnergyType === 'string' ? normalizeEnergyType(rawEnergyType) : undefined,
    roi: readOptionalNumber(candidate.roi),
    efficiency: readOptionalNumber(candidate.efficiency),
  }
}

export function toSimulationDetails(value: unknown): SimulationDetails {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid simulation details response from server')
  }

  const candidate = value as Record<string, unknown>
  const locationRecord = readRecord(candidate.location)
  const technical = readRecord(candidate.technical)
  const resource = readRecord(technical?.resource)
  const financial = readRecord(candidate.financial)
  const assumptions = readRecord(candidate.assumptions)
  const rawEconomics = readRecord(candidate.economics)
  const rawId = candidate.id
  const rawLocation = candidate.location && typeof candidate.location === 'object' ? (candidate.location as Record<string, unknown>) : null
  const rawClimateData = candidate.climateData && typeof candidate.climateData === 'object' ? (candidate.climateData as Record<string, unknown>) : null
  const rawFinancials = candidate.financials && typeof candidate.financials === 'object' ? (candidate.financials as Record<string, unknown>) : null

  if (typeof rawId !== 'string' && typeof rawId !== 'number') {
    throw new Error('Invalid simulation details response from server')
  }

  const derivedEfficiencyFromPerformanceRatio =
    typeof technical?.performanceRatio === 'number' ? Number((technical.performanceRatio * 100).toFixed(1)) : undefined

  const normalized = {
    id: String(rawId),
    name: typeof candidate.name === 'string' ? candidate.name : undefined,
    location:
      rawLocation?.name && typeof rawLocation.name === 'string'
        ? readString(rawLocation.name, 'N/A')
        : locationRecord
          ? readString(locationRecord.name ?? locationRecord.label, 'N/A')
          : readString(candidate.location, 'N/A'),
    country:
      rawLocation?.country && typeof rawLocation.country === 'string'
        ? readString(rawLocation.country, '') || undefined
        : locationRecord
          ? readString(locationRecord.country, '') || undefined
          : undefined,
    locationLatitude: rawLocation ? readOptionalNumber(rawLocation.lat) : locationRecord ? readOptionalNumber(locationRecord.lat) : undefined,
    locationLongitude: rawLocation ? readOptionalNumber(rawLocation.lon) : locationRecord ? readOptionalNumber(locationRecord.lon) : undefined,
    energyType:
      typeof candidate.energyType === 'string'
        ? normalizeEnergyType(candidate.energyType)
        : typeof candidate.technology === 'string'
          ? normalizeEnergyType(candidate.technology)
          : readString(candidate.energyType, 'Unknown'),
    createdAt:
      typeof candidate.createdAt === 'string'
        ? candidate.createdAt
        : typeof candidate.timestamp === 'string'
          ? candidate.timestamp
          : undefined,
    roi: readOptionalNumber(rawFinancials?.roi ?? candidate.roi ?? candidate.returnOnInvestment ?? financial?.irrPct),
    efficiency: readOptionalNumber(candidate.efficiency ?? candidate.capacityFactor ?? derivedEfficiencyFromPerformanceRatio),
    projectSize: readOptionalNumber(candidate.projectSize ?? candidate.installedCapacity),
    temperature: readOptionalNumber(rawClimateData?.temperature ?? toMonthlySeries(resource?.monthlyTemperatureC)[0]),
    climateSource:
      typeof rawClimateData?.source === 'string'
        ? rawClimateData.source
        : typeof resource?.source === 'string'
          ? resource.source
          : typeof assumptions?.climateSource === 'string'
            ? assumptions.climateSource
            : undefined,
    climatePeriod:
      typeof rawClimateData?.period === 'string'
        ? rawClimateData.period
        : typeof resource?.period === 'string'
          ? resource.period
          : typeof assumptions?.climatePeriod === 'string'
            ? assumptions.climatePeriod
            : undefined,
    irradiance: readOptionalNumber(rawClimateData?.irradiance ?? toMonthlySeries(resource?.monthlyIrradianceKwhM2)[0]),
    windSpeed: readOptionalNumber(rawClimateData?.windSpeed),
    hydrology: readOptionalNumber(rawClimateData?.hydrology),
    capex: readOptionalNumber(rawFinancials?.capex ?? financial?.capexTotal ?? rawEconomics?.capexTotal),
    opex: readOptionalNumber(rawFinancials?.opex ?? financial?.opexAnnual),
    revenue: readOptionalNumber(rawFinancials?.revenue ?? financial?.annualExportRevenue),
    paybackYears: readOptionalNumber(rawFinancials?.paybackYears ?? financial?.paybackYears),
    npv: readOptionalNumber(rawFinancials?.npv ?? financial?.npv),
    irr: readOptionalNumber(rawFinancials?.irr ?? financial?.irrPct),
    budget: readOptionalNumber(candidate.budget ?? rawFinancials?.capex),
    energyGenerated: readOptionalNumber(candidate.energyGenerated ?? technical?.annualGenerationKwh),
    estimatedSavings: readOptionalNumber(candidate.estimatedSavings ?? rawFinancials?.revenue ?? financial?.annualSavings),
  }

  return simulationDetailsSchema.parse(normalized)
}

export function normalizeSimulation(item: RawSimulation, index: number): SimulationHistoryItem {
  const id =
    typeof item.id === 'string' || typeof item.id === 'number'
      ? String(item.id)
      : `simulation-${index}`
  const createdAt = typeof item.createdAt === 'string' ? item.createdAt : typeof item.date === 'string' ? item.date : undefined
  const date = formatDate(createdAt)
  const rawEnergyType = item.energyType ?? item.technology ?? item.technologyName ?? item.sourceType
  const energyType = typeof rawEnergyType === 'string' ? normalizeEnergyType(rawEnergyType) : readString(rawEnergyType, 'Unknown')
  const efficiency = toPercent(item.efficiency ?? item.efficiencyPercent, 'N/A')
  const roi = toPercent(item.roi ?? item.roiPercent, 'N/A')
  const name = readString(item.name ?? item.simulationName ?? item.title, `Simulación ${index + 1}`)
  const status = readString(item.status ?? item.simulationStatus ?? item.state, 'Sin estado')
  const rawLocation = readLocationName(item.location)
  const inferredLocation = inferLocationFromName(name)
  const location = looksLikeCoordinates(rawLocation) && inferredLocation ? inferredLocation : rawLocation

  return { id, name, status, location, createdAt, date, energyType, efficiency, roi }
}

export function toResolvedLocation(value: unknown): ResolvedLocation {
  const candidate = readRecord(value)

  return {
    label: readString(candidate?.label ?? candidate?.displayLabel, 'N/A'),
    name: readString(candidate?.name, 'N/A'),
    adminRegion: typeof candidate?.adminRegion === 'string' ? candidate.adminRegion : undefined,
    country: readString(candidate?.country, 'N/A'),
    countryCode: readString(candidate?.countryCode, 'N/A'),
    lat: readNumber(candidate?.lat),
    lon: readNumber(candidate?.lon),
    timezone: typeof candidate?.timezone === 'string' ? candidate.timezone : undefined,
  }
}

function toRecommendationReasons(value: unknown): RecommendationReason[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      const candidate = readRecord(item)
      if (!candidate) return null

      const area = candidate.area
      const severity = candidate.severity
      const message = candidate.message

      if (
        (area === 'economics' || area === 'technical' || area === 'resource' || area === 'assumptions') &&
        (severity === 'positive' || severity === 'warning' || severity === 'critical') &&
        typeof message === 'string'
      ) {
        return { area, severity, message }
      }

      return null
    })
    .filter((item): item is RecommendationReason => item !== null)
}

function toSimulationWarnings(value: unknown): SimulationWarning[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      const candidate = readRecord(item)
      if (!candidate) return null

      const severity = candidate.severity
      const code = candidate.code
      const message = candidate.message

      if (
        (severity === 'info' || severity === 'warning' || severity === 'critical') &&
        typeof code === 'string' &&
        typeof message === 'string'
      ) {
        return { severity, code, message }
      }

      return null
    })
    .filter((item): item is SimulationWarning => item !== null)
}

function toResourceSeries(value: unknown): ResourceSeries {
  const candidate = readRecord(value)

  return {
    source: 'PVGIS',
    period: readString(candidate?.period, 'N/A'),
    monthlyIrradianceKwhM2: toMonthlySeries(candidate?.monthlyIrradianceKwhM2),
    monthlyTemperatureC: toMonthlySeries(candidate?.monthlyTemperatureC),
  }
}

function toMonthlyEnergyBalance(value: unknown): MonthlyEnergyBalanceItem[] {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    const candidate = readRecord(item)

    return {
      month: readString(candidate?.month, 'N/A'),
      generationKwh: readNumber(candidate?.generationKwh),
      consumptionKwh: readNumber(candidate?.consumptionKwh),
      selfConsumedKwh: readNumber(candidate?.selfConsumedKwh),
      exportedKwh: readNumber(candidate?.exportedKwh),
      importedKwh: readNumber(candidate?.importedKwh),
    }
  })
}

function toFinancialYears(value: unknown): SimulationFinancialResponse['yearlyCashFlows'] {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    const candidate = readRecord(item)

    return {
      year: readNumber(candidate?.year),
      savings: readNumber(candidate?.savings),
      exportRevenue: readNumber(candidate?.exportRevenue),
      opex: readNumber(candidate?.opex),
      replacementCost: readNumber(candidate?.replacementCost),
      netCashFlow: readNumber(candidate?.netCashFlow),
      discountedCashFlow: readNumber(candidate?.discountedCashFlow),
      cumulativeCashFlow: readNumber(candidate?.cumulativeCashFlow),
    }
  })
}

function toRealSimulationInput(value: unknown): RealCreateSimulationRequest {
  const candidate = readRecord(value)
  const location = readRecord(candidate?.location)
  const system = readRecord(candidate?.system)
  const losses = readRecord(system?.lossesPct)
  const demand = readRecord(candidate?.demand)
  const economics = readRecord(candidate?.economics)

  return {
    name: readString(candidate?.name, 'Simulation'),
    technology: 'solar',
    location: {
      label: readString(location?.label, 'N/A'),
      lat: readNumber(location?.lat),
      lon: readNumber(location?.lon),
      country: readString(location?.country, 'N/A'),
      countryCode: readString(location?.countryCode, 'N/A'),
    },
    system: {
      installedCapacityKw: readNumber(system?.installedCapacityKw),
      performanceRatio: readNumber(system?.performanceRatio),
      degradationRateAnnualPct: readNumber(system?.degradationRateAnnualPct),
      availabilityPct: readNumber(system?.availabilityPct),
      lossesPct: {
        inverter: readNumber(losses?.inverter),
        temperature: readNumber(losses?.temperature),
        wiring: readNumber(losses?.wiring),
        soiling: readNumber(losses?.soiling),
        other: readNumber(losses?.other),
      },
    },
    demand: {
      annualConsumptionKwh: readNumber(demand?.annualConsumptionKwh),
      monthlyConsumptionKwh: toMonthlySeries(demand?.monthlyConsumptionKwh),
    },
    economics: {
      currency: 'EUR',
      capexTotal: readNumber(economics?.capexTotal),
      opexAnnual: readNumber(economics?.opexAnnual),
      electricityPurchasePricePerKwh: readNumber(economics?.electricityPurchasePricePerKwh),
      exportPricePerKwh: readNumber(economics?.exportPricePerKwh),
      discountRatePct: readNumber(economics?.discountRatePct),
      projectLifetimeYears: readNumber(economics?.projectLifetimeYears),
    },
  }
}

export function toSimulationDetailsResponse(value: unknown): SimulationDetailsResponse {
  const candidate = readRecord(value)
  const summary = readRecord(candidate?.summary)
  const technical = readRecord(candidate?.technical)
  const technicalLosses = readRecord(technical?.lossesPct)
  const financial = readRecord(candidate?.financial)
  const assumptions = readRecord(candidate?.assumptions)
  const recommendation = summary?.recommendation
  const status = candidate?.status

  return {
    id: readString(candidate?.id, 'N/A'),
    status:
      status === 'draft' || status === 'processing' || status === 'completed' || status === 'failed'
        ? (status as SimulationRunStatus)
        : 'failed',
    createdAt: readString(candidate?.createdAt, ''),
    updatedAt: readString(candidate?.updatedAt, ''),
    modelVersion: readString(candidate?.modelVersion, 'unknown'),
    technology: 'solar',
    location: toResolvedLocation(candidate?.location),
    summary: {
      recommendation:
        recommendation === 'recommended' || recommendation === 'viable_with_reservations' || recommendation === 'not_recommended'
          ? recommendation
          : 'not_recommended',
      headline: readString(summary?.headline, 'N/A'),
      summary: readString(summary?.summary, 'N/A'),
      reasons: toRecommendationReasons(summary?.reasons),
    },
    input: toRealSimulationInput(candidate?.input),
    technical: {
      annualGenerationKwh: readNumber(technical?.annualGenerationKwh),
      monthlyGenerationKwh: toMonthlySeries(technical?.monthlyGenerationKwh),
      specificYieldKwhPerKwp: readNumber(technical?.specificYieldKwhPerKwp),
      performanceRatio: readNumber(technical?.performanceRatio),
      capacityFactorPct: readNumber(technical?.capacityFactorPct),
      selfConsumptionRatePct: readNumber(technical?.selfConsumptionRatePct),
      coverageRatePct: readNumber(technical?.coverageRatePct),
      resource: toResourceSeries(technical?.resource),
      lossesPct: {
        inverter: readNumber(technicalLosses?.inverter),
        temperature: readNumber(technicalLosses?.temperature),
        wiring: readNumber(technicalLosses?.wiring),
        soiling: readNumber(technicalLosses?.soiling),
        other: readNumber(technicalLosses?.other),
        total: readNumber(technicalLosses?.total),
      },
      balanceByMonth: toMonthlyEnergyBalance(technical?.balanceByMonth),
    },
    financial: {
      currency: 'EUR',
      annualSavings: readNumber(financial?.annualSavings),
      annualExportRevenue: readNumber(financial?.annualExportRevenue),
      netAnnualBenefit: readNumber(financial?.netAnnualBenefit),
      paybackYears: readOptionalNumber(financial?.paybackYears) ?? null,
      discountedPaybackYears: readOptionalNumber(financial?.discountedPaybackYears) ?? null,
      npv: readNumber(financial?.npv),
      irrPct: readOptionalNumber(financial?.irrPct) ?? null,
      lcoePerKwh: readNumber(financial?.lcoePerKwh),
      yearlyCashFlows: toFinancialYears(financial?.yearlyCashFlows),
    },
    assumptions: {
      discountRatePct: readNumber(assumptions?.discountRatePct),
      projectLifetimeYears: readNumber(assumptions?.projectLifetimeYears),
      degradationRateAnnualPct: readNumber(assumptions?.degradationRateAnnualPct),
      electricityPurchasePricePerKwh: readNumber(assumptions?.electricityPurchasePricePerKwh),
      exportPricePerKwh: readNumber(assumptions?.exportPricePerKwh),
      climateSource: 'PVGIS',
      climatePeriod: readString(assumptions?.climatePeriod, 'N/A'),
    },
    warnings: toSimulationWarnings(candidate?.warnings),
  }
}

export function toSimulationHistoryRow(value: unknown): SimulationHistoryRow {
  const candidate = readRecord(value)
  const status = candidate?.status
  const recommendation = candidate?.recommendation

  return {
    id: readString(candidate?.id, 'N/A'),
    name: readString(candidate?.name, 'Simulation'),
    technology: 'solar',
    status:
      status === 'draft' || status === 'processing' || status === 'completed' || status === 'failed'
        ? (status as SimulationRunStatus)
        : 'failed',
    createdAt: readString(candidate?.createdAt, ''),
    locationLabel: readString(candidate?.locationLabel, 'N/A'),
    annualGenerationKwh: readNumber(candidate?.annualGenerationKwh),
    annualSavings: readNumber(candidate?.annualSavings),
    npv: readNumber(candidate?.npv),
    irrPct: readOptionalNumber(candidate?.irrPct) ?? null,
    recommendation:
      recommendation === 'recommended' || recommendation === 'viable_with_reservations' || recommendation === 'not_recommended'
        ? recommendation
        : 'not_recommended',
    modelVersion: readString(candidate?.modelVersion, 'unknown'),
    resourceSource: 'PVGIS',
  }
}

export function toListUserSimulationsResponse(value: unknown): ListUserSimulationsResponse {
  const candidate = readRecord(value)
  const rawItems = Array.isArray(candidate?.items) ? candidate.items : Array.isArray(value) ? value : []

  return {
    items: rawItems.map((item) => toSimulationHistoryRow(item)),
    total: typeof candidate?.total === 'number' ? candidate.total : rawItems.length,
  }
}
