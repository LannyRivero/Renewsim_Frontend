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
    location: 'Valencia',
    energyType: 'wind',
    roi: 17,
    efficiency: 90,
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
      climate: {
        irradiance: 4.8,
        windSpeed: 8.1,
        hydrology: 2.4,
      },
    },
  })
})

describe('SimulationDetailsPage', () => {
  it('renders page title and description', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Simulation Details' })).toBeInTheDocument()
    expect(screen.getByText(/Review the active scenario through one consistent analysis surface/i)).toBeInTheDocument()
  })

  it('renders overview and comparison sections', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Simulation Overview' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Energy Source Comparison' })).toBeInTheDocument()
  })

  it('renders financial and environmental insights', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Financial Summary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Environmental Impact' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Climate Conditions Used' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Educational Insights' })).toBeInTheDocument()
  })

  it('renders overview values from store fallback', () => {
    renderPage()
    expect(screen.getByText('wind Simulation')).toBeInTheDocument()
    expect(screen.getByText('Valencia')).toBeInTheDocument()
    expect(screen.getByText('Overall ROI: 17%')).toBeInTheDocument()
  })

  it('prefers URL id and fetches details by query parameter', async () => {
    mockedGetSimulationById.mockResolvedValueOnce({
      id: 'sim-url-1',
      location: 'Sevilla',
      energyType: 'hydro',
      roi: 21,
      efficiency: 95,
      createdAt: '2024-05-12T00:00:00.000Z',
    })

    renderPage(['/simulador/detalles?id=sim-url-1'])

    expect(await screen.findByText('hydro Simulation')).toBeInTheDocument()
    expect(screen.getByText('Sevilla')).toBeInTheDocument()
    expect(screen.getByText('Overall ROI: 21%')).toBeInTheDocument()
    expect(mockedGetSimulationById).toHaveBeenCalledWith('sim-url-1')
  })
})
