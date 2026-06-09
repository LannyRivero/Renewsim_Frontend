import type { DashboardDomainModel } from './dashboardTypes'

const MIN_ESTIMATED_KWH = 1500
const DEFAULT_EFFICIENCY_FOR_ESTIMATION = 75
const EFFICIENCY_TO_KWH_FACTOR = 90
const DEFAULT_AVG_ROI = 15
const DEFAULT_AVG_EFFICIENCY = 82.4
const CO2_SAVED_FACTOR = 0.2

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

export function aggregateDashboardDomainModel(rawItems: Record<string, unknown>[]): DashboardDomainModel {
  const bySource = new Map<string, number>()
  let totalRoi = 0
  let roiCount = 0
  let totalEfficiency = 0
  let efficiencyCount = 0
  let totalKwh = 0

  for (const item of rawItems) {
    const sourceLabel = normalizeSourceLabel(item.energyType ?? item.sourceType ?? item.technologyName)
    const efficiency = toNumber(item.efficiency ?? item.efficiencyPercent)
    const roi = toNumber(item.roi ?? item.roiPercent ?? item.returnOnInvestment)
    const explicitKwh = toNumber(item.energyGenerated ?? item.energyGeneratedKwh ?? item.generatedKwh ?? item.energyKwh)
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

  const avgRoi = roiCount > 0 ? totalRoi / roiCount : DEFAULT_AVG_ROI
  const avgEfficiency = efficiencyCount > 0 ? totalEfficiency / efficiencyCount : DEFAULT_AVG_EFFICIENCY
  const co2SavedKg = Math.round(totalKwh * CO2_SAVED_FACTOR)

  return {
    totalSimulations: rawItems.length,
    totalKwh,
    co2SavedKg,
    avgRoi,
    avgEfficiency,
    energyBySource: Array.from(bySource.entries()).map(([label, kwh]) => ({ label, kwh })),
  }
}
