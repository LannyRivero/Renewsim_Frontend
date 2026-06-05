import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSimulation } from './simulationService'
import { httpClient } from '@/services/httpClient'

vi.mock('@/services/httpClient', () => ({
  httpClient: {
    post: vi.fn(),
  },
}))

const mockedPost = vi.mocked(httpClient.post)

describe('simulationService.createSimulation', () => {
  beforeEach(() => {
    mockedPost.mockReset()
  })

  it('normalizes numeric id and uppercase energyType from API', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        id: 6,
        location: 'Madrid, Community of Madrid, ES',
        energyType: 'SOLAR',
        projectSize: 500,
        budget: 1000000,
      },
    })

    const result = await createSimulation({
      location: 'Madrid, Community of Madrid, ES',
      energyType: 'solar',
      projectSize: 500,
      budget: 1_000_000,
      energyConsumption: 1_000,
      climate: {
        irradiance: 5.66,
        windSpeed: 1.27,
        hydrology: 1.04,
      },
    })

    expect(result).toEqual({
      id: '6',
      location: 'Madrid, Community of Madrid, ES',
      energyType: 'solar',
      roi: undefined,
      efficiency: undefined,
    })
  })
})
