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

    expect(await screen.findByText('No simulations yet. Create your first simulation to see results here.')).toBeInTheDocument()
  })

  it('renders heading and new simulation action', () => {
    mockedGetSimulationHistory.mockResolvedValueOnce([])
    renderPage()

    expect(screen.getByRole('heading', { name: 'Simulation History' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New Simulation' })).toBeInTheDocument()
  })

  it('renders history table columns', () => {
    mockedGetSimulationHistory.mockResolvedValueOnce([])
    renderPage()

    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Energy Type' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Efficiency' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ROI' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
  })

  it('renders simulation rows and action buttons', async () => {
    mockedGetSimulationHistory.mockResolvedValueOnce([
      { id: 'sim-1', date: 'May 15, 2024', energyType: 'Solar', efficiency: '85%', roi: '12%' },
    ])
    renderPage()

    expect(await screen.findByText('May 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('View simulation Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Edit simulation Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete simulation Solar')).toBeInTheDocument()
  })
})
