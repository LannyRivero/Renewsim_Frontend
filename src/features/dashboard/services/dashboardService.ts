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
  energyBySource?: unknown
  efficiencyMetrics?: unknown
  targetVsActual?: unknown
}

type DashboardTargetUnit = DashboardData['targetVsActual'][number]['unit']

const VALID_TARGET_UNITS: DashboardTargetUnit[] = ['kWh', 'kg', '%']

function createEmptyDashboardData(): DashboardData {
  return {
    stats: [
      { label: 'Simulaciones totales', value: '0', icon: 'insights' },
      { label: 'CO2 evitado', value: 'N/D', icon: 'eco' },
      { label: 'ROI promedio', value: 'N/D', icon: 'trending_up' },
      { label: 'Energía generada', value: 'N/D', icon: 'bolt' },
    ],
    energyBySource: [],
    distribution: [],
    efficiencyMetrics: [],
    targetVsActual: [],
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
  return 'stats' in candidate && 'energyBySource' in candidate
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
      const kwh = toFiniteNumber(item.kwh)

      if (label === null || kwh === null) {
        return null
      }

      return { label, kwh }
    })
    .filter((item): item is DashboardData['energyBySource'][number] => item !== null)
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

function toStatsCards(stats: DashboardSummaryApi['stats']): DashboardData['stats'] {
  const totalSimulations = toFiniteNumber(stats?.totalSimulations) ?? 0
  const totalEnergyGeneratedKwh = toFiniteNumber(stats?.totalEnergyGeneratedKwh)
  const totalCo2SavedKg = toFiniteNumber(stats?.totalCo2SavedKg)
  const averageRoiPercent = toFiniteNumber(stats?.averageRoiPercent)

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

  const energyBySource = mapEnergyBySource(summary.energyBySource)

  return {
    stats: toStatsCards(summary.stats),
    energyBySource,
    distribution: energyBySource,
    efficiencyMetrics: mapEfficiencyMetrics(summary.efficiencyMetrics),
    targetVsActual: mapTargetVsActual(summary.targetVsActual),
  }
}
