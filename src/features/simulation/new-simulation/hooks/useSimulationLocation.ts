import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { UseFormReturn } from 'react-hook-form'
import { searchLocations, type ResolvedLocation } from '../../services/simulationService'
import { useBrowserLocationResolution } from '../../hooks/useBrowserLocationResolution'
import {
  DEFAULT_SIMULATION_FORM_VALUES,
  type SimulationCreateFormInput,
  type SimulationCreateFormValues,
} from '../../schemas/simulationSchema'

export type SimulationCreateFormController = UseFormReturn<
  SimulationCreateFormInput,
  undefined,
  SimulationCreateFormValues
>

interface UseSimulationLocationParams {
  form: SimulationCreateFormController
}

export function useSimulationLocation({ form }: UseSimulationLocationParams) {
  const [debouncedLocationQuery, setDebouncedLocationQuery] = useState('')
  const skipNextSearchRef = useRef(false)

  const watchedLocationSearch = form.watch('locationSearch')
  const watchedResolvedLocationLabel = form.watch('location.label')
  const normalizedLocation = useMemo(() => watchedLocationSearch.trim(), [watchedLocationSearch])
  const normalizedResolvedLocationLabel = useMemo(
    () => watchedResolvedLocationLabel.trim(),
    [watchedResolvedLocationLabel],
  )

  function clearResolvedLocation() {
    form.setValue('location', { ...DEFAULT_SIMULATION_FORM_VALUES.location }, { shouldValidate: true, shouldDirty: true })
  }

  const {
    isResolvingBrowserLocation,
    locationAssistMessage,
    clearLocationAssistMessage,
    startBrowserLocationResolution,
  } = useBrowserLocationResolution({
    onResolved: (resolvedLocation, { latitude, longitude }) => {
      skipNextSearchRef.current = true
      form.setValue('locationSearch', resolvedLocation.label, { shouldValidate: true, shouldDirty: true })
      form.setValue('location', {
        label: resolvedLocation.label,
        lat: latitude,
        lon: longitude,
        country: resolvedLocation.country,
        countryCode: resolvedLocation.countryCode,
      }, { shouldValidate: true, shouldDirty: true })
    },
  })

  const locationSuggestionsQuery = useQuery({
    queryKey: ['simulation-location-suggestions', debouncedLocationQuery],
    queryFn: () => searchLocations(debouncedLocationQuery),
    enabled: debouncedLocationQuery.length >= 2,
    staleTime: 60_000,
  })

  useEffect(() => {
    const nextQuery = normalizedLocation.length >= 2 ? normalizedLocation : ''
    const delayMs = nextQuery.length >= 2 ? 350 : 0

    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false
      setDebouncedLocationQuery('')
      return
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedLocationQuery(nextQuery)
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [normalizedLocation])

  function applyLocationSuggestion(suggestion: ResolvedLocation) {
    skipNextSearchRef.current = true
    form.setValue('locationSearch', suggestion.label, { shouldValidate: true, shouldDirty: true })
    form.setValue('location', {
      label: suggestion.label,
      lat: suggestion.lat,
      lon: suggestion.lon,
      country: suggestion.country,
      countryCode: suggestion.countryCode,
    }, { shouldValidate: true, shouldDirty: true })
  }

  function handleLocationSearchChange(nextValue: string) {
    if (locationAssistMessage) {
      clearLocationAssistMessage()
    }

    if (normalizedResolvedLocationLabel.length === 0) {
      return
    }

    if (nextValue.trim() === normalizedResolvedLocationLabel) {
      return
    }

    clearResolvedLocation()
  }

  return {
    isResolvingBrowserLocation,
    isSearchingLocation: locationSuggestionsQuery.isFetching,
    shouldShowSearchingMessage: normalizedLocation.length >= 2 && locationSuggestionsQuery.isFetching,
    locationAssistMessage,
    locationSuggestions: locationSuggestionsQuery.data ?? [],
    startBrowserLocationResolution,
    applyLocationSuggestion,
    handleLocationSearchChange,
  }
}
