import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { SimulationDetailsPage } from './SimulationDetailsPage'
import { getSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'

vi.mock('../services/simulationService', () => ({
  getSimulationById: vi.fn(),
}))

const mockedGetSimulationById = vi.mocked(getSimulationById)

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
  mockedGetSimulationById.mockReset()
  mockedGetSimulationById.mockResolvedValue({
    id: 'sim-store-1',
    name: 'Wind Demo',
    location: 'Valencia',
    energyType: 'wind',
    roi: 17,
    efficiency: 90,
    irradiance: 4.8,
    windSpeed: 8.1,
    hydrology: 2.4,
    temperature: 21,
    climateSource: 'OPENWEATHER',
    climatePeriod: 'recent_10yr',
    capex: 1000000,
    opex: 120000,
    revenue: 150000,
    paybackYears: 6.7,
    npv: 220000,
    irr: 11.2,
    energyGenerated: 600000,
  })

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
    expect(screen.getByText(/Esta vista resume los indicadores disponibles del escenario actual/i)).toBeInTheDocument()
  })

  it('renders summary view by default and exposes internal tabs', () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Resumen' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Financiero' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Comparativa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clima' })).toBeInTheDocument()
    expect(screen.getByText('Resumen de la simulación')).toBeInTheDocument()
    expect(screen.queryByText('Escenario verificado')).not.toBeInTheDocument()
  })

  it('renders comparison and climate sections only when their tabs are opened', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Comparativa' }))
    expect(screen.getByRole('heading', { name: 'Comparativa no disponible en esta etapa' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clima' }))
    expect(screen.getByRole('heading', { name: 'Condiciones climáticas utilizadas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lectura ejecutiva' })).toBeInTheDocument()
  })

  it('renders overview values from store fallback', async () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Eólica · Valencia' })).toBeInTheDocument()
    expect(screen.getByText('Valencia')).toBeInTheDocument()
    expect(screen.getAllByText('17%').length).toBeGreaterThan(0)
    expect(await screen.findByText('600,000 kWh')).toBeInTheDocument()
  })

  it('prefers URL id and fetches details by query parameter', async () => {
    mockedGetSimulationById.mockResolvedValueOnce({
      id: 'sim-url-1',
      name: 'Hydro Demo',
      location: 'Sevilla',
      energyType: 'hydro',
      roi: 21,
      efficiency: 95,
      createdAt: '2024-05-12T00:00:00.000Z',
      capex: 850000,
      revenue: 210000,
      paybackYears: 5.1,
      npv: 420000,
      irr: 13.4,
      energyGenerated: 780000,
    })

    renderPage(['/simulador/detalles?id=sim-url-1'])

    expect(await screen.findByRole('heading', { name: 'Hidráulica · Sevilla' })).toBeInTheDocument()
    expect(screen.getByText('Sevilla')).toBeInTheDocument()
    expect(screen.getAllByText('21%').length).toBeGreaterThan(0)
    expect(mockedGetSimulationById).toHaveBeenCalledWith('sim-url-1')
  })
})
