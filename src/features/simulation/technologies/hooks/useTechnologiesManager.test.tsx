import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type React from 'react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTechnologiesManager } from './useTechnologiesManager'
import { useTechnologyStore } from '@/stores/technologyStore'
import { useToastStore } from '@/stores/toastStore'

const mockGetAllTechnologies = vi.fn()
const mockCreateTechnology = vi.fn()
const mockDeleteTechnologyById = vi.fn()
const mockUpdateTechnologyById = vi.fn()

vi.mock('../services/technologyService', () => ({
  getAllTechnologies: (...args: unknown[]) => mockGetAllTechnologies(...args),
  createTechnology: (...args: unknown[]) => mockCreateTechnology(...args),
  deleteTechnologyById: (...args: unknown[]) => mockDeleteTechnologyById(...args),
  updateTechnologyById: (...args: unknown[]) => mockUpdateTechnologyById(...args),
}))

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })

  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useTechnologiesManager', () => {
  beforeEach(() => {
    mockGetAllTechnologies.mockReset()
    mockCreateTechnology.mockReset()
    mockDeleteTechnologyById.mockReset()
    mockUpdateTechnologyById.mockReset()
    mockGetAllTechnologies.mockResolvedValue([])
    useTechnologyStore.getState().resetDraft()
    useToastStore.setState({ toasts: [] })
  })

  it('shows validation error for invalid draft', async () => {
    useTechnologyStore.getState().setDraftField('name', '')

    const { result } = renderHook(() => useTechnologiesManager(), { wrapper: createWrapper() })

    const event = { preventDefault: vi.fn() } as unknown as React.FormEvent

    act(() => {
      result.current.submitTechnology(event)
    })

    expect(result.current.formError).toBe('Technology name must be at least 2 characters')
    expect(mockCreateTechnology).not.toHaveBeenCalled()
  })

  it('submits normalized efficiency for valid draft', async () => {
    useTechnologyStore.getState().setDraftField('name', 'Solar X')
    useTechnologyStore.getState().setDraftField('efficiency', 80)
    mockCreateTechnology.mockResolvedValue(undefined)

    const { result } = renderHook(() => useTechnologiesManager(), { wrapper: createWrapper() })
    const event = { preventDefault: vi.fn() } as unknown as React.FormEvent

    act(() => {
      result.current.submitTechnology(event)
    })

    await waitFor(() => {
      expect(mockCreateTechnology).toHaveBeenCalled()
      expect(mockCreateTechnology.mock.calls[0]?.[0]).toEqual(
        expect.objectContaining({ name: 'Solar X', efficiency: 0.8, installedPower: 1, capacityFactor: 18 }),
      )
    })
  })

  it('updates technology when editing is active', async () => {
    mockUpdateTechnologyById.mockResolvedValue(undefined)

    const { result } = renderHook(() => useTechnologiesManager(), { wrapper: createWrapper() })

    act(() => {
      result.current.startEditingTechnology({
        id: 'tech-1',
        name: 'Wind Old',
        energyType: 'WIND',
        installedPower: 2000,
        capacityFactor: 35,
        efficiency: 0.85,
        co2Reduction: 100,
        installationCost: 2000,
        maintenanceCost: 100,
        environmentalImpact: 30,
      })
      result.current.setDraftField('name', 'Wind Updated')
    })

    const event = { preventDefault: vi.fn() } as unknown as React.FormEvent
    act(() => {
      result.current.submitTechnology(event)
    })

    await waitFor(() => {
      expect(mockUpdateTechnologyById).toHaveBeenCalledWith(
        'tech-1',
        expect.objectContaining({ name: 'Wind Updated', installedPower: 2000, capacityFactor: 35 }),
      )
    })
  })

  it('shows protected delete message on backend conflict', async () => {
    mockDeleteTechnologyById.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 409 },
    })

    const { result } = renderHook(() => useTechnologiesManager(), { wrapper: createWrapper() })

    act(() => {
      result.current.deleteMutation.mutate('tech-1')
    })

    await waitFor(() => {
      expect(useToastStore.getState().toasts[0]?.title).toBe('Delete Blocked')
    })
  })
})
