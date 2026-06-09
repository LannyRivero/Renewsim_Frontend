import { z } from 'zod'

const localizedNumber = z.preprocess((value) => {
  if (typeof value === 'string') {
    const normalized = value.replace(',', '.').trim()
    if (normalized.length === 0) return Number.NaN
    return Number(normalized)
  }

  return value
}, z.number().finite())

function positiveLocalizedNumber(message: string) {
  return localizedNumber.refine((value) => value > 0, { message })
}

export const simulationSchema = z.object({
  location: z.string().trim().min(2, 'La ubicación debe tener al menos 2 caracteres'),
  energyType: z.enum(['solar', 'wind', 'hydro']),
  projectSize: positiveLocalizedNumber('El tamaño del proyecto debe ser mayor que 0'),
  budget: positiveLocalizedNumber('El presupuesto debe ser mayor que 0'),
  energyConsumption: positiveLocalizedNumber('El consumo energético debe ser mayor que 0'),
})

export type SimulationFormValues = z.infer<typeof simulationSchema>

export const simulationCreateSchema = simulationSchema.extend({
  locationLatitude: localizedNumber.refine((value) => value >= -90 && value <= 90, {
    message: 'La latitud debe estar entre -90 y 90',
  }),
  locationLongitude: localizedNumber.refine((value) => value >= -180 && value <= 180, {
    message: 'La longitud debe estar entre -180 y 180',
  }),
})

export type SimulationCreateFormInput = z.input<typeof simulationCreateSchema>
export type SimulationCreateFormValues = z.infer<typeof simulationCreateSchema>

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
