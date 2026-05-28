import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NewSimulationPage } from './NewSimulationPage'

function renderPage() {
  const queryClient = new QueryClient()
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <NewSimulationPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('NewSimulationPage', () => {
  it('renders heading and description', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'New custom simulation' })).toBeInTheDocument()
    expect(
      screen.getByText('Configure your simulation with project-specific parameters.'),
    ).toBeInTheDocument()
  })

  it('renders top header navigation from stitch design', () => {
    renderPage()

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Simulations' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resources' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Community' })).toBeInTheDocument()
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument()
  })

  it('renders editable form fields', () => {
    renderPage()

    expect(screen.getByLabelText('Location')).toBeInTheDocument()
    expect(screen.getByLabelText('Energy type')).toBeInTheDocument()
    expect(screen.getByLabelText('Project size (kW/MW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Budget (EUR)')).toBeInTheDocument()
  })

  it('renders read-only climate data fields', () => {
    renderPage()

    expect(screen.getByLabelText('Irradiance (kWh/m2/day)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Wind speed (m/s)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Hydrology (m3/s)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Irradiance (kWh/m2/day)')).toHaveValue('-')
    expect(screen.getByLabelText('Wind speed (m/s)')).toHaveValue('-')
    expect(screen.getByLabelText('Hydrology (m3/s)')).toHaveValue('3.0')
  })

  it('renders submit action', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Run simulation' })).toBeInTheDocument()
  })
})
