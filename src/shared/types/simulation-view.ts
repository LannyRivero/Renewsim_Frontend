export interface SimulationHistoryItem {
  id: string
  name: string
  status: string
  location: string
  createdAt?: string
  date: string
  energyType: string
  efficiency: string
  roi: string
}

export interface SimulationResult {
  id: string
  name?: string
  status?: string
  createdAt?: string
  location?: string
  energyType?: string
  roi?: number
  efficiency?: number
}
