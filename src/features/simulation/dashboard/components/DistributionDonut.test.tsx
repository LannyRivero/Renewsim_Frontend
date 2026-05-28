import { render, screen } from '@testing-library/react'
import { DistributionDonut } from './DistributionDonut'
import { DISTRIBUTION } from '../data/dashboardMock'

describe('DistributionDonut', () => {
  it('renders a canvas element', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(document.querySelector('canvas')).toBeInTheDocument()
  })

  it('has an accessible label for screen readers', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(
      screen.getByRole('img', { name: /energy distribution/i }),
    ).toBeInTheDocument()
  })

  it('renders the section title', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(screen.getByText('Distribution')).toBeInTheDocument()
  })

  it('shows the count of energy sources in the center', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    // 4 sources
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('sources')).toBeInTheDocument()
  })

  it('renders a legend entry for each source', () => {
    render(<DistributionDonut data={DISTRIBUTION} />)
    expect(screen.getByText('Solar')).toBeInTheDocument()
    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('Hydroelectric')).toBeInTheDocument()
    expect(screen.getByText('Biomasa')).toBeInTheDocument()
  })
})
