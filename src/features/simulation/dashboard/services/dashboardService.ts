import { httpClient } from '@/services/httpClient'
import { aggregateDashboardDomainModel } from './dashboardDomain'
import type { DashboardData } from './dashboardTypes'
import { toDashboardViewModel, toZeroDashboardViewModel } from './dashboardViewModel'
import {
  DASHBOARD_STATS,
  DISTRIBUTION,
  EFFICIENCY_METRICS,
  ENERGY_BY_SOURCE,
  TARGET_VS_ACTUAL,
} from '../data/dashboardMock'

type ApiResponse<T> = {
  data?: T
}

type ArrayExtractionResult = {
  items: Record<string, unknown>[]
  isRecognizedShape: boolean
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
    return toZeroDashboardViewModel()
  }

  const domainModel = aggregateDashboardDomainModel(rawItems)
  return toDashboardViewModel(domainModel)
}
