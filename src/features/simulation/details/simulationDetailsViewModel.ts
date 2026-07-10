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
      : {
        decisionStatus:
          realData.summary.recommendation === 'recommended'
            ? 'Recomendado'
            : realData.summary.recommendation === 'viable_with_reservations'
              ? 'Viable con reservas'
              : 'No recomendado',
        decisionHeadline: realData.summary.headline,
        decisionSummary: realData.summary.summary,
        decisionDrivers: realData.summary.reasons.map((reason) => reason.message),
        mainSignal: realData.summary.reasons[0]?.message ?? 'El backend entregó una lectura consolidada del escenario.',
        mainRisk:
          realData.summary.reasons.find((reason) => reason.severity === 'critical' || reason.severity === 'warning')?.message ??
          'Conviene validar sensibilidad y supuestos antes de comprometer inversión final.',
        nextAction:
          realData.summary.recommendation === 'recommended'
            ? 'Pasar a validación final con supuestos y cierre financiero.'
            : realData.summary.recommendation === 'viable_with_reservations'
              ? 'Comparar sensibilidad y cerrar validaciones antes de priorizar.'
              : 'Revisar supuestos técnicos y económicos antes de volver a presentarlo.',
        }
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
