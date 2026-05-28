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

export const DASHBOARD_STATS: StatCard[] = [
  { label: 'Total Simulations', value: '125', icon: 'insights' },
  { label: 'CO2 Saved', value: '5,000 kg', icon: 'eco' },
  { label: 'Average ROI', value: '15%', icon: 'trending_up' },
  { label: 'Energy Generated', value: '25,000 kWh', icon: 'bolt' },
]

export const ENERGY_BY_SOURCE: EnergySource[] = [
  { label: 'Solar', kwh: 4000 },
  { label: 'Wind', kwh: 3000 },
  { label: 'Hydroelectric', kwh: 5000 },
  { label: 'Biomasa', kwh: 8000 },
]

export const DISTRIBUTION: DistributionSlice[] = [
  { label: 'Solar', kwh: 4000 },
  { label: 'Wind', kwh: 3000 },
  { label: 'Hydroelectric', kwh: 5000 },
  { label: 'Biomasa', kwh: 8000 },
]
