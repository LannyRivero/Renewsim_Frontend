import type { SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'
import {
  buildDisplayTitle,
  formatCurrency,
  formatDate,
  formatEnergyTypeLabel,
  formatNumber,
} from './simulationDetailsFormatters'
import { buildEffectiveResult } from './simulationDetailsResult'
import {
  buildClimateSection,
  buildComparisonPlaceholder,
  buildComparisonSection,
  buildDecisionSummary,
  buildFinancialChart,
  buildFinancialPendingPlaceholder,
  buildFinancialSection,
  buildSummarySection,
  buildSummarySnapshotSection,
} from './simulationDetailsBuilders'
import type { SimulationDetailsViewModel } from './simulationDetailsTypes'

export function buildSimulationDetailsViewModel({
  data,
  requestedSimulationId,
  resultFromStore,
}: {
  data: SimulationDetails | null | undefined
  requestedSimulationId: string | null
  resultFromStore: SimulationResult | null
}): SimulationDetailsViewModel {
  const effectiveResult = buildEffectiveResult(data, requestedSimulationId, resultFromStore)

  const energyType = effectiveResult?.energyType ?? 'Unknown'
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
  const displayTitle = buildDisplayTitle({ simulationName, energyType, location })
  const decisionSummary = buildDecisionSummary({
    roi: roiNumber,
    paybackYears: paybackYearsNumber,
    efficiency: efficiencyNumber,
    revenue: revenueNumber,
    capex: capexNumber,
    energyTypeLabel: formatEnergyTypeLabel(energyType),
  })
  const roi = roiNumber !== null ? `${formatNumber(roiNumber)}%` : 'N/D'
  const efficiency = efficiencyNumber !== null ? `${formatNumber(efficiencyNumber)}%` : 'N/D'
  const capex = capexNumber !== null ? formatCurrency(capexNumber) : 'N/D'
  const opex = typeof data?.opex === 'number' ? formatCurrency(data.opex) : 'N/D'
  const revenue = revenueNumber !== null ? formatCurrency(revenueNumber) : 'N/D'
  const paybackYears = paybackYearsNumber !== null ? `${formatNumber(paybackYearsNumber)} años` : 'N/D'
  const npv = typeof data?.npv === 'number' ? formatCurrency(data.npv) : 'N/D'
  const irr = typeof data?.irr === 'number' ? `${formatNumber(data.irr)}%` : 'N/D'
  const estimatedSavings = estimatedSavingsNumber !== null ? formatCurrency(estimatedSavingsNumber) : 'N/D'
  const budgetCoverage =
    budgetNumber !== null && capexNumber !== null ? formatCurrency(budgetNumber - capexNumber) : 'N/D'
  const netAnnualFlowNumber = revenueNumber !== null && typeof data?.opex === 'number' ? revenueNumber - data.opex : null
  const netAnnualFlow = netAnnualFlowNumber !== null ? formatCurrency(netAnnualFlowNumber) : 'N/D'
  const energyGenerated =
    typeof effectiveResult?.energyGenerated === 'number' ? `${Math.round(effectiveResult.energyGenerated).toLocaleString('en-US')} kWh` : 'N/D'
  const averageTemperature = typeof effectiveResult?.temperature === 'number' ? `${effectiveResult.temperature.toFixed(1)} C` : 'N/D'
  const irradiance = effectiveResult?.irradiance ?? 'N/D'
  const windSpeed = effectiveResult?.windSpeed ?? 'N/D'
  const hydrology = effectiveResult?.hydrology ?? 'N/D'
  const climateSource = effectiveResult?.climateSource ?? 'N/D'
  const climatePeriod = effectiveResult?.climatePeriod ?? 'N/D'

  return {
    effectiveResult,
    location,
    energyType,
    displayTitle,
    simulationName,
    date: formatDate(data?.createdAt),
    roi,
    efficiency,
    decisionStatus: decisionSummary.decisionStatus,
    decisionHeadline: decisionSummary.decisionHeadline,
    decisionSummary: decisionSummary.decisionSummary,
    decisionDrivers: decisionSummary.decisionDrivers,
    capex,
    opex,
    revenue,
    paybackYears,
    npv,
    irr,
    energyGenerated,
    averageTemperature,
    irradiance,
    windSpeed,
    hydrology,
    climateSource,
    climatePeriod,
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
    financialChart: buildFinancialChart({
      capex: capexNumber,
      budget: budgetNumber,
      revenue: revenueNumber,
      netAnnualFlow: netAnnualFlowNumber,
    }),
    financialPendingPlaceholder: buildFinancialPendingPlaceholder(),
    climateSection: buildClimateSection({
      energyType,
      irradiance,
      windSpeed,
      hydrology,
      averageTemperature,
      climateSource,
      climatePeriod,
    }),
    comparisonSection: buildComparisonSection({
      roi: roiNumber,
      paybackYears: paybackYearsNumber,
      efficiency: efficiencyNumber,
      decisionStatus: decisionSummary.decisionStatus,
    }),
    comparisonPlaceholder: buildComparisonPlaceholder(),
  }
}
