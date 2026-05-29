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

type ArrayExtractionResult = {
  items: Record<string, unknown>[]
  isRecognizedShape: boolean
}

const MIN_ESTIMATED_KWH = 1500
const DEFAULT_EFFICIENCY_FOR_ESTIMATION = 75
const EFFICIENCY_TO_KWH_FACTOR = 90
const DEFAULT_AVG_ROI = 15
const DEFAULT_AVG_EFFICIENCY = 82.4
const CO2_SAVED_FACTOR = 0.2
const ENERGY_OUTPUT_TARGET_FACTOR = 1.1
const CO2_REDUCTION_TARGET_FACTOR = 1.08
const ROI_TARGET_INCREMENT = 1

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

function extractArrayPayload(payload: unknown): ArrayExtractionResult {
  if (Array.isArray(payload)) {
    return {
      items: payload.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object')),
      isRecognizedShape: true,
    }
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    if (Array.isArray(record.data)) {
      return {
        items: record.data.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object')),
        isRecognizedShape: true,
      }
    }
  }

  return { items: [], isRecognizedShape: false }
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await httpClient.get<ApiResponse<unknown> | unknown>('/simulations/history')
  const { items: rawItems, isRecognizedShape } = extractArrayPayload(response.data)

  if (!isRecognizedShape) {
    return {
      stats: DASHBOARD_STATS,
      energyBySource: ENERGY_BY_SOURCE,
      distribution: DISTRIBUTION,
      efficiencyMetrics: EFFICIENCY_METRICS,
      targetVsActual: TARGET_VS_ACTUAL,
    }
  }

  if (rawItems.length === 0) {
    return {
      stats: [
        { label: 'Total Simulations', value: '0', icon: 'insights' },
        { label: 'CO2 Saved', value: '0 kg', icon: 'eco' },
        { label: 'Average ROI', value: '0%', icon: 'trending_up' },
        { label: 'Energy Generated', value: '0 kWh', icon: 'bolt' },
      ],
      energyBySource: [],
      distribution: [],
      efficiencyMetrics: [
        { label: 'Capacity factor', value: '0%', hint: 'Plant utilization over period' },
        { label: 'Cost per kWh', value: '$0.000', hint: 'Blended production cost' },
        { label: 'Grid availability', value: '0%', hint: 'Operational uptime' },
      ],
      targetVsActual: [
        { label: 'Energy output', actual: 0, target: 0, unit: 'kWh' },
        { label: 'CO2 reduction', actual: 0, target: 0, unit: 'kg' },
        { label: 'ROI', actual: 0, target: 0, unit: '%' },
      ],
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
    const estimatedKwh = explicitKwh ?? Math.max(MIN_ESTIMATED_KWH, Math.round((efficiency ?? DEFAULT_EFFICIENCY_FOR_ESTIMATION) * EFFICIENCY_TO_KWH_FACTOR))

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
  const avgRoi = roiCount > 0 ? totalRoi / roiCount : DEFAULT_AVG_ROI
  const avgEfficiency = efficiencyCount > 0 ? totalEfficiency / efficiencyCount : DEFAULT_AVG_EFFICIENCY
  const co2SavedKg = Math.round(totalKwh * CO2_SAVED_FACTOR)

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
      { label: 'Energy output', actual: totalKwh, target: Math.round(totalKwh * ENERGY_OUTPUT_TARGET_FACTOR), unit: 'kWh' },
      { label: 'CO2 reduction', actual: co2SavedKg, target: Math.round(co2SavedKg * CO2_REDUCTION_TARGET_FACTOR), unit: 'kg' },
      { label: 'ROI', actual: Number(avgRoi.toFixed(1)), target: Number((avgRoi + ROI_TARGET_INCREMENT).toFixed(1)), unit: '%' },
    ],
  }
}
