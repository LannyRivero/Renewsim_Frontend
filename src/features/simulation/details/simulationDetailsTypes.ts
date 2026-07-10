import type { SimulationDetails } from '../schemas/simulationSchema'
import type {  SimulationResult } from '@/shared/types'

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
  location: string
  energyType: string
  simulationName: string
  date: string
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  decisionDrivers: string[]
  summarySection: DetailSectionContent
  summarySnapshotSection: DetailSectionContent
  financialSection: DetailSectionContent
  climateSection: DetailSectionContent
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
