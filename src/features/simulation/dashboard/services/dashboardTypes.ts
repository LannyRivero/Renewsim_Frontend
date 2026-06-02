import type {
  DistributionSlice,
  EfficiencyMetric,
  EnergySource,
  StatCard,
  TargetVsActual,
} from '../data/dashboardMock'

export type DashboardData = {
  stats: StatCard[]
  energyBySource: EnergySource[]
  distribution: DistributionSlice[]
  efficiencyMetrics: EfficiencyMetric[]
  targetVsActual: TargetVsActual[]
}

export type DashboardDomainModel = {
  totalSimulations: number
  totalKwh: number
  co2SavedKg: number
  avgRoi: number
  avgEfficiency: number
  energyBySource: EnergySource[]
}
