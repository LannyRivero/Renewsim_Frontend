type OpenWeatherResponse = {
  wind?: {
    speed?: number
  }
  clouds?: {
    all?: number
  }
  main?: {
    humidity?: number
  }
  rain?: {
    '1h'?: number
    '3h'?: number
  }
}

export type ClimateData = {
  irradiance: number
  windSpeed: number
  hydrology: number
}

type EnergyType = 'solar' | 'wind' | 'hydro'

export type LocationSuggestion = {
  name: string
  country: string
  state?: string
  label: string
}

type OpenWeatherGeoItem = {
  name?: string
  country?: string
  state?: string
}

type OpenWeatherZipItem = {
  name?: string
  country?: string
  lat?: number
  lon?: number
}

type OpenWeatherError = {
  cod?: number | string
  message?: string
}

const OPEN_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather'
const OPEN_WEATHER_GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'
const OPEN_WEATHER_ZIP_URL = 'https://api.openweathermap.org/geo/1.0/zip'

function readApiKey(): string | null {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    return null
  }

  return apiKey
}

async function buildOpenWeatherError(response: Response, fallback: string): Promise<Error> {
  let details = ''

  try {
    const payload = (await response.json()) as OpenWeatherError
    if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
      details = payload.message.trim()
    }
  } catch {
    details = ''
  }

  const suffix = details ? ` (${details})` : ''
  return new Error(`${fallback} [${response.status}]${suffix}`)
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function estimateIrradianceFromClouds(cloudinessPercent: number): number {
  const bounded = Math.min(100, Math.max(0, cloudinessPercent))
  const estimated = 6.5 * (1 - bounded / 100)
  return Number(Math.max(0.1, estimated).toFixed(2))
}

function estimateHydrology(payload: OpenWeatherResponse): number {
  const rain1h = readNumber(payload.rain?.['1h'], 0)
  const rain3h = readNumber(payload.rain?.['3h'], 0)
  const humidity = readNumber(payload.main?.humidity, 60)

  const fromRain = rain1h > 0 ? rain1h * 3.2 : rain3h > 0 ? rain3h * 1.2 : 0
  const fromHumidity = humidity * 0.045
  return Number(Math.max(0.5, fromRain + fromHumidity).toFixed(2))
}

function applyEnergyProfile(base: ClimateData, energyType: EnergyType): ClimateData {
  if (energyType === 'solar') {
    return {
      irradiance: Number((base.irradiance * 1.05).toFixed(2)),
      windSpeed: Number((base.windSpeed * 0.95).toFixed(2)),
      hydrology: Number((base.hydrology * 0.8).toFixed(2)),
    }
  }

  if (energyType === 'wind') {
    return {
      irradiance: Number((base.irradiance * 0.9).toFixed(2)),
      windSpeed: Number((base.windSpeed * 1.1).toFixed(2)),
      hydrology: Number((base.hydrology * 0.85).toFixed(2)),
    }
  }

  return {
    irradiance: Number((base.irradiance * 0.8).toFixed(2)),
    windSpeed: Number((base.windSpeed * 0.9).toFixed(2)),
    hydrology: Number((base.hydrology * 1.25).toFixed(2)),
  }
}

export async function getClimateData(location: string, energyType: EnergyType): Promise<ClimateData> {
  const apiKey = readApiKey()
  if (!apiKey) {
    return applyEnergyProfile({ irradiance: 4.2, windSpeed: 5.6, hydrology: 2.7 }, energyType)
  }

  const targetLocation = location.trim()
  if (targetLocation.length === 0) {
    throw new Error('Location is required to fetch climate data.')
  }

  const requestUrl = new URL(OPEN_WEATHER_URL)
  requestUrl.searchParams.set('q', targetLocation)
  requestUrl.searchParams.set('appid', apiKey)
  requestUrl.searchParams.set('units', 'metric')

  const response = await fetch(requestUrl.toString())
  if (!response.ok) {
    throw await buildOpenWeatherError(response, 'Could not fetch climate data from OpenWeather.')
  }

  const payload = (await response.json()) as OpenWeatherResponse
  const base: ClimateData = {
    windSpeed: Number(readNumber(payload.wind?.speed, 0).toFixed(2)),
    irradiance: estimateIrradianceFromClouds(readNumber(payload.clouds?.all, 50)),
    hydrology: estimateHydrology(payload),
  }

  return applyEnergyProfile(base, energyType)
}

export async function searchLocations(query: string, limit = 5): Promise<LocationSuggestion[]> {
  const apiKey = readApiKey()
  const q = query.trim()

  if (q.length < 2) return []
  if (!apiKey) return []

  const postalMatch = q.match(/^(\d{4,10})(?:\s*,\s*([A-Za-z]{2}))?$/)
  if (postalMatch) {
    const zip = postalMatch[1]
    const explicitCountry = postalMatch[2]?.toUpperCase()
    const countryCandidates = explicitCountry ? [explicitCountry] : ['ES', 'US', '']

    for (const country of countryCandidates) {
      const requestUrl = new URL(OPEN_WEATHER_ZIP_URL)
      const zipQuery = country ? `${zip},${country}` : zip
      requestUrl.searchParams.set('zip', zipQuery)
      requestUrl.searchParams.set('appid', apiKey)

      const response = await fetch(requestUrl.toString())

      if (response.status === 404) {
        continue
      }

      if (!response.ok) {
        throw await buildOpenWeatherError(response, 'Could not search locations on OpenWeather.')
      }

      const item = (await response.json()) as OpenWeatherZipItem
      if (typeof item.name === 'string' && typeof item.country === 'string') {
        const label = `${item.name}, ${item.country}`
        return [
          {
            name: item.name,
            country: item.country,
            state: undefined,
            label,
          },
        ]
      }
    }

    return []
  }

  const requestUrl = new URL(OPEN_WEATHER_GEO_URL)
  requestUrl.searchParams.set('q', q)
  requestUrl.searchParams.set('limit', String(limit))
  requestUrl.searchParams.set('appid', apiKey)

  const response = await fetch(requestUrl.toString())
  if (!response.ok) {
    throw await buildOpenWeatherError(response, 'Could not search locations on OpenWeather.')
  }

  const payload = (await response.json()) as OpenWeatherGeoItem[]

  return payload
    .filter((item) => typeof item.name === 'string' && typeof item.country === 'string')
    .map((item) => {
      const name = item.name as string
      const country = item.country as string
      const state = typeof item.state === 'string' ? item.state : undefined
      const label = state ? `${name}, ${state}, ${country}` : `${name}, ${country}`

      return {
        name,
        country,
        state,
        label,
      }
    })
}
