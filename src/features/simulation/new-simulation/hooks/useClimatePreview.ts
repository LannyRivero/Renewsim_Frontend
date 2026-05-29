import { useEffect, useState } from 'react'
import { getClimateData } from '../../services/weatherService'
import {
  DEFAULT_CLIMATE_PREVIEW,
  type ResolvedClimate,
  toClimatePreview,
} from '../helpers/climate'

const MIN_LOCATION_QUERY_LENGTH = 2
const CLIMATE_REFRESH_DEBOUNCE_MS = 450

interface UseClimatePreviewParams {
  location: string
  energyType: 'solar' | 'wind' | 'hydro'
}

export function useClimatePreview({ location, energyType }: UseClimatePreviewParams) {
  const [isRefreshingClimate, setIsRefreshingClimate] = useState(false)
  const [climatePreview, setClimatePreview] = useState(DEFAULT_CLIMATE_PREVIEW)
  const [resolvedClimate, setResolvedClimate] = useState<ResolvedClimate | null>(null)

  useEffect(() => {
    const trimmedLocation = location.trim()

    if (trimmedLocation.length < MIN_LOCATION_QUERY_LENGTH) {
      return
    }

    const timer = window.setTimeout(() => {
      setIsRefreshingClimate(true)
      getClimateData(trimmedLocation, energyType)
        .then((climate) => {
          setResolvedClimate({ location: trimmedLocation, energyType, data: climate })
          setClimatePreview(toClimatePreview(climate))
        })
        .catch(() => {
          setClimatePreview((prev) => prev)
        })
        .finally(() => {
          setIsRefreshingClimate(false)
        })
    }, CLIMATE_REFRESH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [location, energyType])

  const displayedClimatePreview = location.trim().length >= MIN_LOCATION_QUERY_LENGTH ? climatePreview : DEFAULT_CLIMATE_PREVIEW

  return {
    isRefreshingClimate,
    displayedClimatePreview,
    resolvedClimate,
    setResolvedClimate,
    setClimatePreview,
  }
}
