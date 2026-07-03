import { z } from 'zod'
import { LOCATION_QUERY_MIN_LENGTH, NAME_MIN_LENGTH } from './simulationSchemaConstants'

export const editSimulationSchema = z.object({
  simulationName: z.string().trim().min(NAME_MIN_LENGTH, 'Simulation name must be at least 2 characters'),
  location: z.string().trim().min(LOCATION_QUERY_MIN_LENGTH, 'Location must be at least 2 characters'),
  energySource: z.string().trim().min(NAME_MIN_LENGTH, 'Energy source is required'),
  systemSizeKw: z.coerce.number().positive('System size must be greater than 0'),
  annualConsumptionKwh: z.coerce.number().positive('Annual consumption must be greater than 0'),
  incentives: z.coerce.number().min(0, 'Incentives must be zero or positive'),
  electricityRate: z.coerce.number().positive('Electricity rate must be greater than 0'),
})

export type EditSimulationValues = z.infer<typeof editSimulationSchema>
