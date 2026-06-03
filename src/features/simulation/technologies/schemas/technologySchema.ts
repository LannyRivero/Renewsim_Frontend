import { z } from 'zod'

export const technologySchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  energyType: z.enum(['SOLAR', 'WIND', 'HYDRO']),
  installedPower: z.coerce.number().min(1, 'La potencia instalada debe ser > 0'),
  capacityFactor: z.coerce.number().min(0, 'El factor de capacidad debe ser >= 0').max(100, 'El factor de capacidad debe ser <= 100'),
  efficiency: z.coerce.number().min(0, 'La eficiencia debe ser >= 0').max(100, 'La eficiencia debe ser <= 100'),
  co2Reduction: z.coerce.number().min(0, 'La reducción de CO2 debe ser >= 0'),
  installationCost: z.coerce.number().min(1, 'El costo de instalación debe ser > 0'),
  maintenanceCost: z.coerce.number().min(0, 'El costo de mantenimiento debe ser >= 0'),
  environmentalImpact: z.coerce.number().min(0, 'El impacto ambiental debe ser >= 0').max(100, 'El impacto ambiental debe ser <= 100'),
})

export type TechnologyFormValues = z.infer<typeof technologySchema>

export const CAPACITY_FACTOR_DEFAULTS: Record<string, number> = {
  SOLAR: 18,
  WIND: 35,
  HYDRO: 45,
}

export function computeAnnualEnergyProduction(installedPower: number, capacityFactor: number): number {
  return Math.round(installedPower * (capacityFactor / 100) * 8760)
}
