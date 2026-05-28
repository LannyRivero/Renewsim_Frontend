export interface TechnologyItem {
  id: string
  name: string
  energyType: string
  efficiency: number
  co2Reduction: number
  installationCost: number
  maintenanceCost: number
  environmentalImpact: number
}

export interface CreateTechnologyPayload {
  name: string
  energyType: string
  efficiency: number
  co2Reduction: number
  installationCost: number
  maintenanceCost: number
  environmentalImpact: number
}
