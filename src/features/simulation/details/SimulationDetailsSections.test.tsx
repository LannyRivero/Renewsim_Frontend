import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ClimateCompactBar, ComparisonCompactNote, MetricTile } from './SimulationDetailsSections'
import { buildSimulationDetailsViewModel } from './simulationDetailsViewModel'

const viewModel = buildSimulationDetailsViewModel({
  data: {
    id: 'sim-1',
    name: 'Wind Demo',
    location: 'Valencia',
    energyType: 'wind',
    createdAt: '2024-05-12T00:00:00.000Z',
    roi: 17,
    efficiency: 90,
    temperature: 21,
    climateSource: 'OPENWEATHER',
    climatePeriod: 'recent_10yr',
    irradiance: 4.8,
    windSpeed: 8.1,
    hydrology: 2.4,
    capex: 1000000,
    opex: 120000,
    revenue: 150000,
    paybackYears: 6.7,
    npv: 220000,
    irr: 11.2,
    energyGenerated: 600000,
    estimatedSavings: 150000,
    budget: 1000000,
  },
  requestedSimulationId: 'sim-1',
  resultFromStore: null,
})

describe('Simulation details sections', () => {
  it('renders decision metric tiles', () => {
    render(<div>
      {viewModel.summarySection.primaryMetrics.map((metric) => (
        <MetricTile key={metric.label} metric={metric} />
      ))}
    </div>)

    expect(screen.getByText('Recomendación')).toBeInTheDocument()
    expect(screen.getByText('ROI')).toBeInTheDocument()
    expect(screen.getByText('Tiempo de retorno')).toBeInTheDocument()
    expect(screen.getByText('Viable con reservas')).toBeInTheDocument()
    expect(screen.getByText('17%')).toBeInTheDocument()
  })

  it('renders climate bar with key climate metrics', () => {
    render(<ClimateCompactBar content={viewModel.climateSection} isOpen={true} onToggle={() => {}} />)

    expect(screen.getByText('Clima')).toBeInTheDocument()
    expect(screen.getByText(/Velocidad del viento/)).toBeInTheDocument()
    expect(screen.getByText(/Temperatura promedio/)).toBeInTheDocument()
  })

  it('renders comparison placeholder note', () => {
    render(<ComparisonCompactNote content={viewModel.comparisonPlaceholder} isOpen={true} onToggle={() => {}} />)

    expect(screen.getByText('Comparativa')).toBeInTheDocument()
    expect(screen.getByText(/Para una comparativa real todavia falta que backend entregue alternativas lado a lado/i)).toBeInTheDocument()
  })
})
