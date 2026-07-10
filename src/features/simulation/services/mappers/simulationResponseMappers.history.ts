import type { ListUserSimulationsResponse, SimulationHistoryItem, SimulationHistoryRow } from '@/shared/types'
import {
  formatDate,
  inferLocationFromName,
  looksLikeCoordinates,
  normalizeEnergyType,
  readLocationName,
  readNumber,
  readOptionalNumber,
  readRecord,
  readString,
  toPercent,
  toSimulationStatus,
} from './simulationResponseMappers.shared'

export function normalizeSimulation(item: Record<string, unknown>, index: number): SimulationHistoryItem {
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

export function toSimulationHistoryRow(value: unknown): SimulationHistoryRow {
  const candidate = readRecord(value)
  const location = readRecord(candidate?.location)
  const technical = readRecord(candidate?.technical)
  const financial = readRecord(candidate?.financial)
  const summary = readRecord(candidate?.summary)
  const resource = readRecord(technical?.resource)
  const technology = candidate?.technology
  const normalizedTechnology = technology === 'solar' || technology === 'wind' || technology === 'hydro' ? technology : 'solar'
  const normalizedRecommendation = candidate?.recommendation ?? summary?.recommendation

  return {
    id: readString(candidate?.id, 'N/A'),
    name: readString(candidate?.name, 'Simulation'),
    technology: normalizedTechnology,
    status: toSimulationStatus(candidate?.status),
    createdAt: readString(candidate?.createdAt ?? candidate?.timestamp, ''),
    locationLabel: readString(candidate?.locationLabel ?? location?.label ?? location?.name, 'N/A'),
    annualGenerationKwh: readNumber(candidate?.annualGenerationKwh ?? technical?.annualGenerationKwh),
    annualSavings: readNumber(candidate?.annualSavings ?? financial?.annualSavings),
    npv: readNumber(candidate?.npv ?? financial?.npv),
    irrPct: readOptionalNumber(candidate?.irrPct ?? financial?.irrPct) ?? null,
    recommendation:
      normalizedRecommendation === 'recommended' || normalizedRecommendation === 'viable_with_reservations' || normalizedRecommendation === 'not_recommended'
        ? normalizedRecommendation
        : 'not_recommended',
    modelVersion: readString(candidate?.modelVersion, 'unknown'),
    resourceSource: readString(candidate?.resourceSource ?? resource?.source, 'PVGIS') === 'PVGIS' ? 'PVGIS' : 'PVGIS',
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
