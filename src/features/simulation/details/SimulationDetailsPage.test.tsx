import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { SimulationDetailsPage } from './SimulationDetailsPage'
import { getRealSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'

vi.mock('../services/simulationService', () => ({
  getRealSimulationById: vi.fn(),
}))

const mockedGetRealSimulationById = vi.mocked(getRealSimulationById)

function mockDetailsResponse(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sim-store-1',
    status: 'completed',
    createdAt: '2024-05-12T00:00:00.000Z',
    updatedAt: '2024-05-12T00:00:00.000Z',
    modelVersion: 'solar-spain-v1',
    technology: 'solar',
    location: {
      label: 'Valencia, ES',
      name: 'Valencia',
      country: 'Spain',
      countryCode: 'ES',
      lat: 39.4699,
      lon: -0.3763,
    },
    summary: {
      recommendation: 'viable_with_reservations',
      headline: 'El escenario puede seguir evaluándose con validaciones adicionales.',
      summary: 'Los indicadores permiten continuar el análisis, aunque todavía no alcanzan una señal concluyente.',
      reasons: [
        { area: 'economics', severity: 'positive', message: 'El retorno proyectado aporta una base económica más favorable.' },
        { area: 'economics', severity: 'warning', message: 'El tiempo de retorno es moderado.' },
        { area: 'technical', severity: 'positive', message: 'La eficiencia operativa esperada acompaña una lectura técnica consistente.' },
      ],
    },
    input: {
      name: 'Wind Demo',
      technology: 'solar',
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

function renderPage(initialEntries: string[] = ['/']) {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <SimulationDetailsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mockedGetRealSimulationById.mockReset()
  mockedGetRealSimulationById.mockResolvedValue(mockDetailsResponse())

  useSimulationStore.setState({
    draft: {
      location: '',
      energyType: 'solar',
      projectSize: 500,
      budget: 1_000_000,
      energyConsumption: 1_000,
    },
    lastResult: {
      id: 'sim-store-1',
      location: 'Valencia',
      energyType: 'wind',
      roi: 17,
      efficiency: 90,
    },
    lastRunInput: {
      location: 'Valencia',
      energyType: 'wind',
      projectSize: 650,
      budget: 900000,
      energyConsumption: 1000,
      locationLatitude: 39.4699,
      locationLongitude: -0.3763,
    },
  })
})

describe('SimulationDetailsPage', () => {
  it('renders page title and description', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Detalles de la simulación' })).toBeInTheDocument()
    expect(screen.getByText(/Vista consolidada del escenario para revisar desempeño, viabilidad financiera y condiciones operativas\./i)).toBeInTheDocument()
  })

  it('renders decision metrics (recommendation, ROI, payback)', () => {
    renderPage()

    expect(screen.getByText('Recomendación')).toBeInTheDocument()
    expect(screen.getByText('ROI')).toBeInTheDocument()
    expect(screen.getAllByText('Tiempo de retorno').length).toBeGreaterThan(0)
    expect(screen.getByText('Viable con reservas')).toBeInTheDocument()
  })

  it('renders supporting decision metrics (signal, risk, next step)', () => {
    renderPage()

    expect(screen.getByText('Señal principal')).toBeInTheDocument()
    expect(screen.getByText('Riesgo principal')).toBeInTheDocument()
    expect(screen.getByText('Próximo paso')).toBeInTheDocument()
  })

  it('renders financial section with key metrics', () => {
    renderPage()

    expect(screen.getByText('Financiero')).toBeInTheDocument()
    expect(screen.getByText('Inversión inicial')).toBeInTheDocument()
    expect(screen.getByText('Valor presente neto')).toBeInTheDocument()
    expect(screen.getByText('Tasa interna')).toBeInTheDocument()
  })

  it('renders climate bar when data is available', async () => {
    renderPage()

    fireEvent.click(await screen.findByRole('button', { name: /Lectura climatica del recurso/i }))
    expect(await screen.findByText('Clima')).toBeInTheDocument()
    expect(screen.getByText('Irradiancia utilizable')).toBeInTheDocument()
  })

  it('renders comparison placeholder with pending data notice', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /Datos pendientes para comparativa real/i }))
    expect(screen.getByText('Comparativa')).toBeInTheDocument()
    expect(screen.getByText(/Para una comparativa real todavia falta que backend entregue alternativas lado a lado/i)).toBeInTheDocument()
  })

  it('prefers URL id and fetches details by query parameter', async () => {
    mockedGetRealSimulationById.mockResolvedValueOnce(mockDetailsResponse({
      id: 'sim-url-1',
      location: { label: 'Sevilla, ES', name: 'Sevilla', country: 'Spain', countryCode: 'ES', lat: 37.3891, lon: -5.9845 },
      summary: {
        recommendation: 'recommended',
        headline: 'El escenario presenta una señal sólida.',
        summary: 'Indicadores alineados favorablemente.',
        reasons: [
          { area: 'economics', severity: 'positive', message: 'Retorno favorable.' },
          { area: 'economics', severity: 'positive', message: 'Tiempo de retorno razonable.' },
          { area: 'technical', severity: 'positive', message: 'Eficiencia operativa consistente.' },
        ],
      },
      financial: {
        currency: 'EUR',
        annualSavings: 210000,
        annualExportRevenue: 0,
        netAnnualBenefit: 210000,
        paybackYears: 5.1,
        discountedPaybackYears: 6.6,
        npv: 420000,
        irrPct: 13.4,
        lcoePerKwh: 0.07,
        yearlyCashFlows: [],
      },
      input: {
        name: 'Hydro Demo',
        technology: 'solar',
        location: { label: 'Sevilla, ES', lat: 37.3891, lon: -5.9845, country: 'Spain', countryCode: 'ES' },
        system: { installedCapacityKw: 500, performanceRatio: 0.95, degradationRateAnnualPct: 0.5, availabilityPct: 99, lossesPct: { inverter: 2, temperature: 4, wiring: 1, soiling: 2, other: 1 } },
        demand: { annualConsumptionKwh: 1200, monthlyConsumptionKwh: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100] },
        economics: { currency: 'EUR', capexTotal: 850000, opexAnnual: 100000, electricityPurchasePricePerKwh: 0.18, exportPricePerKwh: 0.07, discountRatePct: 8, projectLifetimeYears: 20 },
      },
      technical: {
        annualGenerationKwh: 780000,
        monthlyGenerationKwh: [60000, 62000, 64000, 65000, 66000, 67000, 68000, 67000, 66000, 65000, 64000, 63000],
        specificYieldKwhPerKwp: 1560,
        performanceRatio: 0.95,
        capacityFactorPct: 18,
        selfConsumptionRatePct: 75,
        coverageRatePct: 40,
        resource: { source: 'PVGIS', period: '2015-2020', monthlyIrradianceKwhM2: [5, 5.2, 5.4, 5.6, 5.8, 6, 6.1, 6, 5.7, 5.4, 5.1, 4.9], monthlyTemperatureC: [12, 13, 15, 17, 21, 26, 30, 30, 26, 21, 16, 13] },
        lossesPct: { inverter: 2, temperature: 4, wiring: 1, soiling: 2, other: 1, total: 10 },
        balanceByMonth: [],
      },
      assumptions: { discountRatePct: 8, projectLifetimeYears: 20, degradationRateAnnualPct: 0.5, electricityPurchasePricePerKwh: 0.18, exportPricePerKwh: 0.07, climateSource: 'PVGIS', climatePeriod: '2015-2020' },
      warnings: [],
    }))

    renderPage(['/simulador/detalles?id=sim-url-1'])

    expect(await screen.findByText('Siguiente')).toBeInTheDocument()
    expect(await screen.findByText('Recomendado')).toBeInTheDocument()
    expect(mockedGetRealSimulationById).toHaveBeenCalledWith('sim-url-1')
  })

  it('falls back to spanish executive copy when backend summary arrives in english', async () => {
    mockedGetRealSimulationById.mockResolvedValueOnce(mockDetailsResponse({
      summary: {
        recommendation: 'viable_with_reservations',
        headline: 'The scenario is viable, but the decision depends on validating core assumptions.',
        summary: 'The project shows credible technical output, while the financial profile still requires executive review of pricing, losses, and recovery targets.',
        reasons: [
          { area: 'economics', severity: 'positive', message: 'The selected site is viable, but solar yield is moderate versus top Spanish locations.' },
          { area: 'economics', severity: 'warning', message: 'Recovery is feasible, but discounted performance should be reviewed carefully.' },
          { area: 'technical', severity: 'warning', message: 'The submitted inputs still need validation before committee review.' },
        ],
      },
    }))

    renderPage(['/simulador/detalles?id=sim-store-1'])

    expect(await screen.findByText(/El escenario puede seguir evaluándose/i)).toBeInTheDocument()
    expect(screen.queryByText(/The scenario is viable/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/The project shows credible technical output/i)).not.toBeInTheDocument()
  })
})
