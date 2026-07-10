import { httpClient } from '@/services/httpClient'
import type {
  ListUserSimulationsResponse,
  RealCreateSimulationRequest,
  SimulationDetailsResponse,
} from '@/shared/types'
import { toListUserSimulationsResponse, toSimulationDetailsResponse } from '../mappers/simulationResponseMappers'

type ApiResponse<T> = {
  data?: T
}

function isHttpNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  if (!('response' in error)) return false

  const response = (error as { response?: { status?: unknown } }).response
  return response?.status === 404
}

export async function createRealSimulation(payload: RealCreateSimulationRequest): Promise<SimulationDetailsResponse> {
  const response = await httpClient.post<ApiResponse<unknown> | unknown>('/simulations', payload)
  const rawData: unknown =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<unknown>).data
      : response.data

  return toSimulationDetailsResponse(rawData)
}

export async function getRealSimulationById(simulationId: string): Promise<SimulationDetailsResponse> {
  const response = await httpClient.get<ApiResponse<unknown> | unknown>(`/simulations/${simulationId}`)
  const raw =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<unknown>).data
      : response.data

  return toSimulationDetailsResponse(raw)
}

export async function getRealSimulationHistory(): Promise<ListUserSimulationsResponse> {
  let response: { data: unknown }

  try {
    response = await httpClient.get('/simulations/user')
  } catch (error) {
    if (!isHttpNotFound(error)) {
      throw error
    }

    response = await httpClient.get('/simulations/history')
  }

  const rawData =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<unknown>).data
      : response.data

  return toListUserSimulationsResponse(rawData)
}

export async function updateSimulationById(simulationId: string, payload: RealCreateSimulationRequest): Promise<void> {
  await httpClient.put(`/simulations/${simulationId}`, payload)
}

export async function deleteSimulationById(simulationId: string): Promise<void> {
  await httpClient.delete(`/simulations/${simulationId}`)
}
