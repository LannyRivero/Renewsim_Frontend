import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { SimulationResultsPage } from './SimulationResultsPage'
import { getSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'

vi.mock('../services/simulationService', () => ({
  getSimulationById: vi.fn(),
}))

const mockedGetSimulationById = vi.mocked(getSimulationById)

beforeEach(() => {
  mockedGetSimulationById.mockReset()
  useSimulationStore.setState({
    draft: {
      location: '',
      energyType: 'solar',
      projectSize: 500,
      budget: 1_000_000,
      energyConsumption: 1_000,
    },
    lastResult: null,
    lastRunInput: null,
  })
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SimulationResultsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SimulationResultsPage', () => {
  it('renders title and description', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Simulation Results' })).toBeInTheDocument()
    expect(
      screen.getByText('Review the outcomes of your energy simulation and explore the impact of your choices.'),
    ).toBeInTheDocument()
  })

  it('renders key metrics cards', () => {
    renderPage()

    expect(screen.getByText('Energy Generated')).toBeInTheDocument()
    expect(screen.getByText('Return on Investment (ROI)')).toBeInTheDocument()
    expect(screen.getByText('Payback Period')).toBeInTheDocument()
    expect(screen.getByText('CO2 Emissions Avoided')).toBeInTheDocument()
  })

  it('renders recommended technology section', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Recommended Technology' })).toBeInTheDocument()
    expect(screen.getByText('Solar Power')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Learn More' })).toBeInTheDocument()
  })

  it('renders run another simulation action', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Run Another Simulation' })).toBeInTheDocument()
  })

  it('renders last simulation context from store', () => {
    useSimulationStore.setState({
      lastRunInput: {
        location: 'Madrid',
        energyType: 'wind',
        projectSize: 800,
        budget: 1_000_000,
        climate: {
          irradiance: 4.6,
          windSpeed: 8.3,
          hydrology: 2.8,
        },
      },
      lastResult: {
        id: 'sim-123',
        location: 'Madrid',
        energyType: 'wind',
        roi: 18,
        efficiency: 91,
      },
    })

    renderPage()

    expect(screen.getByText('Location: Madrid | Energy type: wind')).toBeInTheDocument()
    expect(screen.getByText('Simulation ID: sim-123')).toBeInTheDocument()
    expect(screen.getByText('18%')).toBeInTheDocument()
    expect(screen.getByText('Wind Turbine')).toBeInTheDocument()
  })
})
