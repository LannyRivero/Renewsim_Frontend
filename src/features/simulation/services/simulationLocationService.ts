import { httpClient } from '@/services/httpClient'

type ApiResponse<T> = {
  data?: T
}

export interface ResolvedLocation {
  name: string
  country: string
  lat: number
  lon: number
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function toResolvedLocation(value: unknown): ResolvedLocation {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid location response from server')
  }

  const candidate = value as Record<string, unknown>
  const name = readString(candidate.name, '')
  const country = readString(candidate.country, '')
  const lat = readOptionalNumber(candidate.lat)
  const lon = readOptionalNumber(candidate.lon)

  if (!name || !country || typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Invalid location response from server')
  }

  return { name, country, lat, lon }
}

function toResolvedLocations(value: unknown): ResolvedLocation[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid location search response from server')
  }

  return value.map(toResolvedLocation)
}

export async function resolveLocation(lat: number, lon: number): Promise<ResolvedLocation> {
  const response = await httpClient.get<ApiResponse<unknown> | unknown>(`/simulations/locations/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`)
  const raw =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<unknown>).data
      : response.data

  return toResolvedLocation(raw)
}

export async function searchLocations(query: string, limit = 5): Promise<ResolvedLocation[]> {
  const response = await httpClient.get<ApiResponse<unknown> | unknown>(`/simulations/locations/search?q=${encodeURIComponent(query)}&limit=${encodeURIComponent(String(limit))}`)
  const raw =
    response.data && typeof response.data === 'object' && 'data' in response.data
      ? (response.data as ApiResponse<unknown>).data
      : response.data

  return toResolvedLocations(raw)
}
