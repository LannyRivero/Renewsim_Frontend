import { z } from 'zod'

export const technologySchema = z.object({
  name: z.string().trim().min(2, 'Technology name must be at least 2 characters'),
  energyType: z.enum(['SOLAR', 'WIND', 'HYDRO']),
  efficiency: z.coerce.number().min(0, 'Efficiency must be >= 0').max(100, 'Efficiency must be <= 100'),
  co2Reduction: z.coerce.number().min(0, 'CO2 reduction must be >= 0'),
  installationCost: z.coerce.number().min(1, 'Installation cost must be > 0'),
  maintenanceCost: z.coerce.number().min(0, 'Maintenance cost must be >= 0'),
  environmentalImpact: z.coerce.number().min(0, 'Environmental impact must be >= 0').max(100, 'Environmental impact must be <= 100'),
})

export type TechnologyFormValues = z.infer<typeof technologySchema>
