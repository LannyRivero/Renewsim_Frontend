import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText(/Revisá el escenario activo en una vista consistente/i)).toBeInTheDocument()
  })

  it('renders overview and comparison sections', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Resumen de la simulación' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Comparación de fuentes de energía' })).toBeInTheDocument()
  })

  it('renders financial and environmental insights', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Resumen financiero' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Impacto ambiental' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Condiciones climáticas utilizadas' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Conclusiones educativas' })).toBeInTheDocument()
  })

  it('renders overview values from store fallback', () => {
    renderPage()
    expect(screen.getByText('wind Simulación')).toBeInTheDocument()
    expect(screen.getByText('Valencia')).toBeInTheDocument()
    expect(screen.getByText('ROI total: 17%')).toBeInTheDocument()
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
    })

    renderPage(['/simulador/detalles?id=sim-url-1'])

    expect(await screen.findByText('Hydro Demo')).toBeInTheDocument()
    expect(screen.getByText('Sevilla')).toBeInTheDocument()
    expect(screen.getByText('ROI total: 21%')).toBeInTheDocument()
    expect(mockedGetSimulationById).toHaveBeenCalledWith('sim-url-1')
  })
})
