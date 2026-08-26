import { httpClient } from '@/services/httpClient'
import { formatKg, formatKwh, formatPercent } from './dashboardFormatters'
import type { DashboardData } from './dashboardTypes'

type ApiResponse<T> = {
  data?: T
}

type DashboardSummaryApi = {
  stats?: {
    totalSimulations?: unknown
    totalEnergyGeneratedKwh?: unknown
    totalCo2SavedKg?: unknown
    averageRoiPercent?: unknown
  }
  summary?: {
    totalSimulations?: unknown
    activeSimulations?: unknown
    averageRoiPercent?: unknown
    medianPaybackYears?: unknown
    totalEnergyGeneratedKwh?: unknown
    totalCo2SavedKg?: unknown
    atRiskCount?: unknown
  }
  energyBySource?: unknown
  recommendedScenario?: unknown
  prioritizedScenarios?: unknown
  riskAlerts?: unknown
  distribution?: {
    byTechnology?: unknown
    byStatus?: unknown
  }
  efficiencyMetrics?: unknown
  targetVsActual?: unknown
}

type DashboardTargetUnit = DashboardData['targetVsActual'][number]['unit']

const VALID_TARGET_UNITS: DashboardTargetUnit[] = ['kWh', 'kg', '%']

function createEmptyDashboardData(): DashboardData {
  return {
    summary: {
      totalSimulations: 0,
      activeSimulations: null,
      averageRoiPercent: null,
      medianPaybackYears: null,
      totalEnergyGeneratedKwh: null,
      totalCo2SavedKg: null,
      atRiskCount: null,
    },
    stats: [
      { label: 'Simulaciones totales', value: '0', icon: 'insights' },
      { label: 'CO2 evitado', value: 'N/D', icon: 'eco' },
      { label: 'ROI promedio', value: 'N/D', icon: 'trending_up' },
      { label: 'Energía generada', value: 'N/D', icon: 'bolt' },
    ],
    energyBySource: [],
    distribution: [],
    statusDistribution: [],
    efficiencyMetrics: [],
    targetVsActual: [],
    recommendedScenario: null,
    prioritizedScenarios: [],
    riskAlerts: [],
  }
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function toNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function isDashboardSummaryApi(value: unknown): value is DashboardSummaryApi {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Record<string, unknown>
  return 'stats' in candidate || 'summary' in candidate || 'distribution' in candidate || 'recommendedScenario' in candidate
}

function isHttpNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if (!('response' in error)) return false

  const response = (error as { response?: { status?: unknown } }).response
  return response?.status === 404
}

function extractSummaryPayload(payload: unknown): DashboardSummaryApi | null {
  if (isDashboardSummaryApi(payload)) {
    return payload
  }

  if (payload && typeof payload === 'object' && 'data' in (payload as Record<string, unknown>)) {
    const nested = (payload as ApiResponse<unknown>).data
    if (isDashboardSummaryApi(nested)) {
      return nested
    }
  }

  return null
}

function mapEnergyBySource(value: unknown): DashboardData['energyBySource'] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const label = toNonEmptyString(item.label)
      const kwh = toFiniteNumber(item.kwh ?? item.energyKwh)

      if (label === null || kwh === null) {
        return null
      }

      return { label, kwh }
    })
    .filter((item): item is DashboardData['energyBySource'][number] => item !== null)
}

function mapStatusDistribution(value: unknown): DashboardData['statusDistribution'] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const label = toNonEmptyString(item.label)
      const count = toFiniteNumber(item.count)

      if (label === null || count === null) return null

      return { label, count: Math.trunc(count) }
    })
    .filter((item): item is DashboardData['statusDistribution'][number] => item !== null)
}

function mapRecommendedScenario(value: unknown): DashboardData['recommendedScenario'] {
  if (value === null) return null
  if (!value || typeof value !== 'object') return null

  const item = value as Record<string, unknown>
  const id = toNonEmptyString(item.id)
  const name = toNonEmptyString(item.name)
  const technology = toNonEmptyString(item.technology)
  const location = toNonEmptyString(item.location)
  const priority = toNonEmptyString(item.priority)
  const headline = toNonEmptyString(item.headline)
  const mainRisk = toNonEmptyString(item.mainRisk)
  const nextStep = toNonEmptyString(item.nextStep)
  const drivers = Array.isArray(item.drivers) ? item.drivers.map(toNonEmptyString).filter((driver): driver is string => driver !== null) : []

  if (!id || !name || !technology || !location || !priority || !headline || !mainRisk || !nextStep) {
    return null
  }

  return {
    id,
    name,
    technology,
    location,
    roiPercent: toFiniteNumber(item.roiPercent),
    paybackYears: toFiniteNumber(item.paybackYears),
    capex: toFiniteNumber(item.capex),
    estimatedAnnualSavings: toFiniteNumber(item.estimatedAnnualSavings),
    priority,
    headline,
    drivers,
    mainRisk,
    nextStep,
  }
}

function mapPrioritizedScenarios(value: unknown): DashboardData['prioritizedScenarios'] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const id = toNonEmptyString(item.id)
      const name = toNonEmptyString(item.name)
      const technology = toNonEmptyString(item.technology)
      const status = toNonEmptyString(item.status)
      const location = toNonEmptyString(item.location)
      const priority = toNonEmptyString(item.priority)

      if (!id || !name || !technology || !status || !location || !priority) return null

      return {
        id,
        name,
        technology,
        status,
        location,
        roiPercent: toFiniteNumber(item.roiPercent),
        paybackYears: toFiniteNumber(item.paybackYears),
        capex: toFiniteNumber(item.capex),
        estimatedAnnualSavings: toFiniteNumber(item.estimatedAnnualSavings),
        priority,
        score: toFiniteNumber(item.score),
      }
    })
    .filter((item): item is DashboardData['prioritizedScenarios'][number] => item !== null)
}

function mapRiskAlerts(value: unknown): DashboardData['riskAlerts'] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const type = toNonEmptyString(item.type)
      const severity = toNonEmptyString(item.severity)
      const message = toNonEmptyString(item.message)
      const count = toFiniteNumber(item.count)

      if (!type || !severity || !message || count === null) return null

      return { type, severity, message, count: Math.trunc(count) }
    })
    .filter((item): item is DashboardData['riskAlerts'][number] => item !== null)
}

function toSummary(summary: DashboardSummaryApi['summary'], stats: DashboardSummaryApi['stats']): DashboardData['summary'] {
  return {
    totalSimulations: Math.trunc(toFiniteNumber(summary?.totalSimulations ?? stats?.totalSimulations) ?? 0),
    activeSimulations: toFiniteNumber(summary?.activeSimulations),
    averageRoiPercent: toFiniteNumber(summary?.averageRoiPercent ?? stats?.averageRoiPercent),
    medianPaybackYears: toFiniteNumber(summary?.medianPaybackYears),
    totalEnergyGeneratedKwh: toFiniteNumber(summary?.totalEnergyGeneratedKwh ?? stats?.totalEnergyGeneratedKwh),
    totalCo2SavedKg: toFiniteNumber(summary?.totalCo2SavedKg ?? stats?.totalCo2SavedKg),
    atRiskCount: toFiniteNumber(summary?.atRiskCount),
  }
}

function mapEfficiencyMetrics(value: unknown): DashboardData['efficiencyMetrics'] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const label = toNonEmptyString(item.label)
      const metricValue = toNonEmptyString(item.value)
      const hint = toNonEmptyString(item.hint)

      if (label === null || metricValue === null || hint === null) {
        return null
      }

      return { label, value: metricValue, hint }
    })
    .filter((item): item is DashboardData['efficiencyMetrics'][number] => item !== null)
}

function mapTargetVsActual(value: unknown): DashboardData['targetVsActual'] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .map((item) => {
      const label = toNonEmptyString(item.label)
      const actual = toFiniteNumber(item.actual)
      const target = toFiniteNumber(item.target)
      const unit = toNonEmptyString(item.unit)

      if (
        label === null
        || actual === null
        || target === null
        || unit === null
        || !VALID_TARGET_UNITS.includes(unit as DashboardTargetUnit)
      ) {
        return null
      }

      return { label, actual, target, unit }
    })
    .filter((item): item is DashboardData['targetVsActual'][number] => item !== null)
}

function toStatsCards(summary: DashboardSummaryApi['summary'], stats: DashboardSummaryApi['stats']): DashboardData['stats'] {
  const totalSimulations = toFiniteNumber(summary?.totalSimulations ?? stats?.totalSimulations) ?? 0
  const totalEnergyGeneratedKwh = toFiniteNumber(summary?.totalEnergyGeneratedKwh ?? stats?.totalEnergyGeneratedKwh)
  const totalCo2SavedKg = toFiniteNumber(summary?.totalCo2SavedKg ?? stats?.totalCo2SavedKg)
  const averageRoiPercent = toFiniteNumber(summary?.averageRoiPercent ?? stats?.averageRoiPercent)

  return [
    { label: 'Simulaciones totales', value: String(Math.trunc(totalSimulations)), icon: 'insights' },
    { label: 'CO2 evitado', value: totalCo2SavedKg === null ? 'N/D' : formatKg(totalCo2SavedKg), icon: 'eco' },
    { label: 'ROI promedio', value: averageRoiPercent === null ? 'N/D' : formatPercent(averageRoiPercent), icon: 'trending_up' },
    { label: 'Energía generada', value: totalEnergyGeneratedKwh === null ? 'N/D' : formatKwh(totalEnergyGeneratedKwh), icon: 'bolt' },
  ]
}

export async function getDashboardData(): Promise<DashboardData> {
  let response: { data: ApiResponse<unknown> | unknown }

  try {
    response = await httpClient.get<ApiResponse<unknown> | unknown>('/simulations/dashboard')
  } catch (error) {
    if (!isHttpNotFound(error)) {
      throw error
    }

    return createEmptyDashboardData()
  }

  const summary = extractSummaryPayload(response.data)
  if (!summary) {
    return createEmptyDashboardData()
  }

  const energyBySource = mapEnergyBySource(summary.distribution?.byTechnology ?? summary.energyBySource)
  const dashboardSummary = toSummary(summary.summary, summary.stats)

  return {
    summary: dashboardSummary,
    stats: toStatsCards(summary.summary, summary.stats),
    energyBySource,
    distribution: energyBySource,
    statusDistribution: mapStatusDistribution(summary.distribution?.byStatus),
    efficiencyMetrics: mapEfficiencyMetrics(summary.efficiencyMetrics),
    targetVsActual: mapTargetVsActual(summary.targetVsActual),
    recommendedScenario: mapRecommendedScenario(summary.recommendedScenario),
    prioritizedScenarios: mapPrioritizedScenarios(summary.prioritizedScenarios),
    riskAlerts: mapRiskAlerts(summary.riskAlerts),
  }
}
