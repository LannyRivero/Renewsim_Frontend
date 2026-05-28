import { z } from 'zod'

export const simulationSchema = z.object({
  location: z.string().trim().min(2, 'Location must be at least 2 characters'),
  energyType: z.enum(['solar', 'wind', 'hydro']),
  projectSize: z.coerce.number().positive('Project size must be greater than 0'),
  budget: z.coerce.number().positive('Budget must be greater than 0'),
})

export type SimulationFormValues = z.infer<typeof simulationSchema>

export const simulationDetailsSchema = z.object({
  id: z.string(),
  location: z.string().catch('N/A'),
  energyType: z.string().catch('Unknown'),
  createdAt: z.string().optional(),
  roi: z.number().optional(),
  efficiency: z.number().optional(),
})

export type SimulationDetails = z.infer<typeof simulationDetailsSchema>

export const editSimulationSchema = z.object({
  simulationName: z.string().trim().min(2, 'Simulation name must be at least 2 characters'),
  location: z.string().trim().min(2, 'Location must be at least 2 characters'),
  energySource: z.string().trim().min(2, 'Energy source is required'),
  systemSizeKw: z.coerce.number().positive('System size must be greater than 0'),
  annualConsumptionKwh: z.coerce.number().positive('Annual consumption must be greater than 0'),
  incentives: z.coerce.number().min(0, 'Incentives must be zero or positive'),
  electricityRate: z.coerce.number().positive('Electricity rate must be greater than 0'),
})

export type EditSimulationValues = z.infer<typeof editSimulationSchema>
