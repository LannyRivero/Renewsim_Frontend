export interface StatCard {
  label: string
  value: string
  icon: string
}

export interface EnergySource {
  label: string
  kwh: number
}

export interface DistributionSlice {
  label: string
  kwh: number
}

export interface EfficiencyMetric {
  label: string
  value: string
  hint: string
}

export interface TargetVsActual {
  label: string
  actual: number
  target: number
  unit: string
}

const BASE_SOURCE_DISTRIBUTION = [
  { label: 'Solar', kwh: 4000 },
  { label: 'Wind', kwh: 3000 },
  { label: 'Hydroelectric', kwh: 5000 },
  { label: 'Biomasa', kwh: 8000 },
] as const

export const DASHBOARD_STATS: StatCard[] = [
  { label: 'Total Simulations', value: '125', icon: 'insights' },
  { label: 'CO2 Saved', value: '5,000 kg', icon: 'eco' },
  { label: 'Average ROI', value: '15%', icon: 'trending_up' },
  { label: 'Energy Generated', value: '25,000 kWh', icon: 'bolt' },
]

export const ENERGY_BY_SOURCE: EnergySource[] = BASE_SOURCE_DISTRIBUTION.map((item) => ({ ...item }))

export const DISTRIBUTION: DistributionSlice[] = BASE_SOURCE_DISTRIBUTION.map((item) => ({ ...item }))

export const EFFICIENCY_METRICS: EfficiencyMetric[] = [
  { label: 'Capacity factor', value: '82.4%', hint: 'Plant utilization over period' },
  { label: 'Cost per kWh', value: '$0.073', hint: 'Blended production cost' },
  { label: 'Grid availability', value: '99.2%', hint: 'Operational uptime' },
]

export const TARGET_VS_ACTUAL: TargetVsActual[] = [
  { label: 'Energy output', actual: 20000, target: 22000, unit: 'kWh' },
  { label: 'CO2 reduction', actual: 4800, target: 5000, unit: 'kg' },
  { label: 'ROI', actual: 15, target: 16, unit: '%' },
]
