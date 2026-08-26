import type { SimulationResult } from '@/shared/types'
import { simulationDetailsSchema, type SimulationDetails } from '../../schemas/simulationSchema'
import {
  normalizeEnergyType,
  readOptionalNumber,
  readRecord,
  readString,
  toMonthlySeries,
} from './simulationResponseMappers.shared'

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
