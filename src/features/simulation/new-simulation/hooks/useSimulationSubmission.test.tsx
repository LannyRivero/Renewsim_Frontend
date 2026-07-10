import { act, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FormEvent, ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useSimulationSubmission } from './useSimulationSubmission'
import { useToastStore } from '@/stores/toastStore'

const mockNavigate = vi.fn()
const mockCreateRealSimulation = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../../services/simulationService', () => ({
  createRealSimulation: (...args: unknown[]) => mockCreateRealSimulation(...args),
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
    mockCreateRealSimulation.mockReset()
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
          name: 'Proyecto demo',
          technology: 'solar',
          locationSearch: '',
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
            annualConsumptionKwh: 1000,
            monthlyConsumptionKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          economics: {
            currency: 'EUR',
            capexTotal: 1000,
            opexAnnual: 7200,
            electricityPurchasePricePerKwh: 0.18,
            exportPricePerKwh: 0.07,
            discountRatePct: 8,
            projectLifetimeYears: 20,
          },
        },
        event,
      )
    })

    expect(result.current.formError).toBe('La ubicación debe tener al menos 2 caracteres')
    expect(mockCreateRealSimulation).not.toHaveBeenCalled()
  })

  it('submits the backend payload and stores the form input', async () => {
    const setLastResult = vi.fn()
    const setLastRunInput = vi.fn()
    const simulationResult = {
      id: 'sim-1',
      status: 'completed',
      createdAt: '2026-07-01T10:00:00.000Z',
      updatedAt: '2026-07-01T10:00:02.000Z',
      modelVersion: 'solar-spain-v1',
      technology: 'solar',
      location: {
        label: 'Madrid, ES',
        name: 'Madrid',
        country: 'Spain',
        countryCode: 'ES',
        lat: 40.4168,
        lon: -3.7038,
      },
      summary: {
        recommendation: 'recommended',
        headline: 'Good case',
        summary: 'Strong enough',
        reasons: [],
      },
      input: {
        name: 'SOLAR - Madrid',
        technology: 'solar',
        location: {
          label: 'Madrid, ES',
          lat: 40.4168,
          lon: -3.7038,
          country: 'Spain',
          countryCode: 'ES',
        },
        system: {
          installedCapacityKw: 500,
          performanceRatio: 0.81,
          degradationRateAnnualPct: 0.5,
          availabilityPct: 99,
          lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
        },
        demand: {
          annualConsumptionKwh: 1000,
          monthlyConsumptionKwh: [83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.37],
        },
        economics: {
          currency: 'EUR',
          capexTotal: 1000,
          opexAnnual: 20,
          electricityPurchasePricePerKwh: 0.18,
          exportPricePerKwh: 0.07,
          discountRatePct: 8,
          projectLifetimeYears: 20,
        },
      },
      technical: {
        annualGenerationKwh: 10000,
        monthlyGenerationKwh: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        specificYieldKwhPerKwp: 20,
        performanceRatio: 0.81,
        capacityFactorPct: 17,
        selfConsumptionRatePct: 70,
        coverageRatePct: 30,
        resource: {
          source: 'PVGIS',
          period: '2015-2020',
          monthlyIrradianceKwhM2: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          monthlyTemperatureC: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        },
        lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1, total: 13 },
        balanceByMonth: [],
      },
      financial: {
        currency: 'EUR',
        annualSavings: 500,
        annualExportRevenue: 50,
        netAnnualBenefit: 550,
        paybackYears: 2,
        discountedPaybackYears: 3,
        npv: 1000,
        irrPct: 12.3,
        lcoePerKwh: 0.07,
        yearlyCashFlows: [],
      },
      assumptions: {
        discountRatePct: 8,
        projectLifetimeYears: 20,
        degradationRateAnnualPct: 0.5,
        electricityPurchasePricePerKwh: 0.18,
        exportPricePerKwh: 0.07,
        climateSource: 'PVGIS',
        climatePeriod: '2015-2020',
      },
      warnings: [],
    }

    mockCreateRealSimulation.mockResolvedValueOnce(simulationResult)

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
          name: 'SOLAR - Madrid',
          technology: 'solar',
          locationSearch: 'Madrid, ES',
          location: {
            label: 'Madrid, ES',
            lat: 40.4168,
            lon: -3.7038,
            country: 'Spain',
            countryCode: 'ES',
          },
          system: {
            installedCapacityKw: 500,
            performanceRatio: 0.81,
            degradationRateAnnualPct: 0.5,
            availabilityPct: 99,
            lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
          },
          demand: {
            annualConsumptionKwh: 1000,
            monthlyConsumptionKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          economics: {
            currency: 'EUR',
            capexTotal: 1000,
            opexAnnual: 7200,
            electricityPurchasePricePerKwh: 0.18,
            exportPricePerKwh: 0.07,
            discountRatePct: 8,
            projectLifetimeYears: 20,
          },
        },
        event,
      )
      await Promise.resolve()
      await Promise.resolve()
    })

    expect(mockCreateRealSimulation).toHaveBeenCalledTimes(1)
    expect(mockCreateRealSimulation.mock.calls[0]?.[0]).toEqual({
      name: 'SOLAR - Madrid',
      technology: 'solar',
      location: {
        label: 'Madrid, ES',
        lat: 40.4168,
        lon: -3.7038,
        country: 'Spain',
        countryCode: 'ES',
      },
      system: {
        installedCapacityKw: 500,
        performanceRatio: 0.81,
        degradationRateAnnualPct: 0.5,
        availabilityPct: 99,
        lossesPct: {
          inverter: 2,
          temperature: 6,
          wiring: 1,
          soiling: 3,
          other: 1,
        },
      },
      demand: {
        annualConsumptionKwh: 1000,
        monthlyConsumptionKwh: [83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.33, 83.37],
      },
      economics: {
        currency: 'EUR',
        capexTotal: 1000,
        opexAnnual: 7200,
        electricityPurchasePricePerKwh: 0.18,
        exportPricePerKwh: 0.07,
        discountRatePct: 8,
        projectLifetimeYears: 20,
      },
    })
    expect(setLastResult).toHaveBeenCalledWith({
      id: 'sim-1',
      name: 'SOLAR - Madrid',
      status: 'completed',
      createdAt: '2026-07-01T10:00:00.000Z',
      location: 'Madrid, ES',
      energyType: 'solar',
      roi: 12.3,
      efficiency: 81,
    })
    expect(setLastRunInput).toHaveBeenCalledWith({
      name: 'SOLAR - Madrid',
      technology: 'solar',
      locationSearch: 'Madrid, ES',
      location: {
        label: 'Madrid, ES',
        lat: 40.4168,
        lon: -3.7038,
        country: 'Spain',
        countryCode: 'ES',
      },
      system: {
        installedCapacityKw: 500,
        performanceRatio: 0.81,
        degradationRateAnnualPct: 0.5,
        availabilityPct: 99,
        lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
      },
      demand: {
        annualConsumptionKwh: 1000,
        monthlyConsumptionKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      economics: {
        currency: 'EUR',
        capexTotal: 1000,
        opexAnnual: 7200,
        electricityPurchasePricePerKwh: 0.18,
        exportPricePerKwh: 0.07,
        discountRatePct: 8,
        projectLifetimeYears: 20,
      },
    })
    expect(mockNavigate).toHaveBeenCalledWith('/simulador/detalles?id=sim-1')
  })
})
