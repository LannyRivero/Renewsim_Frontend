export type HistorySortField = 'name' | 'status' | 'createdAt' | 'roi'
export type HistorySortDirection = 'asc' | 'desc'

export function getStatusTone(status: string): 'success' | 'neutral' {
  const normalized = status.trim().toLowerCase()

  if (['completed', 'complete', 'finalizada', 'finalizado', 'success', 'successful'].includes(normalized)) {
    return 'success'
  }

  return 'neutral'
}
