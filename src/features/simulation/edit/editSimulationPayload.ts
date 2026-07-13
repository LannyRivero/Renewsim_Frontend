import { getRealSimulationById, searchLocations } from '../services/simulationService'
import type { EditSimulationValues } from '../schemas/simulationSchema'
import type { MonthlySeries, RealCreateSimulationRequest } from '@/shared/types'

function scaleMonthlyConsumptionKwh(currentMonthly: MonthlySeries, nextAnnualConsumptionKwh: number): MonthlySeries {
  const currentTotal = currentMonthly.reduce((sum, value) => sum + value, 0)

  if (currentTotal <= 0) {
    const monthlyBase = Number((nextAnnualConsumptionKwh / 12).toFixed(2))
    const values = Array.from({ length: 12 }, () => monthlyBase)
    values[11] = Number((nextAnnualConsumptionKwh - monthlyBase * 11).toFixed(2))
    return values as MonthlySeries
  }

  const scaled = currentMonthly.map((value) => Number(((value / currentTotal) * nextAnnualConsumptionKwh).toFixed(2)))
  const scaledTotal = scaled.reduce((sum, value) => sum + value, 0)
  scaled[11] = Number((scaled[11] + (nextAnnualConsumptionKwh - scaledTotal)).toFixed(2))

  return scaled as MonthlySeries
}

async function resolveEditedLocation(
  currentPayload: RealCreateSimulationRequest,
  nextLocationLabel: string,
): Promise<RealCreateSimulationRequest['location']> {
  if (nextLocationLabel === currentPayload.location.label) {
    return currentPayload.location
  }

  const matches = await searchLocations(nextLocationLabel, 1)
  const bestMatch = matches[0]

  if (!bestMatch) {
    throw new Error('No se pudo resolver la nueva ubicación seleccionada.')
  }

  return {
    label: bestMatch.label,
    lat: bestMatch.lat,
    lon: bestMatch.lon,
    country: bestMatch.country,
    countryCode: bestMatch.countryCode,
  }
}

export async function buildUpdatedSimulationPayload(
  currentSimulation: Awaited<ReturnType<typeof getRealSimulationById>>,
  values: EditSimulationValues,
): Promise<RealCreateSimulationRequest> {
  const currentPayload = currentSimulation.input

  if (values.technology !== 'solar') {
    throw new Error('Por ahora el backend real solo soporta simulaciones solares.')
  }

  const location = await resolveEditedLocation(currentPayload, values.location)

  return {
    name: values.name,
    technology: values.technology,
    location,
    system: {
      installedCapacityKw: values.installedCapacityKw,
      performanceRatio: values.performanceRatio,
      degradationRateAnnualPct: values.degradationRateAnnualPct,
      availabilityPct: values.availabilityPct,
      lossesPct: values.lossesPct,
    },
    demand: {
      annualConsumptionKwh: values.annualConsumptionKwh,
      monthlyConsumptionKwh:
        values.monthlyConsumptionKwh.some((value) => value > 0)
          ? (values.monthlyConsumptionKwh as MonthlySeries)
          : scaleMonthlyConsumptionKwh(currentPayload.demand.monthlyConsumptionKwh, values.annualConsumptionKwh),
    },
    economics: {
      capexTotal: values.capexTotal,
      currency: values.currency,
      opexAnnual: values.opexAnnual,
      electricityPurchasePricePerKwh: values.electricityPurchasePricePerKwh,
      exportPricePerKwh: values.exportPricePerKwh,
      discountRatePct: values.discountRatePct,
      projectLifetimeYears: values.projectLifetimeYears,
    },
  }
}
