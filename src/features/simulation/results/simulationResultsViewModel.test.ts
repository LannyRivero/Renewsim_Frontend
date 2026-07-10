import { describe, expect, it } from 'vitest'
import { buildSimulationResultsViewModel } from './simulationResultsViewModel'

describe('buildSimulationResultsViewModel', () => {
  it('prefers real simulation details response when available', () => {
    const result = buildSimulationResultsViewModel({
      data: null,
      realData: {
        id: 'sim-real-1',
        status: 'completed',
        createdAt: '2026-06-30T14:00:00.000Z',
        updatedAt: '2026-06-30T14:00:02.000Z',
        modelVersion: 'solar-spain-v1',
        technology: 'solar',
        location: {
          label: 'Sevilla, Andalucia, ES',
          name: 'Sevilla',
          country: 'Spain',
          countryCode: 'ES',
          lat: 37.3891,
          lon: -5.9845,
        },
        summary: {
          recommendation: 'recommended',
          headline: 'Strong case.',
          summary: 'Strong technical and financial outputs.',
          reasons: [],
        },
        input: {
          name: 'Solar - Sevilla industrial roof',
          technology: 'solar',
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
        warnings: [],
      },
      lastResult: null,
      lastRunInput: null,
      technologies: [],
    })

    expect(result.resultLocation).toBe('Sevilla, Andalucia, ES')
    expect(result.energyValue).toBe('457,200 kWh')
    expect(result.savingsValue).toBe('$68,700/year')
    expect(result.paybackValue).toBe('6.9 years')
    expect(result.roiValue).toBe('11.4%')
    expect(result.efficiencyValue).toBe('81%')
    expect(result.recommendedTechnology).toBe('Escenario recomendado')
    expect(result.recommendationStatus).toBe('recommended')
    expect(result.climateSource).toBe('PVGIS')
  })
})
