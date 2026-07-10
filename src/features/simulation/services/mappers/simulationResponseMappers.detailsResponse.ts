import type { SimulationDetailsResponse } from '@/shared/types'
import {
  readNumber,
  readOptionalNumber,
  readRecord,
  readString,
  toFinancialYears,
  toMonthlyEnergyBalance,
  toMonthlySeries,
  toRealSimulationInput,
  toRecommendationReasons,
  toResolvedLocation,
  toResourceSeries,
  toSimulationStatus,
  toSimulationWarnings,
} from './simulationResponseMappers.shared'

export function toSimulationDetailsResponse(value: unknown): SimulationDetailsResponse {
  const candidate = readRecord(value)
  const summary = readRecord(candidate?.summary)
  const technical = readRecord(candidate?.technical)
  const technicalLosses = readRecord(technical?.lossesPct)
  const financial = readRecord(candidate?.financial)
  const assumptions = readRecord(candidate?.assumptions)
  const recommendation = summary?.recommendation

  return {
    id: readString(candidate?.id, 'N/A'),
    status: toSimulationStatus(candidate?.status),
    createdAt: readString(candidate?.createdAt, ''),
    updatedAt: readString(candidate?.updatedAt, ''),
    modelVersion: readString(candidate?.modelVersion, 'unknown'),
    technology: 'solar',
    location: toResolvedLocation(candidate?.location),
    summary: {
      recommendation:
        recommendation === 'recommended' || recommendation === 'viable_with_reservations' || recommendation === 'not_recommended'
          ? recommendation
          : 'not_recommended',
      headline: readString(summary?.headline, 'N/A'),
      summary: readString(summary?.summary, 'N/A'),
      reasons: toRecommendationReasons(summary?.reasons),
    },
    input: toRealSimulationInput(candidate?.input),
    technical: {
      annualGenerationKwh: readNumber(technical?.annualGenerationKwh),
      monthlyGenerationKwh: toMonthlySeries(technical?.monthlyGenerationKwh),
      specificYieldKwhPerKwp: readNumber(technical?.specificYieldKwhPerKwp),
      performanceRatio: readNumber(technical?.performanceRatio),
      capacityFactorPct: readNumber(technical?.capacityFactorPct),
      selfConsumptionRatePct: readNumber(technical?.selfConsumptionRatePct),
      coverageRatePct: readNumber(technical?.coverageRatePct),
      resource: toResourceSeries(technical?.resource),
      lossesPct: {
        inverter: readNumber(technicalLosses?.inverter),
        temperature: readNumber(technicalLosses?.temperature),
        wiring: readNumber(technicalLosses?.wiring),
        soiling: readNumber(technicalLosses?.soiling),
        other: readNumber(technicalLosses?.other),
        total: readNumber(technicalLosses?.total),
      },
      balanceByMonth: toMonthlyEnergyBalance(technical?.balanceByMonth),
    },
    financial: {
      currency: 'EUR',
      annualSavings: readNumber(financial?.annualSavings),
      annualExportRevenue: readNumber(financial?.annualExportRevenue),
      netAnnualBenefit: readNumber(financial?.netAnnualBenefit),
      paybackYears: readOptionalNumber(financial?.paybackYears) ?? null,
      discountedPaybackYears: readOptionalNumber(financial?.discountedPaybackYears) ?? null,
      npv: readNumber(financial?.npv),
      irrPct: readOptionalNumber(financial?.irrPct) ?? null,
      lcoePerKwh: readNumber(financial?.lcoePerKwh),
      yearlyCashFlows: toFinancialYears(financial?.yearlyCashFlows),
    },
    assumptions: {
      discountRatePct: readNumber(assumptions?.discountRatePct),
      projectLifetimeYears: readNumber(assumptions?.projectLifetimeYears),
      degradationRateAnnualPct: readNumber(assumptions?.degradationRateAnnualPct),
      electricityPurchasePricePerKwh: readNumber(assumptions?.electricityPurchasePricePerKwh),
      exportPricePerKwh: readNumber(assumptions?.exportPricePerKwh),
      climateSource: 'PVGIS',
      climatePeriod: readString(assumptions?.climatePeriod, 'N/A'),
    },
    warnings: toSimulationWarnings(candidate?.warnings),
  }
}
