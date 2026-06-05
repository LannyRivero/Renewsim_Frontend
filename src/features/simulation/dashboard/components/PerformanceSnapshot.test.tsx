import { render, screen } from '@testing-library/react'
import { PerformanceSnapshot } from './PerformanceSnapshot'
import { EFFICIENCY_METRICS, TARGET_VS_ACTUAL } from '../data/dashboardMock'

describe('PerformanceSnapshot', () => {
  it('renders efficiency metrics and target progress rows', () => {
    render(
      <PerformanceSnapshot
        metrics={EFFICIENCY_METRICS}
        targetVsActual={TARGET_VS_ACTUAL}
      />,
    )

    expect(screen.getByText('KPIs de Eficiencia')).toBeInTheDocument()
    expect(screen.getByText('Objetivo vs Actual')).toBeInTheDocument()
    expect(screen.getByText('Capacity factor')).toBeInTheDocument()
    expect(screen.getByText('Energy output')).toBeInTheDocument()
  })
})
