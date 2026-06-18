import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FormEvent, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSimulationSubmission } from './useSimulationSubmission'
import { useToastStore } from '@/stores/toastStore'

const mockNavigate = vi.fn()
const mockCreateSimulation = vi.fn()
const mockGetSimulationById = vi.fn()
const mockGetSimulationHistory = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services/simulationService', () => ({
  createSimulation: (...args: unknown[]) => mockCreateSimulation(...args),
  getSimulationById: (...args: unknown[]) => mockGetSimulationById(...args),
  getSimulationHistory: (...args: unknown[]) => mockGetSimulationHistory(...args),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useSimulationSubmission', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockCreateSimulation.mockReset()
    mockGetSimulationById.mockReset()
    mockGetSimulationHistory.mockReset()
    useToastStore.setState({ toasts: [] })
  })

  it('returns validation message on invalid draft', () => {
    const setLastResult = vi.fn()
    const setLastRunInput = vi.fn()

    const { result } = renderHook(
      () =>
        useSimulationSubmission({
          simulationActions: {
            setLastResult,
            setLastRunInput,
          },
        }),
      { wrapper: createWrapper() },
    )

    const event = { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(
        {
          location: '',
          energyType: 'solar',
          projectSize: 500,
          budget: 1000,
          energyConsumption: 1000,
          locationLatitude: 40.4168,
          locationLongitude: -3.7038,
        },
        event,
      )
    })

    expect(result.current.formError).toBe('La ubicación debe tener al menos 2 caracteres')
    expect(mockCreateSimulation).not.toHaveBeenCalled()
  })

  it('submits the backend payload and stores the form input', async () => {
    const setLastResult = vi.fn()
    const setLastRunInput = vi.fn()
    const simulationResult = { id: 'sim-1', name: 'SOLAR - Madrid', status: 'completed' }

    mockCreateSimulation.mockResolvedValueOnce(simulationResult)
    mockGetSimulationById.mockResolvedValueOnce({ id: 'sim-1', location: 'Madrid', energyType: 'solar' })
    mockGetSimulationHistory.mockResolvedValueOnce([])

    const { result } = renderHook(
      () =>
        useSimulationSubmission({
          simulationActions: {
            setLastResult,
            setLastRunInput,
          },
        }),
      { wrapper: createWrapper() },
    )

    const event = { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>

    await act(async () => {
      result.current.handleSubmit(
        {
          location: 'Madrid',
          energyType: 'solar',
          projectSize: 500,
          budget: 1000,
          energyConsumption: 1000,
          locationLatitude: 40.4168,
          locationLongitude: -3.7038,
        },
        event,
      )
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(mockCreateSimulation).toHaveBeenCalledTimes(1)
    expect(mockCreateSimulation.mock.calls[0]?.[0]).toEqual({
      name: 'SOLAR - Madrid',
      technology: 'solar',
      installedCapacity: 500,
      location: {
        lat: 40.4168,
        lon: -3.7038,
      },
    })
    expect(mockGetSimulationById).toHaveBeenCalledWith('sim-1')
    expect(mockGetSimulationHistory).toHaveBeenCalledTimes(1)
    expect(setLastResult).toHaveBeenCalledWith(simulationResult)
    expect(setLastRunInput).toHaveBeenCalledWith({
      location: 'Madrid',
      energyType: 'solar',
      projectSize: 500,
      budget: 1000,
      energyConsumption: 1000,
      locationLatitude: 40.4168,
      locationLongitude: -3.7038,
    })
    expect(mockNavigate).toHaveBeenCalledWith('/simulador/resultados?id=sim-1')
  })
})
