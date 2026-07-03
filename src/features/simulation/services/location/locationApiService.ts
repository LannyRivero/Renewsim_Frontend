import { httpClient } from '@/services/httpClient'
import type { ResolvedLocation } from '@/shared/types'
import { decodeResolvedLocation, decodeResolvedLocations } from './locationResponseDecoder'
import { LocationServiceError } from './locationServiceErrors'

type ApiEnvelope<T> = {
  data?: T
}

type GatewayResponse<T> = {
  data: T
}

interface LocationGateway {
  get<T>(url: string): Promise<GatewayResponse<T>>
}

const locationGateway: LocationGateway = {
  get: (url) => httpClient.get(url),
}

function unwrapApiData<T>(response: GatewayResponse<ApiEnvelope<T> | T>): T {
  const payload = response.data

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data as T
  }

  return payload as T
}

async function fetchLocationPayload<T>(url: string, gateway: LocationGateway = locationGateway): Promise<T> {
  try {
    const response = await gateway.get<ApiEnvelope<T> | T>(url)
    return unwrapApiData(response)
  } catch (error) {
    if (error instanceof LocationServiceError) {
      throw error
    }

    throw new LocationServiceError('Failed to fetch location data', error)
  }
}

export async function resolveLocation(lat: number, lon: number): Promise<ResolvedLocation> {
  const payload = await fetchLocationPayload<unknown>(
    `/simulations/locations/reverse?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`,
  )

  return decodeResolvedLocation(payload)
}

export async function searchLocations(query: string, limit = 5): Promise<ResolvedLocation[]> {
  const payload = await fetchLocationPayload<unknown>(
    `/simulations/locations/search?q=${encodeURIComponent(query)}&limit=${encodeURIComponent(String(limit))}`,
  )

  return decodeResolvedLocations(payload)
}
