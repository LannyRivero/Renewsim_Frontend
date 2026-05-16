import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { SimulationDetailsPage } from './SimulationDetailsPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <SimulationDetailsPage />
    </MemoryRouter>,
  )
}

describe('SimulationDetailsPage', () => {
  it('renders page title and description', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Simulation Details' })).toBeInTheDocument()
    expect(screen.getByText(/Review the comprehensive results of your energy simulation/i)).toBeInTheDocument()
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
    expect(screen.getByRole('heading', { name: 'Educational Insights' })).toBeInTheDocument()
  })
})
