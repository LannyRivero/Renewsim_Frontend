import type { DetailSectionContent } from './simulationDetailsTypes'

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
    summary: 'Lectura económica del escenario para validar si la inversión se recupera, crea valor y sostiene una defensa frente a negocio.',
    primaryMetrics: [
      { label: 'Inversión inicial', value: capex, helper: 'Capital requerido para activar el escenario.' },
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
