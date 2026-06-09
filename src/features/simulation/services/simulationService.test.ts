import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSimulation, getSimulationById, getSimulationHistory, resolveLocation, searchLocations } from './simulationService'
import { httpClient } from '@/services/httpClient'

vi.mock('@/services/httpClient', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

const mockedPost = vi.mocked(httpClient.post)
const mockedGet = vi.mocked(httpClient.get)

describe('simulationService.createSimulation', () => {
  beforeEach(() => {
    mockedPost.mockReset()
    mockedGet.mockReset()
  })

  it('normalizes numeric id and uppercase energyType from API', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        id: 6,
        name: 'SOLAR - Madrid',
        status: 'completed',
        createdAt: '2026-06-05T20:46:11.6823576',
      },
    })

    const result = await createSimulation({
      name: 'SOLAR - Madrid',
      technology: 'solar',
      installedCapacity: 500,
      location: {
        lat: 40.4168,
        lon: -3.7038,
      },
    })

    expect(result).toEqual({
      id: '6',
      name: 'SOLAR - Madrid',
      status: 'completed',
      createdAt: '2026-06-05T20:46:11.6823576',
      location: undefined,
      energyType: undefined,
      roi: undefined,
      efficiency: undefined,
    })
  })

  it('fetches history from /simulations/user when available', async () => {
    mockedGet.mockResolvedValueOnce({
      data: [
        {
          id: 6,
          location: 'Madrid, Community of Madrid, ES',
          energyType: 'SOLAR',
          roi: 18,
          efficiency: 92,
          createdAt: '2026-06-05T20:46:11.6823576',
        },
      ],
    })

    const result = await getSimulationHistory()

    expect(mockedGet).toHaveBeenCalledWith('/simulations/user')
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('6')
  })

  it('falls back to /simulations/history when /simulations/user is missing', async () => {
    mockedGet
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({
        data: [
          {
            id: 'sim-legacy-1',
            date: '2026-06-05T20:46:11.6823576',
            energyType: 'WIND',
            roi: 14,
            efficiency: 89,
          },
        ],
      })

    const result = await getSimulationHistory()

    expect(mockedGet).toHaveBeenNthCalledWith(1, '/simulations/user')
    expect(mockedGet).toHaveBeenNthCalledWith(2, '/simulations/history')
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe('sim-legacy-1')
  })

  it('normalizes backend detail payload aliases after create', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        id: 28,
        name: 'Solar Demo',
        location: {
          name: 'San Francisco',
          country: 'US',
          lat: 37.7749,
          lon: -122.4194,
        },
        technology: 'SOLAR',
        installedCapacity: 500,
        energyGenerated: 600000,
        climateData: {
          irradiance: 5.4,
          windSpeed: 6.1,
          hydrology: 2.2,
          temperature: 17,
          source: 'OPENWEATHER',
          period: 'recent_10yr',
        },
        financials: {
          capex: 1000000,
          revenue: 150000,
          roi: 7,
          paybackYears: 6.7,
          npv: 220000,
          irr: 11.2,
        },
        createdAt: '2026-06-08T10:12:37.605849',
      },
    })

    const result = await getSimulationById('28')

    expect(result).toEqual({
      id: '28',
      name: 'Solar Demo',
      location: 'San Francisco',
      country: 'US',
      locationLatitude: 37.7749,
      locationLongitude: -122.4194,
      energyType: 'solar',
      createdAt: '2026-06-08T10:12:37.605849',
      roi: 7,
      efficiency: undefined,
      projectSize: 500,
      temperature: 17,
      climateSource: 'OPENWEATHER',
      climatePeriod: 'recent_10yr',
      irradiance: 5.4,
      windSpeed: 6.1,
      hydrology: 2.2,
      capex: 1000000,
      opex: undefined,
      revenue: 150000,
      paybackYears: 6.7,
      npv: 220000,
      irr: 11.2,
      budget: 1000000,
      energyGenerated: 600000,
      estimatedSavings: 150000,
    })
  })

  it('resolves a location from coordinates', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        name: 'Mendoza',
        country: 'AR',
        lat: -32.8895,
        lon: -68.8458,
      },
    })

    const result = await resolveLocation(-32.8895, -68.8458)

    expect(mockedGet).toHaveBeenCalledWith('/simulations/locations/reverse?lat=-32.8895&lon=-68.8458')
    expect(result).toEqual({
      name: 'Mendoza',
      country: 'AR',
      lat: -32.8895,
      lon: -68.8458,
    })
  })

  it('searches location suggestions from backend', async () => {
    mockedGet.mockResolvedValueOnce({
      data: [
        {
          name: 'Mendoza',
          country: 'AR',
          lat: -32.8895,
          lon: -68.8458,
        },
        {
          name: 'Mendoza City',
          country: 'AR',
          lat: -32.9,
          lon: -68.84,
        },
      ],
    })

    const result = await searchLocations('mendoza')

    expect(mockedGet).toHaveBeenCalledWith('/simulations/locations/search?q=mendoza&limit=5')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      name: 'Mendoza',
      country: 'AR',
      lat: -32.8895,
      lon: -68.8458,
    })
  })
})
