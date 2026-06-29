import { describe, expect, it } from 'vitest'
import { buildSimulationDetailsViewModel } from './simulationDetailsViewModel'
import type { SimulationDetails } from '../schemas/simulationSchema'

function createSimulationDetails(overrides: Partial<SimulationDetails> = {}): SimulationDetails {
  return {
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
    ...overrides,
  }
}

describe('buildSimulationDetailsViewModel', () => {
  it('builds grouped section content and explicit comparison placeholder from simulation data', () => {
    const viewModel = buildSimulationDetailsViewModel({
      data: createSimulationDetails(),
      requestedSimulationId: 'sim-1',
      resultFromStore: null,
    })

    expect(viewModel.summarySection.sectionLabel).toBe('Resumen')
    expect(viewModel.summarySection.title).toBe('Eólica · Valencia')
    expect(viewModel.summarySection.primaryMetrics).toEqual([
      { label: 'ROI', value: '17%' },
      { label: 'Eficiencia', value: '90%' },
      { label: 'Generación', value: '600,000 kWh' },
    ])
    expect(viewModel.summarySnapshotSection.primaryMetrics).toEqual([
      { label: 'Ingreso estimado', value: '$150,000', helper: 'Inversión inicial: $1,000,000' },
      { label: 'Tiempo de retorno', value: '6.7 años' },
      { label: 'Velocidad del viento', value: '8.1 m/s' },
    ])
    expect(viewModel.financialSection.primaryMetrics).toEqual([
      { label: 'Inversión inicial', value: '$1,000,000' },
      { label: 'Ingreso estimado', value: '$150,000' },
      { label: 'Tiempo de retorno', value: '6.7 años' },
    ])
    expect(viewModel.climateSection.primaryMetrics).toEqual([
      { label: 'Irradiancia', value: '4.8 kWh/m2/día' },
      { label: 'Viento', value: '8.1 m/s' },
      { label: 'Hidrología', value: '2.4' },
    ])
    expect(viewModel.comparisonPlaceholder).toEqual({
      sectionLabel: 'Comparativa',
      title: 'Comparativa no disponible en esta etapa',
      description:
        'Esta simulación no cuenta todavía con una comparativa detallada entre alternativas dentro de esta vista. Cuando esté disponible, se incorporará como parte del análisis ejecutivo del escenario.',
    })
  })

  it('keeps section contracts stable when values are missing and store fallback is used', () => {
    const viewModel = buildSimulationDetailsViewModel({
      data: null,
      requestedSimulationId: null,
      resultFromStore: {
        id: 'sim-store-1',
        name: 'Solar Demo',
        location: 'Córdoba',
        energyType: 'solar',
      },
    })

    expect(viewModel.summarySection.title).toBe('Solar · Córdoba')
    expect(viewModel.summarySection.primaryMetrics).toEqual([
      { label: 'ROI', value: 'N/D' },
      { label: 'Eficiencia', value: 'N/D' },
      { label: 'Generación', value: 'N/D' },
    ])
    expect(viewModel.summarySnapshotSection.primaryMetrics).toEqual([
      { label: 'Ingreso estimado', value: 'N/D', helper: 'Inversión inicial: N/D' },
      { label: 'Tiempo de retorno', value: 'N/D' },
      { label: 'Irradiancia', value: 'N/D kWh/m2/día' },
    ])
    expect(viewModel.financialSection.supportingMetrics).toEqual([
      { label: 'Costo operativo', value: 'N/D' },
      { label: 'Valor presente neto', value: 'N/D' },
      { label: 'Tasa interna', value: 'N/D' },
    ])
    expect(viewModel.climateSection.supportingMetrics).toEqual([
      { label: 'Temperatura promedio', value: 'N/D' },
      { label: 'Fuente climática', value: 'N/D' },
      { label: 'Período climático', value: 'N/D' },
    ])
  })
})
