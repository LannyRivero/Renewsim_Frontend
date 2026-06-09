import type { SimulationHistoryItem, SimulationResult } from '@/shared/types'
import { simulationDetailsSchema, type SimulationDetails } from '../schemas/simulationSchema'

type RawSimulation = Record<string, unknown>

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function normalizeEnergyType(value: string): string {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'solar' || normalized === 'wind' || normalized === 'hydro') {
    return normalized
  }

  return value
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
  const rawId = candidate.id
  const rawLocation = candidate.location && typeof candidate.location === 'object' ? (candidate.location as Record<string, unknown>) : null
  const rawClimateData = candidate.climateData && typeof candidate.climateData === 'object' ? (candidate.climateData as Record<string, unknown>) : null
  const rawFinancials = candidate.financials && typeof candidate.financials === 'object' ? (candidate.financials as Record<string, unknown>) : null

  if (typeof rawId !== 'string' && typeof rawId !== 'number') {
    throw new Error('Invalid simulation details response from server')
  }

  const normalized = {
    id: String(rawId),
    name: typeof candidate.name === 'string' ? candidate.name : undefined,
    location: rawLocation ? readString(rawLocation.name, 'N/A') : readString(candidate.location, 'N/A'),
    country: rawLocation ? readString(rawLocation.country, '') || undefined : undefined,
    locationLatitude: rawLocation ? readOptionalNumber(rawLocation.lat) : undefined,
    locationLongitude: rawLocation ? readOptionalNumber(rawLocation.lon) : undefined,
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
    roi: readOptionalNumber(rawFinancials?.roi ?? candidate.roi ?? candidate.returnOnInvestment),
    efficiency: readOptionalNumber(candidate.efficiency ?? candidate.capacityFactor),
    projectSize: readOptionalNumber(candidate.projectSize ?? candidate.installedCapacity),
    temperature: readOptionalNumber(rawClimateData?.temperature),
    climateSource: typeof rawClimateData?.source === 'string' ? rawClimateData.source : undefined,
    climatePeriod: typeof rawClimateData?.period === 'string' ? rawClimateData.period : undefined,
    irradiance: readOptionalNumber(rawClimateData?.irradiance),
    windSpeed: readOptionalNumber(rawClimateData?.windSpeed),
    hydrology: readOptionalNumber(rawClimateData?.hydrology),
    capex: readOptionalNumber(rawFinancials?.capex),
    opex: readOptionalNumber(rawFinancials?.opex),
    revenue: readOptionalNumber(rawFinancials?.revenue),
    paybackYears: readOptionalNumber(rawFinancials?.paybackYears),
    npv: readOptionalNumber(rawFinancials?.npv),
    irr: readOptionalNumber(rawFinancials?.irr),
    budget: readOptionalNumber(candidate.budget ?? rawFinancials?.capex),
    energyGenerated: readOptionalNumber(candidate.energyGenerated),
    estimatedSavings: readOptionalNumber(candidate.estimatedSavings ?? rawFinancials?.revenue),
  }

  return simulationDetailsSchema.parse(normalized)
}

export function normalizeSimulation(item: RawSimulation, index: number): SimulationHistoryItem {
  const id =
    typeof item.id === 'string' || typeof item.id === 'number'
      ? String(item.id)
      : `simulation-${index}`
  const date = formatDate(item.createdAt ?? item.date)
  const energyType = readString(item.energyType ?? item.technologyName ?? item.sourceType, 'Unknown')
  const efficiency = toPercent(item.efficiency ?? item.efficiencyPercent, 'N/A')
  const roi = toPercent(item.roi ?? item.roiPercent, 'N/A')

  return { id, date, energyType, efficiency, roi }
}
