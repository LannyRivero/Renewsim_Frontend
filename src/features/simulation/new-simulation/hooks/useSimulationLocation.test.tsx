import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSimulationLocation } from './useSimulationLocation'
import { resolveLocation, searchLocations } from '../../services/simulationService'
import type { SimulationCreateFormInput, SimulationCreateFormValues } from '../../schemas/simulationSchema'

vi.mock('../../services/simulationService', () => ({
  resolveLocation: vi.fn(),
  searchLocations: vi.fn(),
}))

const mockedResolveLocation = vi.mocked(resolveLocation)
const mockedSearchLocations = vi.mocked(searchLocations)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

function renderLocationHook(initialLocation = '') {
  return renderHook(
    () => {
      const form = useForm<SimulationCreateFormInput, undefined, SimulationCreateFormValues>({
        defaultValues: {
          location: initialLocation,
          energyType: 'solar',
          projectSize: 500,
          budget: 1_000_000,
          energyConsumption: 1_000,
          locationLatitude: 40.4168,
          locationLongitude: -3.7038,
        },
      })

      const location = useSimulationLocation({ form })

      return { form, location }
    },
    { wrapper: createWrapper() },
  )
}

describe('useSimulationLocation', () => {
  beforeEach(() => {
    mockedResolveLocation.mockReset()
    mockedSearchLocations.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('loads backend suggestions after the debounce window', async () => {
    mockedSearchLocations.mockResolvedValueOnce([
      { name: 'Mendoza', country: 'AR', lat: -32.8895, lon: -68.8458 },
    ])

    const { result } = renderLocationHook('Mend')

    await waitFor(() => {
      expect(mockedSearchLocations).toHaveBeenCalledWith('Mend')
      expect(result.current.location.locationSuggestions).toEqual([
        { name: 'Mendoza', country: 'AR', lat: -32.8895, lon: -68.8458 },
      ])
    }, { timeout: 1500 })
  })

  it('applies a selected suggestion into form state', () => {
    const { result } = renderLocationHook()

    act(() => {
      result.current.location.applyLocationSuggestion({
        name: 'Mendoza',
        country: 'AR',
        lat: -32.8895,
        lon: -68.8458,
      })
    })

    expect(result.current.form.getValues('location')).toBe('Mendoza, AR')
    expect(result.current.form.getValues('locationLatitude')).toBe(-32.8895)
    expect(result.current.form.getValues('locationLongitude')).toBe(-68.8458)
    expect(result.current.location.locationAssistMessage).toBe('Ubicación seleccionada: Mendoza, AR.')
  })

  it('resolves browser geolocation into city and country', async () => {
    mockedResolveLocation.mockResolvedValueOnce({
      name: 'Mendoza',
      country: 'AR',
      lat: -32.8895,
      lon: -68.8458,
    })

    vi.stubGlobal('navigator', {
      ...navigator,
      geolocation: {
        getCurrentPosition: (success: PositionCallback) => {
          success({
            coords: {
              latitude: -32.8895,
              longitude: -68.8458,
              accuracy: 1,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
              toJSON: () => ({}),
            },
            timestamp: Date.now(),
            toJSON: () => ({}),
          } as GeolocationPosition)
        },
      },
    })

    const { result } = renderLocationHook()

    await act(async () => {
      result.current.location.useBrowserLocation()
      await Promise.resolve()
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(mockedResolveLocation).toHaveBeenCalledWith(-32.8895, -68.8458)
      expect(result.current.form.getValues('location')).toBe('Mendoza, AR')
      expect(result.current.form.getValues('locationLatitude')).toBe(-32.8895)
      expect(result.current.form.getValues('locationLongitude')).toBe(-68.8458)
      expect(result.current.location.locationAssistMessage).toBe('Ubicación actual cargada: Mendoza, AR.')
    })
  })
})
