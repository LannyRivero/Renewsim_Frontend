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
  { label: 'Simulaciones Totales', value: '125', icon: 'insights' },
  { label: 'CO₂ Ahorrado', value: '5,000 kg', icon: 'eco' },
  { label: 'Promedio de ROI', value: '15%', icon: 'trending_up' },
  { label: 'Energía Generada', value: '25,000 kWh', icon: 'bolt' },
]

export const ENERGY_BY_SOURCE: EnergySource[] = [
  { label: 'Solar', kwh: 4000 },
  { label: 'Eólica', kwh: 3000 },
  { label: 'Hidroeléctrica', kwh: 5000 },
  { label: 'Biomasa', kwh: 8000 },
]

export const DISTRIBUTION: DistributionSlice[] = [
  { label: 'Solar', kwh: 4000 },
  { label: 'Eólica', kwh: 3000 },
  { label: 'Hidroeléctrica', kwh: 5000 },
  { label: 'Biomasa', kwh: 8000 },
]
