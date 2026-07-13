import type { DetailPlaceholderContent } from './simulationDetailsTypes'

export function buildComparisonPlaceholder(): DetailPlaceholderContent {
  return {
    sectionLabel: 'Comparativa',
    title: 'Datos pendientes para comparativa real',
    description:
      'Para una comparativa real todavia falta que backend entregue alternativas lado a lado con mismos supuestos, misma ventana temporal y mismas metricas financieras y tecnicas para contraste directo.',
  }
}
