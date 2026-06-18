import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'
import { SimulationResultsPage } from './SimulationResultsPage'
import { getSimulationById } from '../services/simulationService'
import { getAllTechnologies } from '../technologies/services/technologyService'
import { useSimulationStore } from '@/stores/simulationStore'

vi.mock('../services/simulationService', () => ({
  getSimulationById: vi.fn(),
}))

vi.mock('../technologies/services/technologyService', () => ({
  getAllTechnologies: vi.fn(),
}))

const mockedGetSimulationById = vi.mocked(getSimulationById)
const mockedGetAllTechnologies = vi.mocked(getAllTechnologies)

beforeEach(() => {
  mockedGetSimulationById.mockReset()
  mockedGetSimulationById.mockResolvedValue(null as never)
  mockedGetAllTechnologies.mockReset()
  mockedGetAllTechnologies.mockResolvedValue({
    items: [
      {
        id: 'tech-1',
        name: 'Solar Alpha',
        energyType: 'SOLAR',
        installedPower: 120,
        capacityFactor: 55,
        efficiency: 91,
        co2Reduction: 80,
        installationCost: 12000,
        maintenanceCost: 500,
        environmentalImpact: 12,
      },
      {
        id: 'tech-2',
        name: 'Wind Prime',
        energyType: 'WIND',
        installedPower: 200,
        capacityFactor: 60,
        efficiency: 87,
        co2Reduction: 95,
        installationCost: 20000,
        maintenanceCost: 900,
        environmentalImpact: 20,
      },
    ],
    totalElements: 2,
    totalPages: 1,
    page: 0,
    size: 100,
    sortBy: 'name',
    sortDirection: 'asc',
  })
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

    expect(screen.getByRole('heading', { name: 'Resultado operativo' })).toBeInTheDocument()
    expect(
      screen.getByText('Leé el rendimiento real de la simulación y compará tecnologías candidatas antes de tomar una decisión.'),
    ).toBeInTheDocument()
  })

  it('renders key metrics cards', () => {
    renderPage()

    expect(screen.getByText('Energía generada')).toBeInTheDocument()
    expect(screen.getByText('ROI')).toBeInTheDocument()
    expect(screen.getAllByText('Ahorro estimado').length).toBeGreaterThan(0)
    expect(screen.getByText('Retorno')).toBeInTheDocument()
    expect(screen.getByText('CO2 evitado')).toBeInTheDocument()
  })

  it('prioritizes backend simulation metrics when available', async () => {
    mockedGetSimulationById.mockResolvedValueOnce({
      id: '28',
      location: 'San Francisco, California, US',
      energyType: 'solar',
      roi: 7,
      efficiency: 91,
      budget: 1000000,
      energyGenerated: 600000,
      estimatedSavings: 150000,
      createdAt: '2026-06-08T10:12:37.605849',
    })

    useSimulationStore.setState({
      lastRunInput: {
        location: 'San Francisco, California, US',
        energyType: 'solar',
        projectSize: 500,
        budget: 1_000_000,
        energyConsumption: 1_000,
        locationLatitude: 37.7749,
        locationLongitude: -122.4194,
      },
      lastResult: {
        id: '28',
        location: 'San Francisco, California, US',
        energyType: 'solar',
        roi: 7,
        efficiency: 91,
      },
    })

    renderPage()

    expect((await screen.findAllByText('600,000 kWh')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('$150,000/year').length).toBeGreaterThan(0)
    expect(screen.getByText('6.7 years')).toBeInTheDocument()
  })

  it('renders technology comparison for selected energy type', async () => {
    mockedGetSimulationById.mockResolvedValueOnce({
      id: 'sim-123',
      location: 'Madrid',
      energyType: 'solar',
      roi: 18,
      efficiency: 91,
    })

    useSimulationStore.setState({
      lastRunInput: {
        location: 'Madrid',
        energyType: 'solar',
        projectSize: 800,
        budget: 1_000_000,
        energyConsumption: 1_000,
        locationLatitude: 40.4168,
        locationLongitude: -3.7038,
      },
      lastResult: {
        id: 'sim-123',
        location: 'Madrid',
        energyType: 'solar',
        roi: 18,
        efficiency: 91,
      },
    })

    renderPage()

    expect(await screen.findByRole('heading', { name: 'Comparativa tecnológica' })).toBeInTheDocument()
    expect(await screen.findByText(/Solar Alpha/)).toBeInTheDocument()
    expect(screen.queryByText(/Wind Prime/)).not.toBeInTheDocument()
  })

  it('renders recommended technology section', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Resultado operativo' })).toBeInTheDocument()
    expect(screen.getByText('Solar Power')).toBeInTheDocument()
    expect(screen.getByText('Síntesis ejecutiva')).toBeInTheDocument()
  })

  it('renders run another simulation action', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Nueva simulación' })).toBeInTheDocument()
  })

  it('renders last simulation context from store', () => {
    useSimulationStore.setState({
      lastRunInput: {
        location: 'Madrid',
        energyType: 'wind',
        projectSize: 800,
        budget: 1_000_000,
        energyConsumption: 1_000,
        locationLatitude: 40.4168,
        locationLongitude: -3.7038,
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

    expect(screen.getByText('Madrid')).toBeInTheDocument()
    expect(screen.getByText('#sim-123')).toBeInTheDocument()
    expect(screen.getAllByText('18%').length).toBeGreaterThan(0)
    expect(screen.getByText('Wind Turbine')).toBeInTheDocument()
  })
})
