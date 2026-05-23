import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SimulationResultsPage } from './SimulationResultsPage'
import { useSimulationStore } from '@/stores/simulationStore'

beforeEach(() => {
  useSimulationStore.setState({
    draft: {
      location: '',
      energyType: 'solar',
      projectSize: 500,
      budget: 1_000_000,
    },
    lastResult: null,
  })
})

function renderPage() {
  return render(
    <MemoryRouter>
      <SimulationResultsPage />
    </MemoryRouter>,
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
  })
})
