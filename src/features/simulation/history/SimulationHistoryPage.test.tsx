import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { SimulationHistoryPage } from './SimulationHistoryPage'
import { getSimulationHistory } from '../services/simulationService'

vi.mock('../services/simulationService', () => ({
  getSimulationHistory: vi.fn(),
  deleteSimulationById: vi.fn(),
}))

const mockedGetSimulationHistory = vi.mocked(getSimulationHistory)

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <SimulationHistoryPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SimulationHistoryPage', () => {
  it('renders empty state when there is no history', async () => {
    mockedGetSimulationHistory.mockResolvedValueOnce([])
    renderPage()

    expect(await screen.findByText('Todavía no hay simulaciones. Creá tu primera simulación para ver resultados aquí.')).toBeInTheDocument()
  })

  it('renders heading and new simulation action', () => {
    mockedGetSimulationHistory.mockResolvedValueOnce([])
    renderPage()

    expect(screen.getByRole('heading', { name: 'Historial de simulaciones' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nueva simulación' })).toBeInTheDocument()
  })

  it('renders history table columns', () => {
    mockedGetSimulationHistory.mockResolvedValueOnce([])
    renderPage()

    expect(screen.getByRole('columnheader', { name: 'Fecha' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Tipo de energía' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Eficiencia' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ROI' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument()
  })

  it('renders simulation rows and action buttons', async () => {
    mockedGetSimulationHistory.mockResolvedValueOnce([
      { id: 'sim-1', date: 'May 15, 2024', energyType: 'Solar', efficiency: '85%', roi: '12%' },
    ])
    renderPage()

    expect(await screen.findByText('May 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Ver simulación Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Editar simulación Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Eliminar simulación Solar')).toBeInTheDocument()
  })
})
