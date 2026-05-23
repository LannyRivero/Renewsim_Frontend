import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { SimulationHistoryPage } from './SimulationHistoryPage'

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
  it('renders heading and new simulation action', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Simulation History' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'New Simulation' })).toBeInTheDocument()
  })

  it('renders history table columns', () => {
    renderPage()

    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Energy Type' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Efficiency' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ROI' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
  })

  it('renders simulation rows and action buttons', () => {
    renderPage()

    expect(screen.getByText('May 15, 2024')).toBeInTheDocument()
    expect(screen.getByText('Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('View simulation Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Edit simulation Solar')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete simulation Solar')).toBeInTheDocument()
  })
})
