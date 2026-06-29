import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ClimateConditionsCard,
  RealDataNoticeCard,
  SimulationFinancialSnapshot,
  SimulationOverviewCard,
} from './SimulationDetailsSections'
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
  it('renders summary and financial sections with the same framing cues for primary and supporting information', () => {
    render(
      <div>
        <SimulationOverviewCard content={viewModel.summarySection} />
        <SimulationFinancialSnapshot content={viewModel.financialSection} />
      </div>,
    )

    expect(screen.getAllByText('Decisión')[0]).toBeInTheDocument()
    expect(screen.getByText('Financiero')).toBeInTheDocument()
    expect(screen.getAllByText('Indicadores principales')).toHaveLength(2)
    expect(screen.getAllByText('Detalles complementarios')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Lectura para decisión' })).toBeInTheDocument()
    expect(screen.getByText('Señal principal')).toBeInTheDocument()
    expect(screen.getByText('Caso financiero')).toBeInTheDocument()
    expect(screen.getByText('Defensa economica del escenario')).toBeInTheDocument()
    expect(screen.getByText('Ahorro estimado')).toBeInTheDocument()
    expect(screen.getByText('CAPEX vs presupuesto')).toBeInTheDocument()
    expect(screen.getByText('Flujo neto anual')).toBeInTheDocument()
  })

  it('renders explicit placeholder and climate framing without inventing comparison analytics', () => {
    render(
      <div>
        <RealDataNoticeCard content={viewModel.comparisonPlaceholder} />
        <ClimateConditionsCard content={viewModel.climateSection} />
      </div>,
    )

    expect(screen.getByText('Comparativa')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Datos pendientes para comparativa real' })).toBeInTheDocument()
    expect(screen.getByText('Clima')).toBeInTheDocument()
    expect(screen.getByText('Indicadores principales')).toBeInTheDocument()
    expect(screen.getByText('Detalles complementarios')).toBeInTheDocument()
    expect(screen.queryByText(/charts?/i)).not.toBeInTheDocument()
  })
})
