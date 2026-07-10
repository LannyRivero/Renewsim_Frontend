export type CurrencyCode = 'EUR'

export type SimulationTechnology = 'solar' | 'wind' | 'hydro'

export type SimulationRunStatus = 'draft' | 'processing' | 'completed' | 'failed'

export type RecommendationStatus = 'recommended' | 'viable_with_reservations' | 'not_recommended'

export type WarningSeverity = 'info' | 'warning' | 'critical'

export type MonthlySeries = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

export interface SimulationSystemLosses {
  inverter: number
  temperature: number
  wiring: number
  soiling: number
  other: number
}
