export interface SimulationHistoryItem {
  id: string
  date: string
  energyType: string
  efficiency: string
  roi: string
}

export interface CreateSimulationPayload {
  location: string
  energyType: 'solar' | 'wind' | 'hydro'
  projectSize: number
  budget: number
  energyConsumption: number
  locationLatitude?: number
  locationLongitude?: number
  climate: {
    irradiance: number
    windSpeed: number
    hydrology: number
  }
}

export interface SimulationResult {
  id: string
  location: string
  energyType: string
  roi?: number
  efficiency?: number
}
