import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EditSimulationPage } from './EditSimulationPage'
import { getRealSimulationById } from '../services/simulationService'
import { buildSimulationDetailsResponseMock } from '../test/simulationTestFactories'
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
  mockedGetRealSimulationById.mockResolvedValue(
    buildSimulationDetailsResponseMock({
      id: 'sim-edit-1',
      createdAt: '2026-07-01T10:00:00.000Z',
      updatedAt: '2026-07-01T10:00:02.000Z',
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
        technology: 'solar' as const,
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
    }),
  )

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

    expect(screen.getByLabelText('Nombre del proyecto')).toBeInTheDocument()
    expect(screen.getByLabelText('Tecnología')).toBeInTheDocument()
    expect(screen.getByLabelText('Ubicación')).toBeInTheDocument()
    expect(screen.getByLabelText('Potencia instalada (kW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Consumo anual (kWh)')).toBeInTheDocument()
  })

  it('renders financial input fields and save action', () => {
    renderPage()

    expect(screen.getByLabelText('Precio de electricidad')).toBeInTheDocument()
    expect(screen.getByLabelText('Inversión estimada')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Guardar cambios' })).toBeInTheDocument()
  })

  it('prefills the form with the current simulation data', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByLabelText('Nombre del proyecto')).toHaveValue('SOLAR - Madrid')
      expect(screen.getByLabelText('Ubicación')).toHaveValue('Madrid, ES')
      expect(screen.getByLabelText('Tecnología')).toHaveValue('Solar')
      expect(screen.getByLabelText('Potencia instalada (kW)')).toHaveValue(500)
      expect(screen.getByLabelText('Consumo anual (kWh)')).toHaveValue(1000)
      expect(screen.getByLabelText('Precio de electricidad')).toHaveValue(0.18)
      expect(screen.getByLabelText('Inversión estimada')).toHaveValue(1000)
    })
  })
})
