import type { SimulationDetailsResponse, SimulationHistoryRow } from '@/shared/types'

export function buildSimulationDetailsResponseMock(
  overrides: Partial<SimulationDetailsResponse> = {},
): SimulationDetailsResponse {
  return {
    id: 'sim-store-1',
    status: 'completed' as const,
    createdAt: '2024-05-12T00:00:00.000Z',
    updatedAt: '2024-05-12T00:00:00.000Z',
    modelVersion: 'solar-spain-v1',
    technology: 'solar' as const,
    location: {
      label: 'Valencia, ES',
      name: 'Valencia',
      country: 'Spain',
      countryCode: 'ES',
      lat: 39.4699,
      lon: -0.3763,
    },
    summary: {
      recommendation: 'viable_with_reservations' as const,
      headline: 'El escenario puede seguir evaluándose con validaciones adicionales.',
      summary: 'Los indicadores permiten continuar el análisis, aunque todavía no alcanzan una señal concluyente.',
      reasons: [
        { area: 'economics' as const, severity: 'positive' as const, message: 'El retorno proyectado aporta una base económica más favorable.' },
        { area: 'economics' as const, severity: 'warning' as const, message: 'El tiempo de retorno es moderado.' },
        { area: 'technical' as const, severity: 'positive' as const, message: 'La eficiencia operativa esperada acompaña una lectura técnica consistente.' },
      ],
    },
    input: {
      name: 'Wind Demo',
      technology: 'solar' as const,
      location: {
        label: 'Valencia, ES',
        lat: 39.4699,
        lon: -0.3763,
        country: 'Spain',
        countryCode: 'ES',
      },
      system: {
        installedCapacityKw: 650,
        performanceRatio: 0.9,
        degradationRateAnnualPct: 0.5,
        availabilityPct: 99,
        lossesPct: { inverter: 2, temperature: 4, wiring: 1, soiling: 2, other: 1 },
      },
      demand: {
        annualConsumptionKwh: 1000,
        monthlyConsumptionKwh: [80, 80, 80, 80, 80, 80, 85, 85, 85, 85, 90, 90],
      },
      economics: {
        currency: 'EUR',
        capexTotal: 1000000,
        opexAnnual: 120000,
        electricityPurchasePricePerKwh: 0.18,
        exportPricePerKwh: 0.07,
        discountRatePct: 8,
        projectLifetimeYears: 20,
      },
    },
    technical: {
      annualGenerationKwh: 600000,
      monthlyGenerationKwh: [40000, 42000, 45000, 50000, 55000, 58000, 60000, 59000, 54000, 50000, 46000, 41000],
      specificYieldKwhPerKwp: 923,
      performanceRatio: 0.9,
      capacityFactorPct: 17,
      selfConsumptionRatePct: 72,
      coverageRatePct: 31,
      resource: {
        source: 'PVGIS',
        period: '2015-2020',
        monthlyIrradianceKwhM2: [4.8, 5, 5.2, 5.4, 5.6, 5.8, 6, 5.9, 5.5, 5.1, 4.9, 4.7],
        monthlyTemperatureC: [15, 16, 17, 18, 20, 23, 26, 27, 24, 21, 18, 16],
      },
      lossesPct: { inverter: 2, temperature: 4, wiring: 1, soiling: 2, other: 1, total: 10 },
      balanceByMonth: [],
    },
    financial: {
      currency: 'EUR',
      annualSavings: 150000,
      annualExportRevenue: 0,
      netAnnualBenefit: 150000,
      paybackYears: 6.7,
      discountedPaybackYears: 8.1,
      npv: 220000,
      irrPct: 11.2,
      lcoePerKwh: 0.08,
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
    ...overrides,
  }
}

export function buildSimulationHistoryRowMock(
  index: number,
  overrides: Partial<SimulationHistoryRow> = {},
): SimulationHistoryRow {
  return {
    id: overrides.id ?? `sim-${index}`,
    name: overrides.name ?? `Simulación ${index}`,
    status: overrides.status ?? 'completed',
    createdAt: overrides.createdAt ?? `2024-05-${String(index).padStart(2, '0')}T00:00:00.000Z`,
    technology: overrides.technology ?? 'solar',
    locationLabel: overrides.locationLabel ?? `Ubicación ${index}`,
    annualGenerationKwh: overrides.annualGenerationKwh ?? 100000 + index,
    annualSavings: overrides.annualSavings ?? 10000 + index,
    npv: overrides.npv ?? 5000 + index,
    irrPct: overrides.irrPct ?? 10 + index,
    recommendation: overrides.recommendation ?? 'recommended',
    modelVersion: overrides.modelVersion ?? 'solar-spain-v1',
    resourceSource: overrides.resourceSource ?? 'PVGIS',
  }
}
