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

    expect(viewModel.summarySection.sectionLabel).toBe('Decisión')
    expect(viewModel.summarySection.title).toBe('Lectura para decisión')
    expect(viewModel.summarySection.primaryMetrics).toEqual([
      {
        label: 'Recomendación',
        value: 'Viable con reservas',
        helper:
          'La relación entre inversión e ingreso esperado sugiere una revisión adicional del caso antes de priorizarlo. Horizonte simple de recuperación: 6.7 años.',
      },
      { label: 'ROI', value: '17%' },
      { label: 'Tiempo de retorno', value: '6.7 años' },
    ])
    expect(viewModel.summarySnapshotSection.primaryMetrics).toEqual([
      {
        label: 'Retorno',
        value: 'Señal económica',
        helper: 'El retorno proyectado aporta una base económica más favorable para avanzar con evaluación ejecutiva.',
      },
      {
        label: 'Recuperación',
        value: 'Horizonte de inversión',
        helper: 'El tiempo de retorno es moderado y conviene contrastarlo con objetivos de inversión y horizonte operativo.',
      },
      {
        label: 'Desempeño técnico',
        value: 'Condición operativa',
        helper: 'La eficiencia operativa esperada acompaña una lectura técnica más consistente del escenario.',
      },
    ])
    expect(viewModel.financialSection.primaryMetrics).toEqual([
      { label: 'Inversión inicial', value: '$1,000,000', helper: 'Capital requerido para activar el escenario.' },
      { label: 'Tiempo de retorno', value: '6.7 años', helper: 'Tiempo estimado para recuperar la inversion inicial bajo los supuestos actuales.' },
      { label: 'Valor presente neto', value: '$220,000', helper: 'La proyeccion mantiene creacion de valor bajo los supuestos actuales.' },
    ])
    expect(viewModel.climateSection.primaryMetrics).toEqual([
      { label: 'Velocidad del viento', value: '8.1 m/s', helper: 'Variable principal para leer la consistencia del recurso eolico.' },
      { label: 'Temperatura promedio', value: '21.0 C', helper: 'Ayuda a contextualizar operacion esperada y condiciones ambientales del escenario.' },
      { label: 'Ventana de datos', value: 'recent_10yr', helper: 'Periodo de referencia usado para sostener la lectura del recurso.' },
    ])
    expect(viewModel.comparisonPlaceholder).toEqual({
      sectionLabel: 'Comparativa',
      title: 'Datos pendientes para comparativa real',
      description:
        'Para una comparativa real todavia falta que backend entregue alternativas lado a lado con mismos supuestos, misma ventana temporal y mismas metricas financieras y tecnicas para contraste directo.',
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

    expect(viewModel.summarySection.title).toBe('Lectura para decisión')
    expect(viewModel.summarySection.primaryMetrics).toEqual([
      {
        label: 'Recomendación',
        value: 'Viable con reservas',
        helper: 'Los indicadores disponibles permiten continuar el análisis, aunque todavía no alcanzan una señal suficientemente concluyente.',
      },
      { label: 'ROI', value: 'N/D' },
      { label: 'Tiempo de retorno', value: 'N/D' },
    ])
    expect(viewModel.summarySnapshotSection.primaryMetrics).toEqual([
      {
        label: 'Retorno',
        value: 'Señal económica',
        helper: 'El escenario todavía no cuenta con una lectura completa de retorno para sostener una recomendación firme.',
      },
      {
        label: 'Recuperación',
        value: 'Horizonte de inversión',
        helper: 'No hay un tiempo de retorno consolidado disponible, lo que reduce la capacidad de defensa financiera del escenario.',
      },
      {
        label: 'Desempeño técnico',
        value: 'Condición operativa',
        helper: 'La eficiencia esperada de la alternativa solar no está consolidada en esta corrida.',
      },
    ])
    expect(viewModel.financialSection.supportingMetrics).toEqual([
      { label: 'Ingreso estimado', value: 'N/D', helper: 'Flujo economico esperado del escenario bajo los supuestos actuales.' },
      { label: 'Ahorro estimado', value: 'N/D', helper: 'Impacto economico esperado por reduccion de costo o consumo frente al escenario actual.' },
      { label: 'CAPEX vs presupuesto', value: 'N/D', helper: 'No hay presupuesto disponible cargado para contrastar la inversion requerida.' },
      { label: 'Flujo neto anual', value: 'N/D', helper: 'No hay suficiente informacion para consolidar el flujo neto anual del caso.' },
      { label: 'Costo operativo', value: 'N/D', helper: 'Carga operativa recurrente que acompana al caso.' },
      { label: 'Tasa interna', value: 'N/D', helper: 'La rentabilidad porcentual todavia no esta consolidada.' },
    ])
    expect(viewModel.climateSection.supportingMetrics).toEqual([
      { label: 'Fuente climatica', value: 'N/D', helper: 'Proveedor o fuente usada para la trazabilidad del dato.' },
      { label: 'Irradiancia reportada', value: 'N/D' },
      { label: 'Viento reportado', value: 'N/D' },
      { label: 'Hidrologia reportada', value: 'N/D' },
    ])
  })
})
