export interface ClimatePreviewValues {
  irradiance: string
  windSpeed: string
  hydrology: string
}

export interface ResolvedClimate {
  location: string
  energyType: 'solar' | 'wind' | 'hydro'
  data: { irradiance: number; windSpeed: number; hydrology: number }
}

export const DEFAULT_CLIMATE_PREVIEW: ClimatePreviewValues = {
  irradiance: '-',
  windSpeed: '-',
  hydrology: '3.0',
}

export function toClimatePreview(data: ResolvedClimate['data']): ClimatePreviewValues {
  return {
    irradiance: String(data.irradiance),
    windSpeed: String(data.windSpeed),
    hydrology: String(data.hydrology),
  }
}

export function canReuseResolvedClimate(
  resolvedClimate: ResolvedClimate | null,
  location: string,
  energyType: 'solar' | 'wind' | 'hydro',
) {
  if (!resolvedClimate) return false

  return resolvedClimate.location === location && resolvedClimate.energyType === energyType
}
