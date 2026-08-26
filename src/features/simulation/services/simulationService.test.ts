import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createRealSimulation,
  getRealSimulationById,
  getRealSimulationHistory,
  resolveLocation,
  searchLocations,
  updateSimulationById,
} from './simulationService'
import type { RealCreateSimulationRequest } from '@/shared/types'
import { httpClient } from '@/services/httpClient'

vi.mock('@/services/httpClient', () => ({
  httpClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
}))

const mockedPost = vi.mocked(httpClient.post)
const mockedGet = vi.mocked(httpClient.get)
const mockedPut = vi.mocked(httpClient.put)

describe('simulationService', () => {
  beforeEach(() => {
    mockedPost.mockReset()
    mockedGet.mockReset()
    mockedPut.mockReset()
  })

  it('normalizes real simulation create response', async () => {
    mockedPost.mockResolvedValueOnce({
      data: {
        id: 'sim-real-1',
        status: 'completed',
        createdAt: '2026-06-30T14:00:00.000Z',
        updatedAt: '2026-06-30T14:00:02.000Z',
        modelVersion: 'solar-spain-v1',
        technology: 'solar',
        location: {
          label: 'Sevilla, Andalucia, ES',
          name: 'Sevilla',
          adminRegion: 'Andalucia',
          country: 'Spain',
          countryCode: 'ES',
          lat: 37.3891,
          lon: -5.9845,
          timezone: 'Europe/Madrid',
        },
        summary: {
          recommendation: 'viable_with_reservations',
          headline: 'Scenario can proceed with validation.',
          summary: 'Needs economic validation.',
          reasons: [
            { area: 'economics', severity: 'warning', message: 'Discounted recovery is still above target.' },
          ],
        },
        input: {
          name: 'Solar - Sevilla industrial roof',
          location: {
            label: 'Sevilla, Andalucia, ES',
            lat: 37.3891,
            lon: -5.9845,
            country: 'Spain',
            countryCode: 'ES',
          },
          system: {
            installedCapacityKw: 300,
            performanceRatio: 0.81,
            degradationRateAnnualPct: 0.5,
            availabilityPct: 99,
            lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
          },
          demand: {
            annualConsumptionKwh: 1050000,
            monthlyConsumptionKwh: [92000, 85000, 80000, 76000, 78000, 82000, 91000, 98000, 97000, 93000, 90000, 88000],
          },
          economics: {
            currency: 'EUR',
            capexTotal: 315000,
            opexAnnual: 7200,
            electricityPurchasePricePerKwh: 0.18,
            exportPricePerKwh: 0.07,
            discountRatePct: 8,
            projectLifetimeYears: 20,
          },
        },
        technical: {
          annualGenerationKwh: 457200,
          monthlyGenerationKwh: [24800, 29100, 39300, 44400, 49800, 51800, 52500, 49500, 43100, 35500, 27800, 19300],
          specificYieldKwhPerKwp: 1524,
          performanceRatio: 0.81,
          capacityFactorPct: 17.4,
          selfConsumptionRatePct: 72.3,
          coverageRatePct: 31.5,
          resource: {
            source: 'PVGIS',
            period: '2015-2020',
            monthlyIrradianceKwhM2: [71, 96, 142, 168, 196, 215, 224, 205, 162, 121, 82, 61],
            monthlyTemperatureC: [10, 12, 15, 17, 22, 27, 31, 31, 27, 21, 15, 11],
          },
          lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1, total: 13 },
          balanceByMonth: [],
        },
        financial: {
          currency: 'EUR',
          annualSavings: 68700,
          annualExportRevenue: 8800,
          netAnnualBenefit: 70300,
          paybackYears: 6.9,
          discountedPaybackYears: 8.7,
          npv: 121500,
          irrPct: 11.4,
          lcoePerKwh: 0.071,
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
        warnings: [
          { severity: 'info', code: 'MONTHLY_PROFILE_USER_SUPPLIED', message: 'Monthly demand profile was supplied by the user.' },
        ],
      },
    })

    const result = await createRealSimulation({
      name: 'Solar - Sevilla industrial roof',
      energyType: 'solar',
      location: {
        label: 'Sevilla, Andalucia, ES',
        lat: 37.3891,
        lon: -5.9845,
        country: 'Spain',
        countryCode: 'ES',
      },
      system: {
        installedCapacityKw: 300,
        performanceRatio: 0.81,
        degradationRateAnnualPct: 0.5,
        availabilityPct: 99,
        lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
      },
      demand: {
        annualConsumptionKwh: 1050000,
        monthlyConsumptionKwh: [92000, 85000, 80000, 76000, 78000, 82000, 91000, 98000, 97000, 93000, 90000, 88000],
      },
      economics: {
        currency: 'EUR',
        capexTotal: 315000,
        opexAnnual: 7200,
        electricityPurchasePricePerKwh: 0.18,
        exportPricePerKwh: 0.07,
        discountRatePct: 8,
        projectLifetimeYears: 20,
      },
    })

    expect(result.modelVersion).toBe('solar-spain-v1')
    expect(result.location.name).toBe('Sevilla')
    expect(result.technical.annualGenerationKwh).toBe(457200)
    expect(result.financial.irrPct).toBe(11.4)
    expect(result.summary.recommendation).toBe('viable_with_reservations')
  })

  it('normalizes real simulation details response', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        id: 'sim-real-2',
        status: 'completed',
        createdAt: '2026-06-30T14:00:00.000Z',
        updatedAt: '2026-06-30T14:00:02.000Z',
        modelVersion: 'solar-spain-v1',
        technology: 'solar',
        location: {
          label: 'Cordoba, Andalucia, ES',
          name: 'Cordoba',
          country: 'Spain',
          countryCode: 'ES',
          lat: 37.8882,
          lon: -4.7794,
        },
        summary: {
          recommendation: 'recommended',
          headline: 'Solid case.',
          summary: 'Strong technical and financial outputs.',
          reasons: [],
        },
        input: {
          name: 'Solar - Cordoba roof',
          location: {
            label: 'Cordoba, Andalucia, ES',
            lat: 37.8882,
            lon: -4.7794,
            country: 'Spain',
            countryCode: 'ES',
          },
          system: {
            installedCapacityKw: 250,
            performanceRatio: 0.84,
            degradationRateAnnualPct: 0.5,
            availabilityPct: 99,
            lossesPct: { inverter: 2, temperature: 5, wiring: 1, soiling: 2, other: 1 },
          },
          demand: {
            annualConsumptionKwh: 800000,
            monthlyConsumptionKwh: [65000, 62000, 61000, 59000, 60000, 64000, 70000, 73000, 71000, 69000, 68000, 66000],
          },
          economics: {
            currency: 'EUR',
            capexTotal: 280000,
            opexAnnual: 6500,
            electricityPurchasePricePerKwh: 0.19,
            exportPricePerKwh: 0.07,
            discountRatePct: 8,
            projectLifetimeYears: 20,
          },
        },
        technical: {
          annualGenerationKwh: 401000,
          monthlyGenerationKwh: [22000, 25500, 34000, 39000, 43000, 46000, 47000, 44500, 39000, 32000, 25000, 18000],
          specificYieldKwhPerKwp: 1604,
          performanceRatio: 0.84,
          capacityFactorPct: 18.3,
          selfConsumptionRatePct: 74,
          coverageRatePct: 35,
          resource: {
            source: 'PVGIS',
            period: '2015-2020',
            monthlyIrradianceKwhM2: [70, 94, 138, 164, 191, 212, 220, 201, 160, 119, 79, 58],
            monthlyTemperatureC: [9, 11, 14, 17, 22, 28, 32, 32, 27, 20, 14, 10],
          },
          lossesPct: { inverter: 2, temperature: 5, wiring: 1, soiling: 2, other: 1, total: 11 },
          balanceByMonth: [],
        },
        financial: {
          currency: 'EUR',
          annualSavings: 71000,
          annualExportRevenue: 7000,
          netAnnualBenefit: 71500,
          paybackYears: 5.8,
          discountedPaybackYears: 7.4,
          npv: 145000,
          irrPct: 12.8,
          lcoePerKwh: 0.068,
          yearlyCashFlows: [],
        },
        assumptions: {
          discountRatePct: 8,
          projectLifetimeYears: 20,
          degradationRateAnnualPct: 0.5,
          electricityPurchasePricePerKwh: 0.19,
          exportPricePerKwh: 0.07,
          climateSource: 'PVGIS',
          climatePeriod: '2015-2020',
        },
        warnings: [],
      },
    })

    const result = await getRealSimulationById('sim-real-2')

    expect(mockedGet).toHaveBeenCalledWith('/simulations/sim-real-2')
    expect(result.location.label).toBe('Cordoba, Andalucia, ES')
    expect(result.summary.recommendation).toBe('recommended')
    expect(result.financial.npv).toBe(145000)
  })

  it('normalizes real simulation history response', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'sim-real-3',
            name: 'Solar - Malaga roof',
            technology: 'solar',
            status: 'completed',
            createdAt: '2026-06-30T14:00:00.000Z',
            locationLabel: 'Malaga, Andalucia, ES',
            annualGenerationKwh: 390000,
            annualSavings: 68000,
            npv: 130000,
            irrPct: 11.9,
            recommendation: 'recommended',
            modelVersion: 'solar-spain-v1',
            resourceSource: 'PVGIS',
          },
        ],
        total: 1,
      },
    })

    const result = await getRealSimulationHistory()

    expect(result.total).toBe(1)
    expect(result.items[0]).toMatchObject({
      id: 'sim-real-3',
      name: 'Solar - Malaga roof',
      locationLabel: 'Malaga, Andalucia, ES',
      recommendation: 'recommended',
    })
  })

  it('normalizes history rows from detailed simulation payloads', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'sim-real-4',
            name: 'Solar - Cordoba warehouse',
            technology: 'solar',
            status: 'completed',
            createdAt: '2026-07-01T09:30:00.000Z',
            modelVersion: 'solar-spain-v1',
            location: {
              label: 'Cordoba, Andalucia, ES',
              name: 'Cordoba',
              country: 'Spain',
              countryCode: 'ES',
              lat: 37.8882,
              lon: -4.7794,
            },
            summary: {
              recommendation: 'viable_with_reservations',
              headline: 'Proceed carefully.',
              summary: 'Financials need another pass.',
              reasons: [],
            },
            technical: {
              annualGenerationKwh: 401000,
              resource: {
                source: 'PVGIS',
                period: '2015-2020',
                monthlyIrradianceKwhM2: [],
                monthlyTemperatureC: [],
              },
            },
            financial: {
              annualSavings: 71000,
              npv: 145000,
              irrPct: 12.8,
            },
          },
        ],
        total: 1,
      },
    })

    const result = await getRealSimulationHistory()

    expect(result.total).toBe(1)
    expect(result.items[0]).toMatchObject({
      id: 'sim-real-4',
      name: 'Solar - Cordoba warehouse',
      technology: 'solar',
      locationLabel: 'Cordoba, Andalucia, ES',
      annualGenerationKwh: 401000,
      annualSavings: 71000,
      npv: 145000,
      irrPct: 12.8,
      recommendation: 'viable_with_reservations',
      resourceSource: 'PVGIS',
    })
  })

  it('sends the real contract on update', async () => {
    const payload: RealCreateSimulationRequest = {
      name: 'Solar Madrid Updated',
      energyType: 'solar',
      location: {
        label: 'Madrid, ES',
        lat: 40.4168,
        lon: -3.7038,
        country: 'Spain',
        countryCode: 'ES',
      },
      system: {
        installedCapacityKw: 650,
        performanceRatio: 0.81,
        degradationRateAnnualPct: 0.5,
        availabilityPct: 99,
        lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
      },
      demand: {
        annualConsumptionKwh: 2400,
        monthlyConsumptionKwh: [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200] as const,
      },
      economics: {
        currency: 'EUR',
        capexTotal: 900,
        opexAnnual: 20,
        electricityPurchasePricePerKwh: 0.25,
        exportPricePerKwh: 0.07,
        discountRatePct: 8,
        projectLifetimeYears: 20,
      },
    }

    await updateSimulationById('sim-edit-1', payload)

    expect(mockedPut).toHaveBeenCalledWith('/simulations/sim-edit-1', payload)
  })

  it('resolves a location from coordinates', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        label: 'Mendoza, AR',
        name: 'Mendoza',
        country: 'AR',
        countryCode: 'AR',
        lat: -32.8895,
        lon: -68.8458,
      },
    })

    const result = await resolveLocation(-32.8895, -68.8458)

    expect(mockedGet).toHaveBeenCalledWith('/simulations/locations/reverse?lat=-32.8895&lon=-68.8458')
    expect(result).toEqual({
      label: 'Mendoza, AR',
      name: 'Mendoza',
      country: 'AR',
      countryCode: 'AR',
      lat: -32.8895,
      lon: -68.8458,
    })
  })

  it('searches location suggestions from backend', async () => {
    mockedGet.mockResolvedValueOnce({
      data: [
        {
          label: 'Mendoza, AR',
          name: 'Mendoza',
          country: 'AR',
          countryCode: 'AR',
          lat: -32.8895,
          lon: -68.8458,
        },
        {
          label: 'Mendoza City, AR',
          name: 'Mendoza City',
          country: 'AR',
          countryCode: 'AR',
          lat: -32.9,
          lon: -68.84,
        },
      ],
    })

    const result = await searchLocations('mendoza')

    expect(mockedGet).toHaveBeenCalledWith('/simulations/locations/search?q=mendoza&limit=5')
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      label: 'Mendoza, AR',
      name: 'Mendoza',
      country: 'AR',
      countryCode: 'AR',
      lat: -32.8895,
      lon: -68.8458,
    })
  })
})
