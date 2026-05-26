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
  const id = readString(item.id, `simulation-${index}`)
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
  const response = await httpClient.post<ApiResponse<SimulationResult> | SimulationResult>('/simulations', payload)
  const data = 'data' in response.data ? (response.data.data ?? null) : response.data

  if (!data || typeof data.id !== 'string') {
    throw new Error('Invalid simulation response from server')
  }

  return data
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
