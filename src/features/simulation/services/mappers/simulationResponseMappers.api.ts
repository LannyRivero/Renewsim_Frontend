import type {
  MonthlyEnergyBalanceItem,
  RealCreateSimulationRequest,
  RecommendationReason,
  ResolvedLocation,
  ResourceSeries,
  SimulationFinancialResponse,
  SimulationWarning,
} from '@/shared/types'
import {
  readNumber,
  readRecord,
  readString,
  toMonthlySeries,
} from './simulationResponseMappers.readers'

export function toResolvedLocation(value: unknown): ResolvedLocation {
  const candidate = readRecord(value)

  return {
    label: readString(candidate?.label ?? candidate?.displayLabel, 'N/A'),
    name: readString(candidate?.name, 'N/A'),
    adminRegion: typeof candidate?.adminRegion === 'string' ? candidate.adminRegion : undefined,
    country: readString(candidate?.country, 'N/A'),
    countryCode: readString(candidate?.countryCode, 'N/A'),
    lat: readNumber(candidate?.lat),
    lon: readNumber(candidate?.lon),
    timezone: typeof candidate?.timezone === 'string' ? candidate.timezone : undefined,
  }
}

export function toRecommendationReasons(value: unknown): RecommendationReason[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      const candidate = readRecord(item)
      if (!candidate) return null

      const area = candidate.area
      const severity = candidate.severity
      const message = candidate.message

      if (
        (area === 'economics' || area === 'technical' || area === 'resource' || area === 'assumptions') &&
        (severity === 'positive' || severity === 'warning' || severity === 'critical') &&
        typeof message === 'string'
      ) {
        return { area, severity, message }
      }

      return null
    })
    .filter((item): item is RecommendationReason => item !== null)
}

export function toSimulationWarnings(value: unknown): SimulationWarning[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      const candidate = readRecord(item)
      if (!candidate) return null

      const severity = candidate.severity
      const code = candidate.code
      const message = candidate.message

      if (
        (severity === 'info' || severity === 'warning' || severity === 'critical') &&
        typeof code === 'string' &&
        typeof message === 'string'
      ) {
        return { severity, code, message }
      }

      return null
    })
    .filter((item): item is SimulationWarning => item !== null)
}

export function toResourceSeries(value: unknown): ResourceSeries {
  const candidate = readRecord(value)

  return {
    source: 'PVGIS',
    period: readString(candidate?.period, 'N/A'),
    monthlyIrradianceKwhM2: toMonthlySeries(candidate?.monthlyIrradianceKwhM2),
    monthlyTemperatureC: toMonthlySeries(candidate?.monthlyTemperatureC),
  }
}

export function toMonthlyEnergyBalance(value: unknown): MonthlyEnergyBalanceItem[] {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    const candidate = readRecord(item)

    return {
      month: readString(candidate?.month, 'N/A'),
      generationKwh: readNumber(candidate?.generationKwh),
      consumptionKwh: readNumber(candidate?.consumptionKwh),
      selfConsumedKwh: readNumber(candidate?.selfConsumedKwh),
      exportedKwh: readNumber(candidate?.exportedKwh),
      importedKwh: readNumber(candidate?.importedKwh),
    }
  })
}

export function toFinancialYears(value: unknown): SimulationFinancialResponse['yearlyCashFlows'] {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    const candidate = readRecord(item)

    return {
      year: readNumber(candidate?.year),
      savings: readNumber(candidate?.savings),
      exportRevenue: readNumber(candidate?.exportRevenue),
      opex: readNumber(candidate?.opex),
      replacementCost: readNumber(candidate?.replacementCost),
      netCashFlow: readNumber(candidate?.netCashFlow),
      discountedCashFlow: readNumber(candidate?.discountedCashFlow),
      cumulativeCashFlow: readNumber(candidate?.cumulativeCashFlow),
    }
  })
}

export function toRealSimulationInput(value: unknown): RealCreateSimulationRequest {
  const candidate = readRecord(value)
  const location = readRecord(candidate?.location)
  const system = readRecord(candidate?.system)
  const losses = readRecord(system?.lossesPct)
  const demand = readRecord(candidate?.demand)
  const economics = readRecord(candidate?.economics)

  return {
    name: readString(candidate?.name, 'Simulation'),
    energyType: 'solar',
    location: {
      label: readString(location?.label, 'N/A'),
      lat: readNumber(location?.lat),
      lon: readNumber(location?.lon),
      country: readString(location?.country, 'N/A'),
      countryCode: readString(location?.countryCode, 'N/A'),
    },
    system: {
      installedCapacityKw: readNumber(system?.installedCapacityKw),
      performanceRatio: readNumber(system?.performanceRatio),
      degradationRateAnnualPct: readNumber(system?.degradationRateAnnualPct),
      availabilityPct: readNumber(system?.availabilityPct),
      lossesPct: {
        inverter: readNumber(losses?.inverter),
        temperature: readNumber(losses?.temperature),
        wiring: readNumber(losses?.wiring),
        soiling: readNumber(losses?.soiling),
        other: readNumber(losses?.other),
      },
    },
    demand: {
      annualConsumptionKwh: readNumber(demand?.annualConsumptionKwh),
      monthlyConsumptionKwh: toMonthlySeries(demand?.monthlyConsumptionKwh),
    },
    economics: {
      currency: 'EUR',
      capexTotal: readNumber(economics?.capexTotal),
      opexAnnual: readNumber(economics?.opexAnnual),
      electricityPurchasePricePerKwh: readNumber(economics?.electricityPurchasePricePerKwh),
      exportPricePerKwh: readNumber(economics?.exportPricePerKwh),
      discountRatePct: readNumber(economics?.discountRatePct),
      projectLifetimeYears: readNumber(economics?.projectLifetimeYears),
    },
  }
}
