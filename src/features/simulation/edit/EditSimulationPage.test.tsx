import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EditSimulationPage } from './EditSimulationPage'
import { getRealSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'

vi.mock('../services/simulationService', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/simulationService')>()
  return {
    ...actual,
    getRealSimulationById: vi.fn(),
  }
})

const mockedGetRealSimulationById = vi.mocked(getRealSimulationById)

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <EditSimulationPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  mockedGetRealSimulationById.mockReset()
  mockedGetRealSimulationById.mockResolvedValue({
    id: 'sim-edit-1',
    status: 'completed' as const,
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
        monthlyConsumptionKwh: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
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
  })

  useSimulationStore.setState({
    draft: {
      location: { label: '', lat: 0, lon: 0, country: '', countryCode: '' },
      energyType: 'solar',
      projectSize: 500,
      budget: 1_000_000,
      energyConsumption: 1_000,
    } as never,
    lastResult: {
      id: 'sim-edit-1',
      location: 'Madrid',
      energyType: 'solar',
      roi: 12,
      efficiency: 88,
    },
  })
})

describe('EditSimulationPage', () => {
  it('renders page title and description', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Editar simulación' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Ajustá el escenario actual con un formulario más preciso que concentre los datos económicos importantes en una sola vista.',
      ),
    ).toBeInTheDocument()
  })

  it('renders editable simulation form fields', () => {
    renderPage()

    expect(screen.getByLabelText('Nombre de la simulación')).toBeInTheDocument()
    expect(screen.getByLabelText('Ubicación')).toBeInTheDocument()
    expect(screen.getByLabelText('Fuente de energía')).toBeInTheDocument()
    expect(screen.getByLabelText('Tamaño del sistema (kW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Consumo energético anual (kWh)')).toBeInTheDocument()
  })

  it('renders financial input fields and save action', () => {
    renderPage()

    expect(screen.getByLabelText('Incentivos/bonificaciones ($)')).toBeInTheDocument()
    expect(screen.getByLabelText('Tarifa eléctrica ($/kWh)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })
})
