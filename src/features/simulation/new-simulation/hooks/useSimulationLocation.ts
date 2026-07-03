import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { UseFormReturn } from 'react-hook-form'
import { resolveLocation, searchLocations, type ResolvedLocation } from '../../services/simulationService'
import type { SimulationCreateFormInput, SimulationCreateFormValues } from '../../schemas/simulationSchema'

export type SimulationCreateFormController = UseFormReturn<
  SimulationCreateFormInput,
  undefined,
  SimulationCreateFormValues
>

interface UseSimulationLocationParams {
  form: SimulationCreateFormController
}

export function useSimulationLocation({ form }: UseSimulationLocationParams) {
  const [isResolvingBrowserLocation, setIsResolvingBrowserLocation] = useState(false)
  const [locationAssistMessage, setLocationAssistMessage] = useState<string | null>(null)
  const [debouncedLocationQuery, setDebouncedLocationQuery] = useState('')
  const skipNextSearchRef = useRef(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const watchedLocationSearch = form.watch('locationSearch')
  const normalizedLocation = useMemo(() => watchedLocationSearch.trim(), [watchedLocationSearch])

  const locationResolution = useMutation({
    mutationFn: ({ latitude, longitude }: { latitude: number; longitude: number }) =>
      resolveLocation(latitude, longitude),
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

  function startBrowserLocationResolution() {
    if (!navigator.geolocation) {
      setLocationAssistMessage('Tu navegador no permite acceder a la geolocalización.')
      return
    }

    setLocationAssistMessage(null)
    setIsResolvingBrowserLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        if (!isMountedRef.current) return

        const latitude = Number(position.coords.latitude.toFixed(6))
        const longitude = Number(position.coords.longitude.toFixed(6))

        try {
          const resolvedLocation = await locationResolution.mutateAsync({ latitude, longitude })

          if (!isMountedRef.current) return

          skipNextSearchRef.current = true
          form.setValue('locationSearch', resolvedLocation.label, { shouldValidate: true, shouldDirty: true })
          form.setValue('location', {
            label: resolvedLocation.label,
            lat: latitude,
            lon: longitude,
            country: resolvedLocation.country,
            countryCode: resolvedLocation.countryCode,
          }, { shouldValidate: true, shouldDirty: true })
          setLocationAssistMessage(`Ubicación actual cargada: ${resolvedLocation.label}.`)
        } catch {
          if (isMountedRef.current) {
            setLocationAssistMessage('Se cargaron las coordenadas, pero no se pudo resolver el nombre de la ubicación.')
          }
        } finally {
          if (isMountedRef.current) {
            setIsResolvingBrowserLocation(false)
          }
        }
      },
      (error) => {
        if (!isMountedRef.current) return

        const message =
          error.code === error.PERMISSION_DENIED
            ? 'El navegador bloqueó el acceso a tu ubicación. Permitilo e intentá otra vez.'
            : error.code === error.TIMEOUT
              ? 'No se pudo obtener tu ubicación a tiempo. Intentá nuevamente.'
              : 'No se pudo resolver tu ubicación actual.'
        setLocationAssistMessage(message)
        setIsResolvingBrowserLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }

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

  return {
    isResolvingBrowserLocation,
    isSearchingLocation: locationSuggestionsQuery.isFetching,
    shouldShowSearchingMessage: normalizedLocation.length >= 2 && locationSuggestionsQuery.isFetching,
    locationAssistMessage,
    locationSuggestions: locationSuggestionsQuery.data ?? [],
    startBrowserLocationResolution,
    applyLocationSuggestion,
  }
}
