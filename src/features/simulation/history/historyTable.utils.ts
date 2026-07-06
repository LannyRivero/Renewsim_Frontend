export type HistorySortField = 'name' | 'status' | 'createdAt' | 'roi'
export type HistorySortDirection = 'asc' | 'desc'

export function parsePercentage(value: string) {
  const normalized = Number.parseFloat(value.replace('%', '').trim())
  return Number.isFinite(normalized) ? normalized : Number.NEGATIVE_INFINITY
}

export function parseDate(value?: string) {
  if (!value) return Number.NEGATIVE_INFINITY
  const parsed = new Date(value).getTime()
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed
}

export function formatDisplayDate(value?: string) {
  if (!value) return 'N/A'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return 'N/A'
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatPercent(value: number | null | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? `${Number(value.toFixed(1))}%` : 'N/A'
}

export function formatStatusLabel(value: string) {
  if (!value) return 'Sin estado'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getStatusTone(status: string): 'success' | 'neutral' {
  const normalized = status.trim().toLowerCase()

  if (['completed', 'complete', 'finalizada', 'finalizado', 'success', 'successful'].includes(normalized)) {
    return 'success'
  }

  return 'neutral'
}
