const COUNTRY_FALLBACKS: Record<string, string> = {
  ES: 'Spain',
  AR: 'Argentina',
  MX: 'Mexico',
  US: 'United States',
  CU: 'Cuba',
}

let regionDisplayNames: Intl.DisplayNames | null = null

function getRegionDisplayNames() {
  if (typeof Intl === 'undefined' || typeof Intl.DisplayNames === 'undefined') {
    return null
  }

  if (!regionDisplayNames) {
    regionDisplayNames = new Intl.DisplayNames(['en'], { type: 'region' })
  }

  return regionDisplayNames
}

export function resolveCountryName(country: string, countryCode: string) {
  const trimmedCountry = country.trim()
  const normalizedCode = countryCode.trim().toUpperCase()

  if (trimmedCountry && trimmedCountry.length > 2) {
    return trimmedCountry
  }

  if (!normalizedCode) {
    return trimmedCountry
  }

  const displayName = getRegionDisplayNames()?.of(normalizedCode)
  if (displayName) {
    return displayName
  }

  return COUNTRY_FALLBACKS[normalizedCode] ?? trimmedCountry
}
