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

export interface SearchLocationsResponse extends Array<LocationCandidate> {}

export type ReverseLocationResponse = ResolvedLocation
