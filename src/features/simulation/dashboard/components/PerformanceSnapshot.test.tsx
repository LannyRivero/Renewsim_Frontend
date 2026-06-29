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
    expect(screen.getByText('Factor de capacidad')).toBeInTheDocument()
    expect(screen.getByText('Producción energética')).toBeInTheDocument()
    expect(screen.getAllByText(/Debajo del objetivo|Cumple objetivo|Supera objetivo|Sin referencia/).length).toBeGreaterThan(0)
  })
})
