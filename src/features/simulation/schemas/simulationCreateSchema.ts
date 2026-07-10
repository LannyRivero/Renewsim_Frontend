import { z } from 'zod'
import {
  AVAILABILITY_RANGE,
  COUNTRY_CODE_MIN_LENGTH,
  DEGRADATION_RATE_RANGE,
  LATITUDE_RANGE,
  LOCATION_LABEL_MIN_LENGTH,
  LOCATION_QUERY_MIN_LENGTH,
  LONGITUDE_RANGE,
  MONTHS_PER_YEAR,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  PERFORMANCE_RATIO_RANGE,
  PROJECT_LIFETIME_MIN_YEARS,
} from './simulationSchemaConstants'

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

function nonNegativeLocalizedNumber(message: string) {
  return localizedNumber.refine((value) => value >= 0, { message })
}

const monthlyConsumptionSchema = z
  .array(nonNegativeLocalizedNumber('Cada consumo mensual debe ser cero o mayor.'))
  .length(MONTHS_PER_YEAR, 'El consumo mensual debe incluir exactamente 12 valores.')

export const simulationSchema = z.object({
  name: z.string().trim().min(NAME_MIN_LENGTH, 'El nombre del proyecto debe tener al menos 2 caracteres').max(NAME_MAX_LENGTH, 'El nombre del proyecto no puede superar los 120 caracteres'),
  technology: z.enum(['solar']),
  locationSearch: z.string().trim().min(LOCATION_QUERY_MIN_LENGTH, 'La ubicación debe tener al menos 2 caracteres'),
  location: z.object({
    label: z.string().trim().min(LOCATION_LABEL_MIN_LENGTH, 'Seleccioná una ubicación sugerida válida.'),
    lat: localizedNumber.refine((value) => value >= LATITUDE_RANGE.min && value <= LATITUDE_RANGE.max, {
      message: 'La latitud debe estar entre -90 y 90',
    }),
    lon: localizedNumber.refine((value) => value >= LONGITUDE_RANGE.min && value <= LONGITUDE_RANGE.max, {
      message: 'La longitud debe estar entre -180 y 180',
    }),
    country: z.string().trim().min(1, 'El país es obligatorio.'),
    countryCode: z.string().trim().min(COUNTRY_CODE_MIN_LENGTH, 'El código de país es obligatorio.'),
  }),
  system: z.object({
    installedCapacityKw: positiveLocalizedNumber('La potencia instalada debe ser mayor que 0'),
    performanceRatio: localizedNumber.refine((value) => value > PERFORMANCE_RATIO_RANGE.minExclusive && value <= PERFORMANCE_RATIO_RANGE.maxInclusive, {
      message: 'El performance ratio debe estar entre 0 y 1.',
    }),
    degradationRateAnnualPct: localizedNumber.refine((value) => value >= DEGRADATION_RATE_RANGE.minInclusive && value <= DEGRADATION_RATE_RANGE.maxInclusive, {
      message: 'La degradación anual debe estar entre 0 y 5%.',
    }),
    availabilityPct: localizedNumber.refine((value) => value > AVAILABILITY_RANGE.minExclusive && value <= AVAILABILITY_RANGE.maxInclusive, {
      message: 'La disponibilidad debe estar entre 0 y 100%.',
    }),
    lossesPct: z.object({
      inverter: nonNegativeLocalizedNumber('La pérdida del inversor debe ser cero o mayor.'),
      temperature: nonNegativeLocalizedNumber('La pérdida por temperatura debe ser cero o mayor.'),
      wiring: nonNegativeLocalizedNumber('La pérdida por cableado debe ser cero o mayor.'),
      soiling: nonNegativeLocalizedNumber('La pérdida por suciedad debe ser cero o mayor.'),
      other: nonNegativeLocalizedNumber('La pérdida adicional debe ser cero o mayor.'),
    }),
  }),
  demand: z.object({
    annualConsumptionKwh: positiveLocalizedNumber('El consumo anual debe ser mayor que 0'),
    monthlyConsumptionKwh: monthlyConsumptionSchema,
  }),
  economics: z.object({
    currency: z.enum(['EUR']),
    capexTotal: nonNegativeLocalizedNumber('La inversión estimada debe ser cero o mayor.'),
    opexAnnual: nonNegativeLocalizedNumber('El OPEX anual debe ser cero o mayor.'),
    electricityPurchasePricePerKwh: nonNegativeLocalizedNumber('El precio de electricidad debe ser cero o mayor.'),
    exportPricePerKwh: nonNegativeLocalizedNumber('El precio de exportación debe ser cero o mayor.'),
    discountRatePct: nonNegativeLocalizedNumber('La tasa de descuento debe ser cero o mayor.'),
    projectLifetimeYears: localizedNumber.refine((value) => value >= PROJECT_LIFETIME_MIN_YEARS, {
      message: 'La vida útil del proyecto debe ser de al menos 5 años.',
    }),
  }),
})

export const simulationCreateSchema = simulationSchema

export type SimulationFormValues = z.infer<typeof simulationSchema>
export type SimulationCreateFormInput = z.input<typeof simulationCreateSchema>
export type SimulationCreateFormValues = z.infer<typeof simulationCreateSchema>
