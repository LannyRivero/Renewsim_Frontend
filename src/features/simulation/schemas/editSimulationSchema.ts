import { z } from 'zod'
import { LOCATION_QUERY_MIN_LENGTH, NAME_MIN_LENGTH } from './simulationSchemaConstants'

export const editSimulationSchema = z.object({
  name: z.string().trim().min(NAME_MIN_LENGTH, 'Simulation name must be at least 2 characters'),
  location: z.string().trim().min(LOCATION_QUERY_MIN_LENGTH, 'Location must be at least 2 characters'),
  technology: z.enum(['solar']),
  installedCapacityKw: z.coerce.number().positive('System size must be greater than 0'),
  performanceRatio: z.coerce.number().positive('Performance ratio must be greater than 0'),
  degradationRateAnnualPct: z.coerce.number().min(0, 'Degradation must be zero or positive'),
  availabilityPct: z.coerce.number().positive('Availability must be greater than 0'),
  lossesPct: z.object({
    inverter: z.coerce.number().min(0),
    temperature: z.coerce.number().min(0),
    wiring: z.coerce.number().min(0),
    soiling: z.coerce.number().min(0),
    other: z.coerce.number().min(0),
  }),
  annualConsumptionKwh: z.coerce.number().positive('Annual consumption must be greater than 0'),
  monthlyConsumptionKwh: z.array(z.coerce.number().min(0)).length(12),
  capexTotal: z.coerce.number().min(0, 'Estimated investment must be zero or positive'),
  currency: z.enum(['EUR']),
  opexAnnual: z.coerce.number().min(0),
  electricityPurchasePricePerKwh: z.coerce.number().positive('Electricity rate must be greater than 0'),
  exportPricePerKwh: z.coerce.number().min(0),
  discountRatePct: z.coerce.number().min(0),
  projectLifetimeYears: z.coerce.number().min(5),
})

export type EditSimulationValues = z.infer<typeof editSimulationSchema>
