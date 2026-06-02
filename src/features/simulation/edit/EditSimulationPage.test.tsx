import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { EditSimulationPage } from './EditSimulationPage'
import { useSimulationStore } from '@/stores/simulationStore'

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
  useSimulationStore.setState({
    draft: {
      location: '',
      energyType: 'solar',
      projectSize: 500,
      budget: 1_000_000,
    },
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

    expect(screen.getByRole('heading', { name: 'Edit Simulation' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Update the parameters for your existing simulation below.',
      ),
    ).toBeInTheDocument()
  })

  it('renders editable simulation form fields', () => {
    renderPage()

    expect(screen.getByLabelText('Simulation Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Location')).toBeInTheDocument()
    expect(screen.getByLabelText('Energy Source')).toBeInTheDocument()
    expect(screen.getByLabelText('System Size (kW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Annual Energy Consumption (kWh)')).toBeInTheDocument()
  })

  it('renders financial input fields and save action', () => {
    renderPage()

    expect(screen.getByLabelText('Incentives/Rebates ($)')).toBeInTheDocument()
    expect(screen.getByLabelText('Electricity Rate ($/kWh)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()
  })
})
