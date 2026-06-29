import { render, screen } from '@testing-library/react'
import { DistributionDonut } from './DistributionDonut'
import { DISTRIBUTION } from '../data/dashboardMock'

describe('DistributionDonut', () => {
  it('renders the distribution chart region', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(screen.getByRole('img', { name: /energy distribution/i })).toBeInTheDocument()
  })

  it('has an accessible label for screen readers', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(
      screen.getByRole('img', { name: /energy distribution/i }),
    ).toBeInTheDocument()
  })

  it('renders the section title', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(screen.getByText('Mezcla Operativa')).toBeInTheDocument()
  })

  it('shows the dominant source and share in the center', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(screen.getByText('Fuente dominante')).toBeInTheDocument()
    expect(screen.getAllByText('Biomasa').length).toBeGreaterThan(0)
    expect(screen.getAllByText('40%').length).toBeGreaterThan(0)
  })

  it('renders the remaining mix entries below the dominant source', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(screen.getByText('Solar')).toBeInTheDocument()
    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('Hydroelectric')).toBeInTheDocument()
    expect(screen.getAllByText('Biomasa')).toHaveLength(1)
  })
})
