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
