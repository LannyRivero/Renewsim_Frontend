import type { MonthlySeries, SimulationRunStatus } from '@/shared/types'

export type RawSimulation = Record<string, unknown>

export function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

export function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

export function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : null
}

export function toMonthlySeries(value: unknown): MonthlySeries {
  const numbers = Array.isArray(value) ? value.map((item) => readNumber(item)) : []

  return [
    numbers[0] ?? 0,
    numbers[1] ?? 0,
    numbers[2] ?? 0,
    numbers[3] ?? 0,
    numbers[4] ?? 0,
    numbers[5] ?? 0,
    numbers[6] ?? 0,
    numbers[7] ?? 0,
    numbers[8] ?? 0,
    numbers[9] ?? 0,
    numbers[10] ?? 0,
    numbers[11] ?? 0,
  ]
}

export function normalizeEnergyType(value: string): string {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'solar' || normalized === 'wind' || normalized === 'hydro') {
    return normalized
  }

  return value
}

export function readLocationName(value: unknown): string {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }

  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>
    if (typeof candidate.name === 'string' && candidate.name.trim().length > 0) {
      if (typeof candidate.country === 'string' && candidate.country.trim().length > 0) {
        return `${candidate.name}, ${candidate.country}`
      }

      return candidate.name
    }
  }

  return 'Ubicación no disponible'
}

export function looksLikeCoordinates(value: string): boolean {
  return /^-?\d+(?:[.,]\d+)?\s*,\s*-?\d+(?:[.,]\d+)?(?:\s*,\s*[A-Za-z]{2,})?$/.test(value.trim())
}

export function inferLocationFromName(value: unknown): string | null {
  if (typeof value !== 'string') return null

  const normalized = value.trim()
  const separatorIndex = normalized.indexOf(' - ')

  if (separatorIndex === -1) return null

  const locationPart = normalized.slice(separatorIndex + 3).trim()
  return locationPart.length > 0 ? locationPart : null
}

export function toPercent(value: unknown, fallback: string): string {
  if (typeof value === 'number') return `${Math.round(value)}%`
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.includes('%') ? value : `${value}%`
  }
  return fallback
}

export function formatDate(value: unknown): string {
  if (typeof value !== 'string' && typeof value !== 'number') return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function toSimulationStatus(value: unknown): SimulationRunStatus {
  return value === 'draft' || value === 'processing' || value === 'completed' || value === 'failed'
    ? (value as SimulationRunStatus)
    : 'failed'
}
