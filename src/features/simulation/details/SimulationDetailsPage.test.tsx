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
    expect(screen.getByText(/Vista consolidada del escenario para revisar desempeño, viabilidad financiera y condiciones operativas\./i)).toBeInTheDocument()
  })

  it('renders summary view by default and exposes internal tabs', () => {
    renderPage()

    expect(screen.getByRole('tab', { name: 'Decisión' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Financiero' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Comparativa' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tab', { name: 'Clima' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel', { name: 'Decisión' })).toBeInTheDocument()
    expect(screen.getByText('Lectura ejecutiva del escenario')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lectura para decisión' })).toBeInTheDocument()
    expect(screen.getByText('Recomendación')).toBeInTheDocument()
    expect(screen.getByText('Riesgo principal')).toBeInTheDocument()
    expect(screen.getByText('Próximo paso')).toBeInTheDocument()
    expect(screen.getAllByText('Indicadores principales')).toHaveLength(2)
    expect(screen.queryByText('Comparativa no disponible en esta etapa')).not.toBeInTheDocument()
  })

  it('renders comparison and climate sections only when their tabs are opened', () => {
    renderPage()

    fireEvent.click(screen.getByRole('tab', { name: 'Comparativa' }))
    expect(screen.getByRole('tabpanel', { name: 'Comparativa' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Posicion del escenario actual' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Datos pendientes para comparativa real' })).toBeInTheDocument()
    expect(screen.queryByText(/charts?/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('tab', { name: 'Clima' }))
    expect(screen.getByRole('tabpanel', { name: 'Clima' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lectura climatica del recurso' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lectura de contexto' })).toBeInTheDocument()
    expect(screen.getByText('Detalles complementarios')).toBeInTheDocument()
  })

  it('renders financial case plus backend-reserved signals when the financial tab is opened', () => {
    renderPage()

    fireEvent.click(screen.getByRole('tab', { name: 'Financiero' }))

    expect(screen.getByRole('tabpanel', { name: 'Financiero' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Caso financiero' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Señales pendientes para comité financiero' })).toBeInTheDocument()
    expect(screen.getByText(/sensibilidad del escenario/i)).toBeInTheDocument()
  })

  it('renders split financial visuals once financial data is available', async () => {
    renderPage()

    fireEvent.click(screen.getByRole('tab', { name: 'Financiero' }))

    expect(await screen.findByText('Capital comprometido')).toBeInTheDocument()
    expect(screen.getByText('Flujo anual esperado')).toBeInTheDocument()
  })

  it('renders overview values from store fallback', async () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Lectura para decisión' })).toBeInTheDocument()
    expect(screen.getByText('Valencia')).toBeInTheDocument()
    expect(screen.getAllByText('17%').length).toBeGreaterThan(0)
    expect(await screen.findByText('Viable con reservas')).toBeInTheDocument()
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

    expect(await screen.findByText('Sevilla')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lectura para decisión' })).toBeInTheDocument()
    expect(screen.getByText((content) => content.includes('Fecha:'))).toBeInTheDocument()
    expect(screen.getAllByText('21%').length).toBeGreaterThan(0)
    expect(mockedGetSimulationById).toHaveBeenCalledWith('sim-url-1')
  })
})
