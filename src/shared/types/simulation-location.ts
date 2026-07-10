export interface LocationCandidate {
  name: string
  adminRegion?: string
  country: string
  countryCode: string
  lat: number
  lon: number
  displayLabel: string
}

export interface ResolvedLocation {
  label: string
  name: string
  adminRegion?: string
  country: string
  countryCode: string
  lat: number
  lon: number
  timezone?: string
}

export type SearchLocationsResponse = LocationCandidate[]

export type ReverseLocationResponse = ResolvedLocation
