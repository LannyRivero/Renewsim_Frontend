import { httpClient } from '@/services/httpClient'
import type { CreateSimulationPayload, SimulationHistoryItem, SimulationResult } from '@/shared/types'
import type { EditSimulationValues, SimulationDetails } from '../schemas/simulationSchema'
import { normalizeSimulation, toSimulationDetails, toSimulationResult } from './simulationMappers'
export { resolveLocation, searchLocations, type ResolvedLocation } from './simulationLocationService'

type ApiResponse<T> = {
  data?: T
}

type PaginatedResponse<T> = {
  content?: T[]
}

type RawSimulation = Record<string, unknown>

function isPaginatedResponse(payload: ApiResponse<RawSimulation[]> | PaginatedResponse<RawSimulation>): payload is PaginatedResponse<RawSimulation> {
  return 'content' in payload
}

function isApiResponse(payload: ApiResponse<RawSimulation[]> | PaginatedResponse<RawSimulation>): payload is ApiResponse<RawSimulation[]> {
  return 'data' in payload
}

function extractHistoryPayload(
  payload: ApiResponse<RawSimulation[]> | PaginatedResponse<RawSimulation> | RawSimulation[],
): RawSimulation[] {
  if (Array.isArray(payload)) {
    return payload
  }

  if (isPaginatedResponse(payload)) {
    return payload.content ?? []
  }

  if (isApiResponse(payload)) {
    return payload.data ?? []
  }

  return []
}

function isHttpNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if (!('response' in error)) return false

  const response = (error as { response?: { status?: unknown } }).response
  return response?.status === 404
}

export async function getSimulationHistory(): Promise<SimulationHistoryItem[]> {
  let response: { data: ApiResponse<RawSimulation[]> | PaginatedResponse<RawSimulation> | RawSimulation[] }

  try {
    response = await httpClient.get<ApiResponse<RawSimulation[]> | PaginatedResponse<RawSimulation> | RawSimulation[]>('/simulations/user')
  } catch (error) {
    if (!isHttpNotFound(error)) {
      throw error
    }

    response = await httpClient.get<ApiResponse<RawSimulation[]> | PaginatedResponse<RawSimulation> | RawSimulation[]>('/simulations/history')
  }

  const payload = extractHistoryPayload(response.data)

  return payload.map((item, index) => normalizeSimulation(item, index))
}

export async function createSimulation(payload: CreateSimulationPayload): Promise<SimulationResult> {
  const response = await httpClient.post<ApiResponse<SimulationResult> | SimulationResult>('/simulations', payload)
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

  return toSimulationDetails(raw)
}

export async function updateSimulationById(simulationId: string, payload: EditSimulationValues): Promise<void> {
  await httpClient.put(`/simulations/${simulationId}`, payload)
}

export async function deleteSimulationById(simulationId: string): Promise<void> {
  await httpClient.delete(`/simulations/${simulationId}`)
}
