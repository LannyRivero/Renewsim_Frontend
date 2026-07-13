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

export type TechnologiesPageResult = {
  items: TechnologyItem[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  sortBy: TechnologySortBy
  sortDirection: TechnologySortDirection
}

export type TechnologyEnergyTypeFilter = 'ALL' | 'SOLAR' | 'WIND' | 'HYDRO'
export type TechnologySortBy = 'name' | 'energyType' | 'efficiency' | 'co2Reduction'
export type TechnologySortDirection = 'asc' | 'desc'

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

export async function getAllTechnologies(
  page = 0,
  size = 20,
  energyType: TechnologyEnergyTypeFilter = 'ALL',
  search = '',
  sortBy: TechnologySortBy = 'name',
  sortDirection: TechnologySortDirection = 'asc',
): Promise<TechnologiesPageResult> {
  const filterQuery = energyType === 'ALL' ? '' : `&energyType=${energyType}`
  const trimmedSearch = search.trim()
  const searchQuery = trimmedSearch.length >= 3 ? `&search=${encodeURIComponent(trimmedSearch)}` : ''
  const sortQuery = `&sortBy=${sortBy}&sortDirection=${sortDirection}`
  const response = await httpClient.get<
    ApiResponse<RawTechnology[] | PaginatedResponse<RawTechnology>> | RawTechnology[] | PaginatedResponse<RawTechnology>
  >(`/technologies?page=${page}&size=${size}${filterQuery}${searchQuery}${sortQuery}`)

  const root = response.data
  const envelope = root && typeof root === 'object' && 'data' in root
    ? (root as ApiResponse<unknown>).data
    : root

  const payload = Array.isArray(envelope)
    ? envelope
    : (envelope as PaginatedResponse<RawTechnology> | undefined)?.content ?? []

  const normalizedItems = payload.map((item, index) => normalizeTechnology(item, index))
  const paginatedEnvelope = !Array.isArray(envelope) ? (envelope as PaginatedResponse<RawTechnology> | undefined) : undefined

  return {
    items: normalizedItems,
    totalElements: paginatedEnvelope?.totalElements ?? normalizedItems.length,
    totalPages: Math.max(1, paginatedEnvelope?.totalPages ?? 1),
    page: paginatedEnvelope?.number ?? page,
    size: paginatedEnvelope?.size ?? size,
    sortBy,
    sortDirection,
  }
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
