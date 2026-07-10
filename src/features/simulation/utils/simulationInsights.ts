import type { SimulationCreateFormValues, SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

type SupportedEnergyType = 'solar' | 'wind' | 'hydro'

type ClimateProfile = {
  solarIrradiance: number
  windSpeed: number
  hydrologyFlow: number
}

type InsightMetrics = {
  energyGeneratedKwh: number
  roiPercent: number
  efficiencyPercent: number
  paybackYears: number
  co2AvoidedTons: number
  recommendedTechnology: string
}

const ENERGY_FACTOR = {
  solar: 0.19,
  wind: 0.31,
  hydro: 0.42,
} as const satisfies Record<SupportedEnergyType, number>

const DEFAULT_PROJECT_SIZE_KW = 500

const DEFAULT_CLIMATE = {
  solarIrradiance: 4.5,
  windSpeed: 6,
  hydrologyFlow: 2.5,
} as const

const CLIMATE_BASELINE = {
  solar: 5,
  wind: 7,
  hydro: 3,
} as const satisfies Record<SupportedEnergyType, number>

const GENERATION_BASE_KWH_PER_KW_PER_MONTH = 32
const MONTHS_PER_YEAR = 12
const GRID_CO2_TONS_PER_KWH = 0.00038

const EFFICIENCY_MODEL = {
  capPercent: 97,
  basePercent: 72,
  climateWeight: 18,
  technologyWeight: 10,
} as const

const ROI_MODEL = {
  basePercent: 6,
  climateWeight: 6,
  technologyWeight: 18,
} as const

const PAYBACK_MODEL = {
  minimumYears: 3,
  baseYears: 16,
  roiDivisor: 2,
} as const

const TECHNOLOGY_LABELS = {
  solar: 'Solar Power',
  wind: 'Wind Turbine',
  hydro: 'Hydroelectric Plant',
} as const satisfies Record<SupportedEnergyType, string>

function toFixedNumber(value: number, digits = 1) {
  return Number(value.toFixed(digits))
}

function resolveClimateMultiplier(energyType: SupportedEnergyType, climate: ClimateProfile) {
  if (energyType === 'solar') {
    return climate.solarIrradiance / CLIMATE_BASELINE.solar
  }

  if (energyType === 'wind') {
    return climate.windSpeed / CLIMATE_BASELINE.wind
  }

  return climate.hydrologyFlow / CLIMATE_BASELINE.hydro
}

function estimateEfficiencyPercent(energyType: SupportedEnergyType, climateMultiplier: number) {
  const rawEfficiency =
    EFFICIENCY_MODEL.basePercent +
    climateMultiplier * EFFICIENCY_MODEL.climateWeight +
    ENERGY_FACTOR[energyType] * EFFICIENCY_MODEL.technologyWeight

  return toFixedNumber(Math.min(EFFICIENCY_MODEL.capPercent, rawEfficiency))
}

function estimateRoiPercent(energyType: SupportedEnergyType, climateMultiplier: number) {
  return toFixedNumber(
    ROI_MODEL.basePercent +
      climateMultiplier * ROI_MODEL.climateWeight +
      ENERGY_FACTOR[energyType] * ROI_MODEL.technologyWeight,
  )
}

function estimatePaybackYears(roiPercent: number) {
  return toFixedNumber(
    Math.max(PAYBACK_MODEL.minimumYears, PAYBACK_MODEL.baseYears - roiPercent / PAYBACK_MODEL.roiDivisor),
  )
}

function estimateCo2AvoidedTons(energyGeneratedKwh: number) {
  return toFixedNumber(energyGeneratedKwh * GRID_CO2_TONS_PER_KWH)
}

export function buildSimulationInsights(
  input: SimulationCreateFormValues | null,
  result: (SimulationResult & Partial<SimulationDetails>) | null,
): InsightMetrics {
  const projectSize = input?.system.installedCapacityKw ?? result?.projectSize ?? DEFAULT_PROJECT_SIZE_KW
  const climate = {
    solarIrradiance: result?.irradiance ?? DEFAULT_CLIMATE.solarIrradiance,
    windSpeed: result?.windSpeed ?? DEFAULT_CLIMATE.windSpeed,
    hydrologyFlow: result?.hydrology ?? DEFAULT_CLIMATE.hydrologyFlow,
  }
  const energyType = (input?.technology ?? result?.energyType ?? 'solar') as SupportedEnergyType

  const climateMultiplier = resolveClimateMultiplier(energyType, climate)
  const baseGeneration = projectSize * GENERATION_BASE_KWH_PER_KW_PER_MONTH
  const energyGeneratedKwh = Math.round(baseGeneration * ENERGY_FACTOR[energyType] * climateMultiplier * MONTHS_PER_YEAR)

  const efficiencyPercent =
    typeof result?.efficiency === 'number'
      ? toFixedNumber(result.efficiency)
      : estimateEfficiencyPercent(energyType, climateMultiplier)

  const roiPercent =
    typeof result?.roi === 'number'
      ? toFixedNumber(result.roi)
      : estimateRoiPercent(energyType, climateMultiplier)

  const paybackYears = estimatePaybackYears(roiPercent)
  const co2AvoidedTons = estimateCo2AvoidedTons(energyGeneratedKwh)

  return {
    energyGeneratedKwh,
    roiPercent,
    efficiencyPercent,
    paybackYears,
    co2AvoidedTons,
    recommendedTechnology: TECHNOLOGY_LABELS[energyType],
  }
}
