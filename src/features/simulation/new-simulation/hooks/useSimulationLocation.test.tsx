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
          name: '',
          technology: 'solar',
          locationSearch: initialLocation,
          location: {
            label: '',
            lat: 40.4168,
            lon: -3.7038,
            country: '',
            countryCode: '',
          },
          system: {
            installedCapacityKw: 500,
            performanceRatio: 0.81,
            degradationRateAnnualPct: 0.5,
            availabilityPct: 99,
            lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
          },
          demand: {
            annualConsumptionKwh: 1_000,
            monthlyConsumptionKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          economics: {
            currency: 'EUR',
            capexTotal: 1_000_000,
            opexAnnual: 7200,
            electricityPurchasePricePerKwh: 0.18,
            exportPricePerKwh: 0.07,
            discountRatePct: 8,
            projectLifetimeYears: 20,
          },
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
      { label: 'Mendoza, AR', name: 'Mendoza', country: 'AR', countryCode: 'AR', lat: -32.8895, lon: -68.8458 },
    ])

    const { result } = renderLocationHook('Mend')

    await waitFor(() => {
      expect(mockedSearchLocations).toHaveBeenCalledWith('Mend')
      expect(result.current.location.locationSuggestions).toEqual([
        { label: 'Mendoza, AR', name: 'Mendoza', country: 'AR', countryCode: 'AR', lat: -32.8895, lon: -68.8458 },
      ])
    }, { timeout: 1500 })
  })

  it('applies a selected suggestion into form state', () => {
    const { result } = renderLocationHook()

    act(() => {
      result.current.location.applyLocationSuggestion({
        label: 'Mendoza, AR',
        name: 'Mendoza',
        country: 'AR',
        countryCode: 'AR',
        lat: -32.8895,
        lon: -68.8458,
      })
    })

    expect(result.current.form.getValues('locationSearch')).toBe('Mendoza, AR')
    expect(result.current.form.getValues('location')).toEqual({
      label: 'Mendoza, AR',
      lat: -32.8895,
      lon: -68.8458,
      country: 'AR',
      countryCode: 'AR',
    })
  })

  it('clears the resolved location when the user edits the selected search text', () => {
    const { result } = renderLocationHook()

    act(() => {
      result.current.location.applyLocationSuggestion({
        label: 'Mendoza, AR',
        name: 'Mendoza',
        country: 'AR',
        countryCode: 'AR',
        lat: -32.8895,
        lon: -68.8458,
      })
    })

    act(() => {
      result.current.form.setValue('locationSearch', 'Cordoba, AR', { shouldValidate: true, shouldDirty: true })
      result.current.location.handleLocationSearchChange('Cordoba, AR')
    })

    expect(result.current.form.getValues('location')).toEqual({
      label: '',
      lat: 0,
      lon: 0,
      country: '',
      countryCode: '',
    })
  })

  it('resolves browser geolocation into city and country', async () => {
    mockedResolveLocation.mockResolvedValueOnce({
      label: 'Mendoza, AR',
      name: 'Mendoza',
      country: 'AR',
      countryCode: 'AR',
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
      result.current.location.startBrowserLocationResolution()
      await Promise.resolve()
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(mockedResolveLocation).toHaveBeenCalledWith(-32.8895, -68.8458)
      expect(result.current.form.getValues('locationSearch')).toBe('Mendoza, AR')
      expect(result.current.form.getValues('location')).toEqual({
        label: 'Mendoza, AR',
        lat: -32.8895,
        lon: -68.8458,
        country: 'AR',
        countryCode: 'AR',
      })
      expect(result.current.location.locationAssistMessage).toBe('Ubicación actual cargada: Mendoza, AR.')
    })
  })

  it('clears the assist message when the user edits the search manually', async () => {
    mockedResolveLocation.mockResolvedValueOnce({
      label: 'Mendoza, AR',
      name: 'Mendoza',
      country: 'AR',
      countryCode: 'AR',
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
      result.current.location.startBrowserLocationResolution()
      await Promise.resolve()
      await Promise.resolve()
    })

    await waitFor(() => {
      expect(result.current.location.locationAssistMessage).toBe('Ubicación actual cargada: Mendoza, AR.')
    })

    act(() => {
      result.current.form.setValue('locationSearch', 'Cordoba, AR', { shouldValidate: true, shouldDirty: true })
      result.current.location.handleLocationSearchChange('Cordoba, AR')
    })

    expect(result.current.location.locationAssistMessage).toBeNull()
  })
})
