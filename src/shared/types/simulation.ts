export interface SimulationHistoryItem {
  id: string
  date: string
  energyType: string
  efficiency: string
  roi: string
}

export interface CreateSimulationPayload {
  name: string
  technology: 'solar' | 'wind' | 'hydro'
  installedCapacity: number
  location: {
    lat: number
    lon: number
  }
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
