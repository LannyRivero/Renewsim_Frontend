import type { ResolvedLocation } from '@/shared/types'
import { InvalidLocationPayloadError } from './locationServiceErrors'

function readFiniteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

export function decodeResolvedLocation(value: unknown): ResolvedLocation {
  if (!value || typeof value !== 'object') {
    throw new InvalidLocationPayloadError('Invalid location response from server', value)
  }

  const candidate = value as Record<string, unknown>
  const name = readString(candidate.name, '')
  const country = readString(candidate.country, '')
  const label = readString(candidate.label ?? candidate.displayLabel, name && country ? `${name}, ${country}` : '')
  const adminRegion = typeof candidate.adminRegion === 'string' ? candidate.adminRegion : undefined
  const countryCode = readString(
    candidate.countryCode,
    typeof candidate.country === 'string' && candidate.country.trim().length === 2 ? candidate.country.trim().toUpperCase() : '',
  )
  const lat = readFiniteNumber(candidate.lat)
  const lon = readFiniteNumber(candidate.lon)
  const timezone = typeof candidate.timezone === 'string' ? candidate.timezone : undefined

  if (!name || !country || !label || !countryCode || typeof lat !== 'number' || typeof lon !== 'number') {
    throw new InvalidLocationPayloadError('Invalid location response from server', value)
  }

  return { label, name, adminRegion, country, countryCode, lat, lon, timezone }
}

export function decodeResolvedLocations(value: unknown): ResolvedLocation[] {
  if (!Array.isArray(value)) {
    throw new InvalidLocationPayloadError('Invalid location search response from server', value)
  }

  return value.map(decodeResolvedLocation)
}
