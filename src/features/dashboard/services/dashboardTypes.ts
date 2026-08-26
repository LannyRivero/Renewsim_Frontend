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

export type DashboardSummary = {
  totalSimulations: number
  activeSimulations: number | null
  averageRoiPercent: number | null
  medianPaybackYears: number | null
  totalEnergyGeneratedKwh: number | null
  totalCo2SavedKg: number | null
  atRiskCount: number | null
}

export type RecommendedScenario = {
  id: string
  name: string
  technology: string
  location: string
  roiPercent: number | null
  paybackYears: number | null
  capex: number | null
  estimatedAnnualSavings: number | null
  priority: string
  headline: string
  drivers: string[]
  mainRisk: string
  nextStep: string
} | null

export type PrioritizedScenario = {
  id: string
  name: string
  technology: string
  status: string
  location: string
  roiPercent: number | null
  paybackYears: number | null
  capex: number | null
  estimatedAnnualSavings: number | null
  priority: string
  score: number | null
}

export type RiskAlert = {
  type: string
  severity: string
  count: number
  message: string
}

export type StatusDistributionSlice = {
  label: string
  count: number
}

export type DashboardData = {
  summary: DashboardSummary
  stats: StatCard[]
  energyBySource: EnergySource[]
  distribution: DistributionSlice[]
  statusDistribution: StatusDistributionSlice[]
  efficiencyMetrics: EfficiencyMetric[]
  targetVsActual: TargetVsActual[]
  recommendedScenario: RecommendedScenario
  prioritizedScenarios: PrioritizedScenario[]
  riskAlerts: RiskAlert[]
}
