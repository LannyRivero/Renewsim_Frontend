import { httpClient } from '@/services/httpClient'
import type { CreateSimulationPayload, SimulationHistoryItem, SimulationResult } from '@/shared/types'
import {
  simulationDetailsSchema,
  type EditSimulationValues,
  type SimulationDetails,
} from '../schemas/simulationSchema'

type ApiResponse<T> = {
  data?: T
}

type RawSimulation = Record<string, unknown>

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function normalizeEnergyType(value: string): string {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'solar' || normalized === 'wind' || normalized === 'hydro') {
    return normalized
  }

  return value
}

function toSimulationResult(value: unknown): SimulationResult | null {
  if (!value || typeof value !== 'object') return null

  const candidate = value as Record<string, unknown>
  const rawId = candidate.id
  const rawLocation = candidate.location
  const rawEnergyType = candidate.energyType

  if ((typeof rawId !== 'string' && typeof rawId !== 'number') || typeof rawLocation !== 'string' || typeof rawEnergyType !== 'string') {
    return null
  }

  return {
    id: String(rawId),
    location: rawLocation,
    energyType: normalizeEnergyType(rawEnergyType),
    roi: readOptionalNumber(candidate.roi),
    efficiency: readOptionalNumber(candidate.efficiency),
  }
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
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

function normalizeSimulation(item: RawSimulation, index: number): SimulationHistoryItem {
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

export async function getSimulationHistory(): Promise<SimulationHistoryItem[]> {
  const response = await httpClient.get<ApiResponse<RawSimulation[]> | RawSimulation[]>('/simulations/history')
  const payload = Array.isArray(response.data) ? response.data : (response.data.data ?? [])

  return payload.map((item, index) => normalizeSimulation(item, index))
}

export async function createSimulation(payload: CreateSimulationPayload): Promise<SimulationResult> {
  const body = {
    ...payload,
    climate: {
      irradiance: payload.climate.irradiance,
      wind: payload.climate.windSpeed,
      hydrology: payload.climate.hydrology,
    },
  }
  const response = await httpClient.post<ApiResponse<SimulationResult> | SimulationResult>('/simulations', body)
  const rawData: unknown =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<SimulationResult>).data
      : response.data

  const normalizedResult = toSimulationResult(rawData)

  if (!normalizedResult) {
    throw new Error('Invalid simulation response from server')
  }

  return normalizedResult
}

export async function getSimulationById(simulationId: string): Promise<SimulationDetails> {
  const response = await httpClient.get<ApiResponse<unknown> | unknown>(`/simulations/${simulationId}`)
  const raw =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<unknown>).data
      : response.data

  return simulationDetailsSchema.parse(raw)
}

export async function updateSimulationById(simulationId: string, payload: EditSimulationValues): Promise<void> {
  await httpClient.put(`/simulations/${simulationId}`, payload)
}

export async function deleteSimulationById(simulationId: string): Promise<void> {
  await httpClient.delete(`/simulations/${simulationId}`)
}
