import { render, screen } from '@testing-library/react'
import { EnergyBarChart } from './EnergyBarChart'
import { ENERGY_BY_SOURCE } from '../data/dashboardMock'

// Chart.js needs canvas — jsdom doesn't support it natively
// react-chartjs-2 renders a <canvas>, we just verify it mounts correctly
describe('EnergyBarChart', () => {
  it('renders a canvas element', () => {
    render(<EnergyBarChart data={ENERGY_BY_SOURCE} />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
  })

  it('has an accessible label for screen readers', () => {
    render(<EnergyBarChart data={ENERGY_BY_SOURCE} />)
    expect(
      screen.getByRole('img', { name: /energía generada por fuente/i }),
    ).toBeInTheDocument()
  })

  it('renders the section title', () => {
    render(<EnergyBarChart data={ENERGY_BY_SOURCE} />)
    expect(screen.getByText('Energía Generada por Fuente')).toBeInTheDocument()
  })

  it('shows the total kWh', () => {
    render(<EnergyBarChart data={ENERGY_BY_SOURCE} />)
    // sum: 4000 + 3000 + 5000 + 8000 = 20000
    expect(screen.getByText(/20[.,]000 kWh/)).toBeInTheDocument()
  })
})
