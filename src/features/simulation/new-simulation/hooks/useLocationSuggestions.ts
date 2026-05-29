import { useEffect, useState } from 'react'
import { searchLocations } from '../../services/weatherService'

const MIN_LOCATION_QUERY_LENGTH = 2
const LOCATION_SEARCH_DEBOUNCE_MS = 300

export function useLocationSuggestions(location: string) {
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [locationSearchMessage, setLocationSearchMessage] = useState<string | null>(null)

  const hasLocationQuery = location.trim().length >= MIN_LOCATION_QUERY_LENGTH

  useEffect(() => {
    const currentQuery = location.trim()

    if (currentQuery.length < MIN_LOCATION_QUERY_LENGTH) {
      return
    }

    const timer = window.setTimeout(() => {
      setIsSearchingLocation(true)
      setLocationSearchMessage(null)
      searchLocations(currentQuery)
        .then((suggestions) => {
          const labels = suggestions.map((item) => item.label)
          setLocationSuggestions(labels)

          if (labels.length === 0) {
            setLocationSearchMessage('No locations found. Try a more specific city name.')
          }
        })
        .catch((error) => {
          setLocationSuggestions([])
          const message = error instanceof Error ? error.message : 'Could not search locations right now.'
          setLocationSearchMessage(message)
        })
        .finally(() => {
          setIsSearchingLocation(false)
        })
    }, LOCATION_SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [location])

  return {
    hasLocationQuery,
    isSearchingLocation,
    locationSearchMessage: hasLocationQuery ? locationSearchMessage : null,
    locationSuggestions: hasLocationQuery ? locationSuggestions : [],
    clearLocationSuggestions: () => setLocationSuggestions([]),
  }
}
