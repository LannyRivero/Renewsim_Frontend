import { httpClient } from '@/services/httpClient'
import type { CreateTechnologyPayload, TechnologyItem } from '@/shared/types'

type ApiResponse<T> = {
  data?: T
}

type RawTechnology = Record<string, unknown>

function normalizeTechnology(item: RawTechnology, index: number): TechnologyItem {
  return {
    id: String(item.id ?? `tech-${index}`),
    name: String(item.technologyName ?? item.name ?? 'Unknown Technology'),
    energyType: String(item.energyType ?? 'UNKNOWN'),
    efficiency: Number(item.efficiency ?? 0),
    co2Reduction: Number(item.co2Reduction ?? 0),
    installationCost: Number(item.installationCost ?? 0),
    maintenanceCost: Number(item.maintenanceCost ?? 0),
    environmentalImpact: Number(item.environmentalImpact ?? 0),
  }
}

export async function getAllTechnologies(): Promise<TechnologyItem[]> {
  const response = await httpClient.get<ApiResponse<RawTechnology[]> | RawTechnology[]>('/technologies')
  const payload = Array.isArray(response.data) ? response.data : (response.data.data ?? [])
  return payload.map((item, index) => normalizeTechnology(item, index))
}

export async function createTechnology(payload: CreateTechnologyPayload): Promise<void> {
  await httpClient.post('/technologies', payload)
}

export async function deleteTechnologyById(technologyId: string): Promise<void> {
  await httpClient.delete(`/technologies/${technologyId}`)
}
