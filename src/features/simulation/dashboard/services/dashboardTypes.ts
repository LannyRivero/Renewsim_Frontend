export type StatCard = {
  label: string
  value: string
  icon: string
}

export type EnergySource = {
  label: string
  kwh: number
}

export type DistributionSlice = {
  label: string
  kwh: number
}

export type EfficiencyMetric = {
  label: string
  value: string
  hint: string
}

export type TargetVsActual = {
  label: string
  actual: number
  target: number
  unit: string
}

export type DashboardData = {
  stats: StatCard[]
  energyBySource: EnergySource[]
  distribution: DistributionSlice[]
  efficiencyMetrics: EfficiencyMetric[]
  targetVsActual: TargetVsActual[]
}
