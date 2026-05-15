import { render, screen } from '@testing-library/react'
import { StatsGrid } from './StatsGrid'
import { DASHBOARD_STATS } from '../data/dashboardMock'

describe('StatsGrid', () => {
  it('renders all 4 stat cards', () => {
    render(<StatsGrid stats={DASHBOARD_STATS} />)
    expect(screen.getAllByRole('article')).toHaveLength(4)
  })

  it('displays the label of each card', () => {
    render(<StatsGrid stats={DASHBOARD_STATS} />)
    expect(screen.getByText('Simulaciones Totales')).toBeInTheDocument()
    expect(screen.getByText('CO₂ Ahorrado')).toBeInTheDocument()
    expect(screen.getByText('Promedio de ROI')).toBeInTheDocument()
    expect(screen.getByText('Energía Generada')).toBeInTheDocument()
  })

  it('displays the value of each card', () => {
    render(<StatsGrid stats={DASHBOARD_STATS} />)
    expect(screen.getByText('125')).toBeInTheDocument()
    expect(screen.getByText('5,000 kg')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('25,000 kWh')).toBeInTheDocument()
  })

  it('renders with custom stats', () => {
    const custom = [{ label: 'Test', value: '42', icon: 'star' }]
    render(<StatsGrid stats={custom} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
