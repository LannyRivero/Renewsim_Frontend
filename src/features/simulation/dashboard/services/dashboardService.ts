import { httpClient } from '@/services/httpClient'
import {
  DASHBOARD_STATS,
  DISTRIBUTION,
  EFFICIENCY_METRICS,
  ENERGY_BY_SOURCE,
  TARGET_VS_ACTUAL,
  type DistributionSlice,
  type EfficiencyMetric,
  type EnergySource,
  type StatCard,
  type TargetVsActual,
} from '../data/dashboardMock'

type DashboardData = {
  stats: StatCard[]
  energyBySource: EnergySource[]
  distribution: DistributionSlice[]
  efficiencyMetrics: EfficiencyMetric[]
  targetVsActual: TargetVsActual[]
}

type ApiResponse<T> = {
  data?: T
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function normalizeSourceLabel(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) return 'Other'
  const normalized = value.trim().toLowerCase()
  if (normalized.includes('solar')) return 'Solar'
  if (normalized.includes('wind') || normalized.includes('eolic')) return 'Wind'
  if (normalized.includes('hydro')) return 'Hydroelectric'
  if (normalized.includes('bio')) return 'Biomasa'
  return value.trim()
}

function extractArrayPayload(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) return payload.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.data)) {
      return record.data.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    }
  }

  return []
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await httpClient.get<ApiResponse<unknown> | unknown>('/simulations/history')
  const rawItems = extractArrayPayload(response.data)

  if (rawItems.length === 0) {
    return {
      stats: DASHBOARD_STATS,
      energyBySource: ENERGY_BY_SOURCE,
      distribution: DISTRIBUTION,
      efficiencyMetrics: EFFICIENCY_METRICS,
      targetVsActual: TARGET_VS_ACTUAL,
    }
  }

  const bySource = new Map<string, number>()
  let totalRoi = 0
  let roiCount = 0
  let totalEfficiency = 0
  let efficiencyCount = 0
  let totalKwh = 0

  for (const item of rawItems) {
    const sourceLabel = normalizeSourceLabel(item.energyType ?? item.sourceType ?? item.technologyName)
    const efficiency = toNumber(item.efficiency ?? item.efficiencyPercent)
    const roi = toNumber(item.roi ?? item.roiPercent)
    const explicitKwh = toNumber(item.energyGeneratedKwh ?? item.generatedKwh ?? item.energyKwh)
    const estimatedKwh = explicitKwh ?? Math.max(1500, Math.round((efficiency ?? 75) * 90))

    bySource.set(sourceLabel, (bySource.get(sourceLabel) ?? 0) + estimatedKwh)
    totalKwh += estimatedKwh

    if (efficiency !== null) {
      totalEfficiency += efficiency
      efficiencyCount += 1
    }

    if (roi !== null) {
      totalRoi += roi
      roiCount += 1
    }
  }

  const energyBySource = Array.from(bySource.entries()).map(([label, kwh]) => ({ label, kwh }))
  const distribution = energyBySource
  const avgRoi = roiCount > 0 ? totalRoi / roiCount : 15
  const avgEfficiency = efficiencyCount > 0 ? totalEfficiency / efficiencyCount : 82.4
  const co2SavedKg = Math.round(totalKwh * 0.2)

  return {
    stats: [
      { label: 'Total Simulations', value: String(rawItems.length), icon: 'insights' },
      { label: 'CO2 Saved', value: `${co2SavedKg.toLocaleString('en-US')} kg`, icon: 'eco' },
      { label: 'Average ROI', value: `${avgRoi.toFixed(1)}%`, icon: 'trending_up' },
      { label: 'Energy Generated', value: `${totalKwh.toLocaleString('en-US')} kWh`, icon: 'bolt' },
    ],
    energyBySource,
    distribution,
    efficiencyMetrics: [
      { label: 'Capacity factor', value: `${avgEfficiency.toFixed(1)}%`, hint: 'Plant utilization over period' },
      { label: 'Cost per kWh', value: '$0.073', hint: 'Blended production cost' },
      { label: 'Grid availability', value: '99.2%', hint: 'Operational uptime' },
    ],
    targetVsActual: [
      { label: 'Energy output', actual: totalKwh, target: Math.round(totalKwh * 1.1), unit: 'kWh' },
      { label: 'CO2 reduction', actual: co2SavedKg, target: Math.round(co2SavedKg * 1.08), unit: 'kg' },
      { label: 'ROI', actual: Number(avgRoi.toFixed(1)), target: Number((avgRoi + 1).toFixed(1)), unit: '%' },
    ],
  }
}
