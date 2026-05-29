import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useClimatePreview } from './useClimatePreview'

const mockGetClimateData = vi.fn()

vi.mock('../../services/weatherService', () => ({
  getClimateData: (...args: unknown[]) => mockGetClimateData(...args),
}))

describe('useClimatePreview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockGetClimateData.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('keeps default preview when location is shorter than 2 chars', () => {
    const { result } = renderHook(() => useClimatePreview({ location: 'a', energyType: 'solar' }))

    expect(result.current.displayedClimatePreview).toEqual({
      irradiance: '-',
      windSpeed: '-',
      hydrology: '3.0',
    })
    expect(mockGetClimateData).not.toHaveBeenCalled()
  })

  it('loads and maps climate preview values', async () => {
    mockGetClimateData.mockResolvedValueOnce({ irradiance: 6.1, windSpeed: 3.8, hydrology: 2.2 })

    const { result } = renderHook(() => useClimatePreview({ location: 'Madrid', energyType: 'solar' }))

    await act(async () => {
      vi.advanceTimersByTime(500)
      await Promise.resolve()
    })

    expect(mockGetClimateData).toHaveBeenCalledWith('Madrid', 'solar')
    expect(result.current.displayedClimatePreview).toEqual({
      irradiance: '6.1',
      windSpeed: '3.8',
      hydrology: '2.2',
    })
  })
})
