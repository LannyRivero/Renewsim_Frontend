import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { EditSimulationPage } from './EditSimulationPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <EditSimulationPage />
    </MemoryRouter>,
  )
}

describe('EditSimulationPage', () => {
  it('renders page title and description', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Simulation Details' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Review the comprehensive results of your energy simulation, including financial summaries, environmental impact, and educational insights.',
      ),
    ).toBeInTheDocument()
  })

  it('renders simulation overview and comparison table', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Simulation Overview' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Energy Source Comparison' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Energy Source' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Initial Investment' })).toBeInTheDocument()
  })

  it('renders financial and environmental sections', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Financial Summary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Environmental Impact' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Educational Insights' })).toBeInTheDocument()
  })
})
