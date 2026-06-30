export function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString('en-US')}`
}

export function formatDate(createdAt?: string) {
  if (!createdAt) return 'N/A'

  return new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatNumber(value: number, maximumFractionDigits = 1) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  })
}

export function formatEnergyTypeLabel(value: string) {
  const normalized = value.trim().toUpperCase()
  if (normalized === 'WIND') return 'Eólica'
  if (normalized === 'HYDRO') return 'Hidráulica'
  if (normalized === 'SOLAR') return 'Solar'
  return 'Simulación'
}

export function buildCompactLocationLabel(location: string) {
  if (!location || location === 'N/A') return 'Escenario'

  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length >= 3) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
  }

  if (parts.length >= 2) {
    return `${parts[0]}, ${parts[1]}`
  }

  return parts[0] ?? 'Escenario'
}

export function isCoordinateLike(value: string) {
  return /^-?\d+(?:[.,]\d+)?\s*,\s*-?\d+(?:[.,]\d+)?$/.test(value.trim())
}

export function buildDisplayTitle({
  simulationName,
  energyType,
  location,
}: {
  simulationName: string
  energyType: string
  location: string
}) {
  const energyLabel = formatEnergyTypeLabel(energyType)

  if (location && location !== 'N/A' && !isCoordinateLike(location)) {
    return `${energyLabel} · ${buildCompactLocationLabel(location)}`
  }

  const suffix = simulationName.includes(' - ') ? simulationName.split(' - ').slice(1).join(' - ') : ''
  if (suffix) {
    return `${energyLabel} · ${buildCompactLocationLabel(suffix)}`
  }

  return energyLabel
}
