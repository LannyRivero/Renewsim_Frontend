import type { SimulationDetails } from '../schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

export type EffectiveSimulationResult = SimulationResult & Partial<SimulationDetails>

export type DetailMetric = {
  label: string
  value: string
  helper?: string
}

export type DetailSectionContent = {
  sectionLabel: string
  title: string
  summary?: string
  primaryMetrics: DetailMetric[]
  supportingMetrics?: DetailMetric[]
}

export type DetailPlaceholderContent = {
  sectionLabel: string
  title: string
  description: string
}

export type DetailChartDatum = {
  label: string
  value: number
  tone: 'capital' | 'budget' | 'revenue' | 'net'
}

export type SimulationDetailsViewModel = {
  effectiveResult: EffectiveSimulationResult | null
  location: string
  energyType: string
  displayTitle: string
  simulationName: string
  date: string
  roi: string
  efficiency: string
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  decisionDrivers: string[]
  capex: string
  opex: string
  revenue: string
  paybackYears: string
  npv: string
  irr: string
  energyGenerated: string
  averageTemperature: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  climateSource: string
  climatePeriod: string
  summarySection: DetailSectionContent
  summarySnapshotSection: DetailSectionContent
  financialSection: DetailSectionContent
  financialChart: DetailChartDatum[]
  financialPendingPlaceholder: DetailPlaceholderContent
  climateSection: DetailSectionContent
  comparisonSection: DetailSectionContent
  comparisonPlaceholder: DetailPlaceholderContent
}

export type DecisionSummary = {
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  decisionDrivers: string[]
  mainSignal: string
  mainRisk: string
  nextAction: string
}
