import type { SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationDetailsResponse, SimulationResult } from '@/shared/types'
import {
  formatCurrency,
  formatDate,
  formatEnergyTypeLabel,
  formatNumber,
} from './simulationDetailsFormatters'
import { buildEffectiveResult } from './simulationDetailsResult'
import {
  buildClimateSection,
  buildComparisonPlaceholder,
  buildDecisionSummary,
  buildFinancialSection,
  buildSummarySection,
  buildSummarySnapshotSection,
} from './simulationDetailsBuilders'
import type { SimulationDetailsViewModel } from './simulationDetailsTypes'

export type {
  DecisionSummary,
  DetailMetric,
  DetailPlaceholderContent,
  DetailSectionContent,
  EffectiveSimulationResult,
  SimulationDetailsViewModel,
} from './simulationDetailsTypes'

function isLikelyEnglishText(value: string) {
  return /\b(the|and|with|while|should|would|project|site|decision|validating|recovery|performance|targets|inputs|submitted|core|carefully|credible|review)\b/i.test(value)
}

function shouldUseSpanishFallback(realData: SimulationDetailsResponse) {
  const texts = [
    realData.summary.headline,
    realData.summary.summary,
    ...realData.summary.reasons.map((reason) => reason.message),
  ]

  return texts.some((text) => isLikelyEnglishText(text))
}

function decisionCopyFor(recommendation: string, primaryReason?: string, summary?: string) {
  if (recommendation === 'recommended') {
    return {
      mainSignal:
        primaryReason ?? summary ?? 'La producción estimada y el retorno financiero sostienen la viabilidad del proyecto.',
      mainRisk: 'La reserva principal es confirmar precios finales, consumo esperado y condiciones reales de instalación.',
      nextAction: 'Avanzar a validación final de costos, permisos y cierre financiero.',
    }
  }

  if (recommendation === 'viable_with_reservations') {
    return {
      mainSignal:
        primaryReason ?? summary ?? 'El proyecto tiene potencial, pero todavía depende de validar supuestos clave.',
      mainRisk: 'El riesgo principal es que el ahorro real baje si consumo, coste o recurso solar se desvían del escenario estimado.',
      nextAction: 'Comparar sensibilidad de consumo, CAPEX y autoconsumo antes de priorizar inversión.',
    }
  }

  return {
    mainSignal:
      primaryReason ?? summary ?? 'La inversión no se justifica con la generación y el ahorro estimados en este escenario.',
    mainRisk: 'El riesgo principal es inmovilizar presupuesto en un caso con retorno insuficiente o recuperación demasiado larga.',
    nextAction: 'Reducir CAPEX, ajustar tamaño o cambiar supuestos antes de volver a evaluar.',
  }
}

export function buildSimulationDetailsViewModel({
  data,
  realData,
  requestedSimulationId,
  resultFromStore,
}: {
  data: SimulationDetails | null | undefined
  realData?: SimulationDetailsResponse | null
  requestedSimulationId: string | null
  resultFromStore: SimulationResult | null
}): SimulationDetailsViewModel {
  const effectiveResult = buildEffectiveResult(data, realData, requestedSimulationId, resultFromStore)

  const energyType = effectiveResult?.energyType ?? ''
  const roiNumber = typeof effectiveResult?.roi === 'number' ? effectiveResult.roi : null
  const efficiencyNumber = typeof effectiveResult?.efficiency === 'number' ? effectiveResult.efficiency : null
  const capexNumber = typeof data?.capex === 'number' ? data.capex : typeof effectiveResult?.budget === 'number' ? effectiveResult.budget : null
  const revenueNumber = typeof data?.revenue === 'number' ? data.revenue : typeof effectiveResult?.estimatedSavings === 'number' ? effectiveResult.estimatedSavings : null
  const paybackYearsNumber = typeof data?.paybackYears === 'number' ? data.paybackYears : null
  const budgetNumber = typeof data?.budget === 'number' ? data.budget : typeof effectiveResult?.budget === 'number' ? effectiveResult.budget : null
  const estimatedSavingsNumber =
    typeof data?.estimatedSavings === 'number'
      ? data.estimatedSavings
      : typeof effectiveResult?.estimatedSavings === 'number'
        ? effectiveResult.estimatedSavings
        : null
  const location = effectiveResult?.location ?? 'N/A'
  const simulationName = effectiveResult?.name ?? `${energyType} Simulación`
  const generatedDecisionSummary = buildDecisionSummary({
    roi: roiNumber,
    paybackYears: paybackYearsNumber,
    efficiency: efficiencyNumber,
    revenue: revenueNumber,
    capex: capexNumber,
    energyTypeLabel: formatEnergyTypeLabel(energyType),
  })
  const decisionSummary = realData
    ? shouldUseSpanishFallback(realData)
      ? {
          ...generatedDecisionSummary,
          decisionStatus:
            realData.summary.recommendation === 'recommended'
              ? 'Recomendado'
              : realData.summary.recommendation === 'viable_with_reservations'
                ? 'Viable con reservas'
                : 'No recomendado',
        }
      : (() => {
        const primaryReason = realData.summary.reasons[0]?.message
        const decisionCopy = decisionCopyFor(
          realData.summary.recommendation,
          primaryReason,
          realData.summary.summary,
        )

        return {
        decisionStatus:
          realData.summary.recommendation === 'recommended'
            ? 'Recomendado'
            : realData.summary.recommendation === 'viable_with_reservations'
              ? 'Viable con reservas'
              : 'No recomendado',
        decisionHeadline: realData.summary.headline,
        decisionSummary: realData.summary.summary,
        decisionDrivers: realData.summary.reasons.map((reason) => reason.message),
        mainSignal: decisionCopy.mainSignal,
        mainRisk:
          realData.summary.reasons.find((reason) => reason.severity === 'critical' || reason.severity === 'warning')?.message ??
          decisionCopy.mainRisk,
        nextAction: decisionCopy.nextAction,
        }
      })()
    : generatedDecisionSummary
  const roi = roiNumber !== null ? `${formatNumber(roiNumber)}%` : 'N/D'
  const capex = capexNumber !== null ? formatCurrency(capexNumber) : realData ? formatCurrency(realData.input.economics.capexTotal) : 'N/D'
  const opex = typeof data?.opex === 'number' ? formatCurrency(data.opex) : realData ? formatCurrency(realData.input.economics.opexAnnual) : 'N/D'
  const revenue = revenueNumber !== null ? formatCurrency(revenueNumber) : realData ? formatCurrency(realData.financial.annualExportRevenue) : 'N/D'
  const paybackYears = paybackYearsNumber !== null ? `${formatNumber(paybackYearsNumber)} años` : realData?.financial.paybackYears !== null && typeof realData?.financial.paybackYears === 'number' ? `${formatNumber(realData.financial.paybackYears)} años` : 'N/D'
  const npv = typeof data?.npv === 'number' ? formatCurrency(data.npv) : realData ? formatCurrency(realData.financial.npv) : 'N/D'
  const irr = typeof data?.irr === 'number' ? `${formatNumber(data.irr)}%` : realData?.financial.irrPct !== null && typeof realData?.financial.irrPct === 'number' ? `${formatNumber(realData.financial.irrPct)}%` : 'N/D'
  const estimatedSavings = estimatedSavingsNumber !== null ? formatCurrency(estimatedSavingsNumber) : 'N/D'
  const budgetCoverage =
    budgetNumber !== null && capexNumber !== null ? formatCurrency(budgetNumber - capexNumber) : 'N/D'
  const netAnnualFlowNumber = revenueNumber !== null && typeof data?.opex === 'number' ? revenueNumber - data.opex : null
  const netAnnualFlow = netAnnualFlowNumber !== null ? formatCurrency(netAnnualFlowNumber) : 'N/D'
  const averageTemperature = typeof effectiveResult?.temperature === 'number' ? `${effectiveResult.temperature.toFixed(1)} C` : 'N/D'
  const irradiance = effectiveResult?.irradiance ?? 'N/D'
  const windSpeed = effectiveResult?.windSpeed ?? 'N/D'
  const hydrology = effectiveResult?.hydrology ?? 'N/D'
  const climateSource = effectiveResult?.climateSource ?? 'N/D'
  const climatePeriod = effectiveResult?.climatePeriod ?? 'N/D'

  return {
    location,
    energyType,
    simulationName,
    date: formatDate(realData?.createdAt ?? data?.createdAt),
    decisionStatus: decisionSummary.decisionStatus,
    decisionHeadline: decisionSummary.decisionHeadline,
    decisionSummary: decisionSummary.decisionSummary,
    decisionDrivers: decisionSummary.decisionDrivers,
    summarySection: buildSummarySection({
      decisionStatus: decisionSummary.decisionStatus,
      decisionHeadline: decisionSummary.decisionHeadline,
      decisionSummary: decisionSummary.decisionSummary,
      roi,
      paybackYears,
      mainSignal: decisionSummary.mainSignal,
      mainRisk: decisionSummary.mainRisk,
      nextAction: decisionSummary.nextAction,
    }),
    summarySnapshotSection: buildSummarySnapshotSection({
      energyType,
      irradiance,
      windSpeed,
      hydrology,
      revenue,
      capex,
      location,
      decisionDrivers: decisionSummary.decisionDrivers,
    }),
    financialSection: buildFinancialSection({
      capex,
      revenue,
      paybackYears,
      opex,
      npv,
      irr,
      estimatedSavings,
      budgetCoverage,
      netAnnualFlow,
    }),
    climateSection: buildClimateSection({
      energyType,
      irradiance,
      windSpeed,
      hydrology,
      averageTemperature,
      climateSource,
      climatePeriod,
    }),
    comparisonPlaceholder: buildComparisonPlaceholder(),
  }
}
