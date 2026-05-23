import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NewSimulationPage } from './NewSimulationPage'

describe('NewSimulationPage', () => {
  it('renders heading and description', () => {
    render(<NewSimulationPage />)

    expect(screen.getByRole('heading', { name: 'New custom simulation' })).toBeInTheDocument()
    expect(
      screen.getByText('Configure your simulation with project-specific parameters.'),
    ).toBeInTheDocument()
  })

  it('renders top header navigation from stitch design', () => {
    render(<NewSimulationPage />)

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Simulations' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resources' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Community' })).toBeInTheDocument()
    expect(screen.getByLabelText('Notifications')).toBeInTheDocument()
  })

  it('renders editable form fields', () => {
    render(<NewSimulationPage />)

    expect(screen.getByLabelText('Location')).toBeInTheDocument()
    expect(screen.getByLabelText('Energy type')).toBeInTheDocument()
    expect(screen.getByLabelText('Project size (kW/MW)')).toBeInTheDocument()
    expect(screen.getByLabelText('Budget (EUR)')).toBeInTheDocument()
  })

  it('renders read-only climate data fields', () => {
    render(<NewSimulationPage />)

    expect(screen.getByLabelText('Irradiance (kWh/m2/day)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Wind speed (m/s)')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('Hydrology (m3/s)')).toHaveAttribute('readonly')
  })

  it('renders submit action', () => {
    render(<NewSimulationPage />)
    expect(screen.getByRole('button', { name: 'Run simulation' })).toBeInTheDocument()
  })
})
