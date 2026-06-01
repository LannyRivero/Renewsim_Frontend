import { httpClient } from '@/services/httpClient'
import type { CreateTechnologyPayload, TechnologyItem, UpdateTechnologyPayload } from '@/shared/types'

type ApiResponse<T> = {
  data?: T
}

type PaginatedResponse<T> = {
  content?: T[]
  totalElements?: number
  totalPages?: number
  number?: number
  size?: number
}

type RawTechnology = Record<string, unknown>

function normalizeTechnology(item: RawTechnology, index: number): TechnologyItem {
  const resolvedId = item.id ?? item.technologyId ?? item.technology_id ?? `tech-${index}`

  return {
    id: String(resolvedId),
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
  const response = await httpClient.get<
    ApiResponse<RawTechnology[] | PaginatedResponse<RawTechnology>> | RawTechnology[] | PaginatedResponse<RawTechnology>
  >('/technologies?page=0&size=20')

  const root = response.data
  const envelope = root && typeof root === 'object' && 'data' in root
    ? (root as ApiResponse<unknown>).data
    : root

  const payload = Array.isArray(envelope)
    ? envelope
    : (envelope as PaginatedResponse<RawTechnology> | undefined)?.content ?? []

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
