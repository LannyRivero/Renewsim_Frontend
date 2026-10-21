import { httpClient } from '@/services/httpClient'
import type {
  ListUserSimulationsResponse,
  RealCreateSimulationRequest,
  SimulationDetailsResponse,
  SimulationHistoryQuery,
} from '@/shared/types'
import { toListUserSimulationsResponse, toSimulationDetailsResponse } from '../mappers/simulationResponseMappers'

type ApiResponse<T> = {
  data?: T
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

export async function getRealSimulationHistory(query: SimulationHistoryQuery = {}): Promise<ListUserSimulationsResponse> {
  const response = await httpClient.get('/simulations/my-simulations', { params: query })

  const rawData =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<unknown>).data
      : response.data

  return toListUserSimulationsResponse(rawData)
}

export async function getSavedLocationSuggestions(query: string, limit = 5): Promise<string[]> {
  const response = await httpClient.get<string[]>('/simulations/user/locations', {
    params: { q: query, limit },
  })
  return response.data
}

export async function updateSimulationById(simulationId: string, payload: RealCreateSimulationRequest): Promise<void> {
  await httpClient.put(`/simulations/${simulationId}`, payload)
}

export async function deleteSimulationById(simulationId: string): Promise<void> {
  await httpClient.delete(`/simulations/${simulationId}`)
}
