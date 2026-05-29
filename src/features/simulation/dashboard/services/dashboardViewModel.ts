import { formatCurrency, formatKg, formatKwh, formatPercent } from './dashboardFormatters'
import type { DashboardData, DashboardDomainModel } from './dashboardTypes'

const ENERGY_OUTPUT_TARGET_FACTOR = 1.1
const CO2_REDUCTION_TARGET_FACTOR = 1.08
const ROI_TARGET_INCREMENT = 1

export function toDashboardViewModel(domain: DashboardDomainModel): DashboardData {
  return {
    stats: [
      { label: 'Total Simulations', value: String(domain.totalSimulations), icon: 'insights' },
      { label: 'CO2 Saved', value: formatKg(domain.co2SavedKg), icon: 'eco' },
      { label: 'Average ROI', value: formatPercent(domain.avgRoi), icon: 'trending_up' },
      { label: 'Energy Generated', value: formatKwh(domain.totalKwh), icon: 'bolt' },
    ],
    energyBySource: domain.energyBySource,
    distribution: domain.energyBySource,
    efficiencyMetrics: [
      { label: 'Capacity factor', value: formatPercent(domain.avgEfficiency), hint: 'Plant utilization over period' },
      { label: 'Cost per kWh', value: formatCurrency(0.073, 3), hint: 'Blended production cost' },
      { label: 'Grid availability', value: formatPercent(99.2), hint: 'Operational uptime' },
    ],
    targetVsActual: [
      { label: 'Energy output', actual: domain.totalKwh, target: Math.round(domain.totalKwh * ENERGY_OUTPUT_TARGET_FACTOR), unit: 'kWh' },
      { label: 'CO2 reduction', actual: domain.co2SavedKg, target: Math.round(domain.co2SavedKg * CO2_REDUCTION_TARGET_FACTOR), unit: 'kg' },
      { label: 'ROI', actual: Number(domain.avgRoi.toFixed(1)), target: Number((domain.avgRoi + ROI_TARGET_INCREMENT).toFixed(1)), unit: '%' },
    ],
  }
}

export function toZeroDashboardViewModel(): DashboardData {
  return {
    stats: [
      { label: 'Total Simulations', value: '0', icon: 'insights' },
      { label: 'CO2 Saved', value: formatKg(0), icon: 'eco' },
      { label: 'Average ROI', value: formatPercent(0, 0), icon: 'trending_up' },
      { label: 'Energy Generated', value: formatKwh(0), icon: 'bolt' },
    ],
    energyBySource: [],
    distribution: [],
    efficiencyMetrics: [
      { label: 'Capacity factor', value: formatPercent(0, 0), hint: 'Plant utilization over period' },
      { label: 'Cost per kWh', value: formatCurrency(0, 3), hint: 'Blended production cost' },
      { label: 'Grid availability', value: formatPercent(0, 0), hint: 'Operational uptime' },
    ],
    targetVsActual: [
      { label: 'Energy output', actual: 0, target: 0, unit: 'kWh' },
      { label: 'CO2 reduction', actual: 0, target: 0, unit: 'kg' },
      { label: 'ROI', actual: 0, target: 0, unit: '%' },
    ],
  }
}
