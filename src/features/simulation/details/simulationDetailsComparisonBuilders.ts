import { formatNumber } from './simulationDetailsFormatters'
import type { DetailPlaceholderContent, DetailSectionContent } from './simulationDetailsTypes'

export function buildComparisonSection({
  roi,
  paybackYears,
  efficiency,
  decisionStatus,
}: {
  roi: number | null
  paybackYears: number | null
  efficiency: number | null
  decisionStatus: string
}): DetailSectionContent {
  const roiRead =
    roi === null
      ? 'Sin lectura suficiente para ubicar retorno frente a una referencia interna.'
      : roi >= 8
        ? 'El retorno cae en una banda que justifica contraste frente a otras alternativas.'
        : 'El retorno todavia no entra en una banda fuerte para priorizar comparacion de inversion.'

  const paybackRead =
    paybackYears === null
      ? 'Sin horizonte consolidado para comparar velocidad de recuperacion.'
      : paybackYears <= 6
        ? 'El horizonte de recuperacion es competitivo para una comparacion ejecutiva.'
        : 'El horizonte de recuperacion sigue siendo exigente frente a una alternativa mas agresiva.'

  const efficiencyRead =
    efficiency === null
      ? 'La solidez tecnica todavia no puede contrastarse con una referencia interna.'
      : efficiency >= 35
        ? 'La señal tecnica es suficientemente fuerte para merecer comparacion con otros escenarios.'
        : 'La señal tecnica todavia necesita madurar antes de defender una comparativa fuerte.'

  return {
    sectionLabel: 'Comparativa',
    title: 'Posicion del escenario actual',
    summary: 'Mientras backend no entregue alternativas lado a lado, esta vista ubica el escenario actual contra bandas internas para decidir si vale la pena compararlo.',
    primaryMetrics: [
      { label: 'Retorno vs referencia', value: roi === null ? 'N/D' : `${formatNumber(roi)}%`, helper: roiRead },
      { label: 'Recuperacion vs referencia', value: paybackYears === null ? 'N/D' : `${formatNumber(paybackYears)} años`, helper: paybackRead },
      { label: 'Solidez tecnica', value: efficiency === null ? 'N/D' : `${formatNumber(efficiency)}%`, helper: efficiencyRead },
    ],
    supportingMetrics: [
      { label: 'Estado actual', value: decisionStatus, helper: 'Lectura sintetica del caso antes de contrastarlo con otras alternativas.' },
      { label: 'Uso recomendado', value: 'Preparar comparacion', helper: 'Conviene usar esta lectura como baseline hasta que backend entregue escenarios alternativos comparables.' },
      { label: 'Dato pendiente', value: 'Alternativas lado a lado', helper: 'Falta recibir variantes comparables con mismas unidades, supuestos y horizonte.' },
    ],
  }
}

export function buildComparisonPlaceholder(): DetailPlaceholderContent {
  return {
    sectionLabel: 'Comparativa',
    title: 'Datos pendientes para comparativa real',
    description:
      'Para una comparativa real todavia falta que backend entregue alternativas lado a lado con mismos supuestos, misma ventana temporal y mismas metricas financieras y tecnicas para contraste directo.',
  }
}
