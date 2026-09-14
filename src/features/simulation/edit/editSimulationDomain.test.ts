import { describe, expect, it } from 'vitest'
import type { EditSimulationValues } from '../schemas/simulationSchema'
import type { MonthlySeries } from '@/shared/types'
import { buildSimulationDemandPayload } from './editSimulationDomain'

const baseValues: EditSimulationValues = {
  name: 'Solar edit',
  location: 'Gijón/Xixón, Asturias, ES',
  technology: 'solar',
  installedCapacityKw: 300,
  performanceRatio: 0.81,
  degradationRateAnnualPct: 0.5,
  availabilityPct: 99,
  lossesPct: { inverter: 2, temperature: 6, wiring: 1, soiling: 3, other: 1 },
  annualConsumptionKwh: 140000,
  monthlyConsumptionKwh: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
  capexTotal: 315000,
  currency: 'EUR',
  opexAnnual: 7200,
  electricityPurchasePricePerKwh: 0.2,
  exportPricePerKwh: 0.07,
  discountRatePct: 8,
  projectLifetimeYears: 20,
}

describe('buildSimulationDemandPayload', () => {
  it('rescales submitted monthly consumption when annual consumption changes', () => {
    const payload = buildSimulationDemandPayload(baseValues.monthlyConsumptionKwh as MonthlySeries, baseValues)

    expect(payload.annualConsumptionKwh).toBe(140000)
    expect(payload.monthlyConsumptionKwh.reduce((sum, value) => sum + value, 0)).toBe(140000)
  })

  it('distributes annual consumption evenly when no monthly pattern exists', () => {
    const payload = buildSimulationDemandPayload(
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      { ...baseValues, annualConsumptionKwh: 1200, monthlyConsumptionKwh: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    )

    expect(payload.monthlyConsumptionKwh).toEqual([100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100])
  })
})
