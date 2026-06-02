import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FormEvent, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSimulationSubmission } from './useSimulationSubmission'
import { useToastStore } from '@/stores/toastStore'

const mockNavigate = vi.fn()
const mockCreateSimulation = vi.fn()
const mockGetClimateData = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services/simulationService', () => ({
  createSimulation: (...args: unknown[]) => mockCreateSimulation(...args),
}))

vi.mock('../../services/weatherService', () => ({
  getClimateData: (...args: unknown[]) => mockGetClimateData(...args),
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
    mockGetClimateData.mockReset()
    useToastStore.setState({ toasts: [] })
  })

  it('returns validation message on invalid draft', () => {
    const setResolvedClimate = vi.fn()
    const setClimatePreview = vi.fn()
    const setLastResult = vi.fn()
    const setLastRunInput = vi.fn()

    const { result } = renderHook(
      () =>
        useSimulationSubmission({
          draft: { location: '', energyType: 'solar', projectSize: 500, budget: 1000 },
          climateState: {
            resolvedClimate: null,
            setResolvedClimate,
            setClimatePreview,
          },
          simulationActions: {
            setLastResult,
            setLastRunInput,
          },
        }),
      { wrapper: createWrapper() },
    )

    const event = { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>

    act(() => {
      result.current.handleSubmit(event)
    })

    expect(result.current.formError).toBe('Location must be at least 2 characters')
    expect(mockCreateSimulation).not.toHaveBeenCalled()
  })

  it('submits using resolved climate without refetching', async () => {
    const setResolvedClimate = vi.fn()
    const setClimatePreview = vi.fn()
    const setLastResult = vi.fn()
    const setLastRunInput = vi.fn()
    const simulationResult = { id: 'sim-1', location: 'Madrid', energyType: 'solar' }

    mockCreateSimulation.mockResolvedValueOnce(simulationResult)

    const { result } = renderHook(
      () =>
        useSimulationSubmission({
          draft: { location: 'Madrid', energyType: 'solar', projectSize: 500, budget: 1000 },
          climateState: {
            resolvedClimate: {
              location: 'Madrid',
              energyType: 'solar',
              data: { irradiance: 5, windSpeed: 4, hydrology: 3 },
            },
            setResolvedClimate,
            setClimatePreview,
          },
          simulationActions: {
            setLastResult,
            setLastRunInput,
          },
        }),
      { wrapper: createWrapper() },
    )

    const event = { preventDefault: vi.fn() } as unknown as FormEvent<HTMLFormElement>

    await act(async () => {
      result.current.handleSubmit(event)
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(mockGetClimateData).not.toHaveBeenCalled()
    expect(mockCreateSimulation).toHaveBeenCalledTimes(1)
    expect(setLastResult).toHaveBeenCalledWith(simulationResult)
    expect(mockNavigate).toHaveBeenCalledWith('/simulador/resultados')
  })
})
