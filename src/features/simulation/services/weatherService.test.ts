import { afterEach, describe, expect, it, vi } from 'vitest'
import { getClimateData, searchLocations } from './weatherService'

describe('weatherService', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('maps OpenWeather response into climate payload', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key')

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        wind: { speed: 7.2 },
        clouds: { all: 20 },
      }),
    } as Response)

    const result = await getClimateData('Madrid', 'solar')

    expect(result.windSpeed).toBe(6.84)
    expect(result.irradiance).toBe(5.46)
    expect(result.hydrology).toBe(2.16)
  })

  it('throws when OpenWeather request fails', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key')

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid API key' }),
    } as Response)

    await expect(getClimateData('Madrid', 'wind')).rejects.toThrow(
      'Could not fetch climate data from OpenWeather. [401] (Invalid API key)',
    )
  })

  it('returns location suggestions from OpenWeather geocoding API', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key')

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [
        { name: 'Madrid', state: 'Community of Madrid', country: 'ES' },
        { name: 'Madrid', country: 'CO' },
      ],
    } as Response)

    const result = await searchLocations('madrid')

    expect(result).toEqual([
      {
        name: 'Madrid',
        state: 'Community of Madrid',
        country: 'ES',
        label: 'Madrid, Community of Madrid, ES',
      },
      {
        name: 'Madrid',
        country: 'CO',
        state: undefined,
        label: 'Madrid, CO',
      },
    ])
  })

  it('resolves postal code queries using zip endpoint', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key')

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ name: 'Gijon', country: 'ES', lat: 43.5, lon: -5.66 }),
    } as Response)

    const result = await searchLocations('33206')

    expect(result).toEqual([
      {
        name: 'Gijon',
        country: 'ES',
        state: undefined,
        label: 'Gijon, ES',
      },
    ])
  })
})
