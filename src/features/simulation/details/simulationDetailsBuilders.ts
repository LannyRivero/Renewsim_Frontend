import { formatNumber } from './simulationDetailsFormatters'
import type {
  DecisionSummary,
  DetailChartDatum,
  DetailPlaceholderContent,
  DetailSectionContent,
} from './simulationDetailsTypes'

export function buildDecisionSummary({
  roi,
  paybackYears,
  efficiency,
  revenue,
  capex,
  energyTypeLabel,
}: {
  roi: number | null
  paybackYears: number | null
  efficiency: number | null
  revenue: number | null
  capex: number | null
  energyTypeLabel: string
}): DecisionSummary {
  const drivers: string[] = []
  const technicalLabel = energyTypeLabel.toLowerCase()

  if (roi === null) {
    drivers.push('El escenario todavía no cuenta con una lectura completa de retorno para sostener una recomendación firme.')
  } else if (roi < 0) {
    drivers.push('El retorno proyectado es negativo, por lo que el escenario no recupera valor bajo las condiciones actuales.')
  } else if (roi < 8) {
    drivers.push('El retorno proyectado es positivo pero todavía débil para justificar una decisión inmediata de inversión.')
  } else {
    drivers.push('El retorno proyectado aporta una base económica más favorable para avanzar con evaluación ejecutiva.')
  }

  if (paybackYears === null) {
    drivers.push('No hay un tiempo de retorno consolidado disponible, lo que reduce la capacidad de defensa financiera del escenario.')
  } else if (paybackYears > 10) {
    drivers.push('El tiempo de retorno es extenso y exige una justificación estratégica más fuerte para priorizar esta alternativa.')
  } else if (paybackYears > 6) {
    drivers.push('El tiempo de retorno es moderado y conviene contrastarlo con objetivos de inversión y horizonte operativo.')
  } else {
    drivers.push('El tiempo de retorno se mantiene en un rango razonable para una evaluación ejecutiva positiva.')
  }

  if (efficiency === null) {
    drivers.push(`La eficiencia esperada de la alternativa ${technicalLabel} no está consolidada en esta corrida.`)
  } else if (efficiency < 15) {
    drivers.push(`La eficiencia operativa esperada para la alternativa ${technicalLabel} es baja y limita la solidez técnica del escenario.`)
  } else if (efficiency < 35) {
    drivers.push('La eficiencia operativa esperada es intermedia y debería revisarse junto con capacidad, costos y condiciones climáticas.')
  } else {
    drivers.push('La eficiencia operativa esperada acompaña una lectura técnica más consistente del escenario.')
  }

  const hasWeakReturn = roi !== null && roi < 0
  const hasSlowPayback = paybackYears !== null && paybackYears > 10
  const hasLowEfficiency = efficiency !== null && efficiency < 15
  const hasGoodReturn = roi !== null && roi >= 8
  const hasGoodPayback = paybackYears !== null && paybackYears <= 6
  const hasGoodEfficiency = efficiency !== null && efficiency >= 35

  if (hasWeakReturn || hasSlowPayback || hasLowEfficiency) {
    const mainSignal = hasWeakReturn
      ? 'Retorno insuficiente para defender inversión.'
      : hasSlowPayback
        ? 'Horizonte de recuperación demasiado largo para priorización.'
        : 'Desempeño técnico débil para sostener el caso.'

    return {
      decisionStatus: 'No recomendado',
      decisionHeadline: 'El escenario no muestra una base suficiente para justificar inversión en su estado actual.',
      decisionSummary:
        'La combinación de retorno, plazo de recuperación y desempeño operativo sugiere revisar supuestos antes de elevar este caso a decisión.',
      decisionDrivers: drivers,
      mainSignal,
      mainRisk: 'Escalar este escenario sin corregir supuestos puede inmovilizar presupuesto en un caso con baja defensa económica o técnica.',
      nextAction: 'Revisar supuestos de costo, recurso y dimensionamiento antes de volver a presentarlo para priorización.',
    }
  }

  if (hasGoodReturn && hasGoodPayback && hasGoodEfficiency) {
    return {
      decisionStatus: 'Recomendado',
      decisionHeadline: 'El escenario presenta una señal sólida para avanzar a evaluación ejecutiva y validación final.',
      decisionSummary:
        'Los indicadores económicos y operativos se alinean de forma favorable para sostener una conversación de inversión con mayor confianza.',
      decisionDrivers: drivers,
      mainSignal: 'Retorno, recuperación y desempeño técnico se alinean de forma favorable.',
      mainRisk: 'La principal reserva es validar sensibilidad de costos y supuestos operativos antes de comprometer inversión final.',
      nextAction: 'Pasar a validación final con contraste de supuestos, sensibilidad y cierre financiero.',
    }
  }

  const financialGap =
    typeof revenue === 'number' && typeof capex === 'number' && revenue > 0 ? Number((capex / revenue).toFixed(1)) : null

  return {
    decisionStatus: 'Viable con reservas',
    decisionHeadline: 'El escenario puede seguir evaluándose, pero todavía necesita validaciones antes de defender inversión.',
    decisionSummary:
      financialGap !== null
        ? `La relación entre inversión e ingreso esperado sugiere una revisión adicional del caso antes de priorizarlo. Horizonte simple de recuperación: ${financialGap} años.`
        : 'Los indicadores disponibles permiten continuar el análisis, aunque todavía no alcanzan una señal suficientemente concluyente.',
    decisionDrivers: drivers,
    mainSignal: 'El caso tiene señales positivas, pero todavía no alcanza una defensa suficientemente concluyente.',
    mainRisk: 'Si no se contrastan sensibilidad, retorno y desempeño operativo, la priorización puede quedar expuesta frente a dirección o finanzas.',
    nextAction: 'Comparar escenarios, correr sensibilidad y cerrar validaciones antes de elevar recomendación de inversión.',
  }
}

export function buildSummarySection({
  decisionStatus,
  decisionHeadline,
  decisionSummary,
  roi,
  paybackYears,
  mainSignal,
  mainRisk,
  nextAction,
}: {
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  roi: string
  paybackYears: string
  mainSignal: string
  mainRisk: string
  nextAction: string
}): DetailSectionContent {
  return {
    sectionLabel: 'Decisión',
    title: 'Lectura para decisión',
    summary: decisionHeadline,
    primaryMetrics: [
      { label: 'Recomendación', value: decisionStatus, helper: decisionSummary },
      { label: 'ROI', value: roi },
      { label: 'Tiempo de retorno', value: paybackYears },
    ],
    supportingMetrics: [
      { label: 'Señal principal', value: mainSignal },
      { label: 'Riesgo principal', value: mainRisk },
      { label: 'Próximo paso', value: nextAction },
    ],
  }
}

export function buildFinancialSection({
  capex,
  revenue,
  paybackYears,
  opex,
  npv,
  irr,
  estimatedSavings,
  budgetCoverage,
  netAnnualFlow,
}: {
  capex: string
  revenue: string
  paybackYears: string
  opex: string
  npv: string
  irr: string
  estimatedSavings: string
  budgetCoverage: string
  netAnnualFlow: string
}): DetailSectionContent {
  const paybackHelper =
    paybackYears === 'N/D'
      ? 'Todavia no hay horizonte de recuperacion consolidado para defender la inversion.'
      : 'Tiempo estimado para recuperar la inversion inicial bajo los supuestos actuales.'

  const npvHelper =
    npv === 'N/D'
      ? 'No hay lectura de valor presente neto disponible en esta corrida.'
      : npv.startsWith('$-')
        ? 'La proyeccion destruye valor frente al costo de capital asumido.'
        : 'La proyeccion mantiene creacion de valor bajo los supuestos actuales.'

  const irrHelper =
    irr === 'N/D'
      ? 'La rentabilidad porcentual todavia no esta consolidada.'
      : 'Lectura de rentabilidad esperada del escenario frente a la inversion requerida.'

  const budgetHelper =
    budgetCoverage === 'N/D'
      ? 'No hay presupuesto disponible cargado para contrastar la inversion requerida.'
      : 'Diferencia entre presupuesto disponible y capital requerido para activar el escenario.'

  const netAnnualFlowHelper =
    netAnnualFlow === 'N/D'
      ? 'No hay suficiente informacion para consolidar el flujo neto anual del caso.'
      : 'Cruce simple entre ingreso esperado y costo operativo anual.'

  return {
    sectionLabel: 'Financiero',
    title: 'Caso financiero',
    summary: 'Lectura economica del escenario para validar si la inversion se recupera, crea valor y sostiene una defensa frente a negocio.',
    primaryMetrics: [
      { label: 'Inversion inicial', value: capex, helper: 'Capital requerido para activar el escenario.' },
      { label: 'Tiempo de retorno', value: paybackYears, helper: paybackHelper },
      { label: 'Valor presente neto', value: npv, helper: npvHelper },
    ],
    supportingMetrics: [
      { label: 'Ingreso estimado', value: revenue, helper: 'Flujo economico esperado del escenario bajo los supuestos actuales.' },
      { label: 'Ahorro estimado', value: estimatedSavings, helper: 'Impacto economico esperado por reduccion de costo o consumo frente al escenario actual.' },
      { label: 'CAPEX vs presupuesto', value: budgetCoverage, helper: budgetHelper },
      { label: 'Flujo neto anual', value: netAnnualFlow, helper: netAnnualFlowHelper },
      { label: 'Costo operativo', value: opex, helper: 'Carga operativa recurrente que acompana al caso.' },
      { label: 'Tasa interna', value: irr, helper: irrHelper },
    ],
  }
}

function getSummaryClimateMetric({
  energyType,
  irradiance,
  windSpeed,
  hydrology,
}: {
  energyType: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
}) {
  const normalized = energyType.trim().toUpperCase()

  if (normalized === 'WIND') {
    return {
      label: 'Velocidad del viento',
      value: `${windSpeed} m/s`,
    }
  }

  if (normalized === 'HYDRO') {
    return {
      label: 'Hidrología',
      value: String(hydrology),
    }
  }

  return {
    label: 'Irradiancia',
    value: `${irradiance} kWh/m2/día`,
  }
}

export function buildSummarySnapshotSection({
  energyType,
  irradiance,
  windSpeed,
  hydrology,
  revenue,
  capex,
  location,
  decisionDrivers,
}: {
  energyType: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  revenue: string
  capex: string
  location: string
  decisionDrivers: string[]
}): DetailSectionContent {
  const climateMetric = getSummaryClimateMetric({
    energyType,
    irradiance,
    windSpeed,
    hydrology,
  })

  return {
    sectionLabel: 'Decisión',
    title: 'Sustento de la recomendación',
    summary: 'Señales que hoy explican la recomendación y qué conviene revisar antes de mover inversión.',
    primaryMetrics: [
      { label: 'Retorno', value: 'Señal económica', helper: decisionDrivers[0] ?? 'Sin lectura disponible.' },
      { label: 'Recuperación', value: 'Horizonte de inversión', helper: decisionDrivers[1] ?? 'Sin lectura disponible.' },
      { label: 'Desempeño técnico', value: 'Condición operativa', helper: decisionDrivers[2] ?? 'Sin lectura disponible.' },
    ],
    supportingMetrics: [
      { label: 'Ingreso estimado', value: revenue, helper: `Inversión inicial: ${capex}` },
      { label: climateMetric.label, value: climateMetric.value },
      { label: 'Ubicación', value: location },
    ],
  }
}

export function buildClimateSection({
  energyType,
  irradiance,
  windSpeed,
  hydrology,
  averageTemperature,
  climateSource,
  climatePeriod,
}: {
  energyType: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  averageTemperature: string
  climateSource: string
  climatePeriod: string
}): DetailSectionContent {
  const normalized = energyType.trim().toUpperCase()
  const primaryResource =
    normalized === 'WIND'
      ? { label: 'Viento utilizable', value: windSpeed === 'N/D' ? 'N/D' : `${windSpeed} m/s`, helper: 'Variable principal para leer la consistencia del recurso eolico.' }
      : normalized === 'HYDRO'
        ? { label: 'Condicion hidrologica', value: String(hydrology), helper: 'Variable principal para interpretar disponibilidad y estabilidad del recurso hidraulico.' }
        : { label: 'Irradiancia utilizable', value: irradiance === 'N/D' ? 'N/D' : `${irradiance} kWh/m2/día`, helper: 'Variable principal para interpretar el potencial solar del escenario.' }

  const climateRead =
    normalized === 'WIND'
      ? 'La lectura climatica debe concentrarse en estabilidad de viento, temperatura de operacion y ventana de datos usada para la simulacion.'
      : normalized === 'HYDRO'
        ? 'La lectura climatica debe concentrarse en condicion hidrologica, contexto de temperatura y trazabilidad temporal del recurso.'
        : 'La lectura climatica debe concentrarse en irradiancia, temperatura operativa y ventana temporal usada para estimar el recurso.'

  return {
    sectionLabel: 'Clima',
    title: 'Lectura climatica del recurso',
    summary: climateRead,
    primaryMetrics: [
      primaryResource,
      { label: 'Temperatura promedio', value: averageTemperature, helper: 'Ayuda a contextualizar operacion esperada y condiciones ambientales del escenario.' },
      { label: 'Ventana de datos', value: climatePeriod, helper: 'Periodo de referencia usado para sostener la lectura del recurso.' },
    ],
    supportingMetrics: [
      { label: 'Fuente climatica', value: climateSource, helper: 'Proveedor o fuente usada para la trazabilidad del dato.' },
      { label: 'Irradiancia reportada', value: irradiance === 'N/D' ? 'N/D' : `${irradiance} kWh/m2/día` },
      { label: 'Viento reportado', value: windSpeed === 'N/D' ? 'N/D' : `${windSpeed} m/s` },
      { label: 'Hidrologia reportada', value: String(hydrology) },
    ],
  }
}

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

export function buildFinancialPendingPlaceholder(): DetailPlaceholderContent {
  return {
    sectionLabel: 'Financiero',
    title: 'Señales pendientes para comité financiero',
    description:
      'Este bloque ya reserva el espacio para información que todavía depende del backend: sensibilidad del escenario (base, optimista y conservador), tasa de descuento o costo de capital usado para NPV e IRR, horizonte temporal explícito del modelo y desglose claro entre ingresos y ahorros.',
  }
}

export function buildFinancialChart({
  capex,
  budget,
  revenue,
  netAnnualFlow,
}: {
  capex: number | null
  budget: number | null
  revenue: number | null
  netAnnualFlow: number | null
}): DetailChartDatum[] {
  const points: DetailChartDatum[] = []

  if (capex !== null) {
    points.push({ label: 'CAPEX', value: capex, tone: 'capital' })
  }

  if (budget !== null) {
    points.push({ label: 'Presupuesto', value: budget, tone: 'budget' })
  }

  if (revenue !== null) {
    points.push({ label: 'Ingreso anual', value: revenue, tone: 'revenue' })
  }

  if (netAnnualFlow !== null) {
    points.push({ label: 'Flujo neto anual', value: netAnnualFlow, tone: 'net' })
  }

  return points
}
