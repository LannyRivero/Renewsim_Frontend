import { z } from 'zod'

export const simulationDetailsSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  location: z.string().catch('N/A'),
  country: z.string().optional(),
  locationLatitude: z.number().optional(),
  locationLongitude: z.number().optional(),
  energyType: z.string().catch('Unknown'),
  createdAt: z.string().optional(),
  roi: z.number().optional(),
  efficiency: z.number().optional(),
  projectSize: z.number().optional(),
  temperature: z.number().optional(),
  climateSource: z.string().optional(),
  climatePeriod: z.string().optional(),
  irradiance: z.number().optional(),
  windSpeed: z.number().optional(),
  hydrology: z.number().optional(),
  capex: z.number().optional(),
  opex: z.number().optional(),
  revenue: z.number().optional(),
  paybackYears: z.number().optional(),
  npv: z.number().optional(),
  irr: z.number().optional(),
  budget: z.number().optional(),
  energyGenerated: z.number().optional(),
  estimatedSavings: z.number().optional(),
})

export type SimulationDetails = z.infer<typeof simulationDetailsSchema>
