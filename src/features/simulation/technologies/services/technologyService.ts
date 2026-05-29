import { httpClient } from '@/services/httpClient'
import type { CreateTechnologyPayload, TechnologyItem, UpdateTechnologyPayload } from '@/shared/types'

type ApiResponse<T> = {
  data?: T
}

type RawTechnology = Record<string, unknown>

function normalizeTechnology(item: RawTechnology, index: number): TechnologyItem {
  return {
    id: String(item.id ?? `tech-${index}`),
    name: String(item.technologyName ?? item.name ?? 'Tecnología Desconocida'),
    energyType: String(item.energyType ?? 'DESCONOCIDO'),
    installedPower: Number(item.installedPower ?? 0),
    capacityFactor: Number(item.capacityFactor ?? item.energyProduction ?? 0),
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

export async function updateTechnologyById(technologyId: string, payload: UpdateTechnologyPayload): Promise<void> {
  await httpClient.put(`/technologies/${technologyId}`, payload)
}

export async function deleteTechnologyById(technologyId: string): Promise<void> {
  await httpClient.delete(`/technologies/${technologyId}`)
}
