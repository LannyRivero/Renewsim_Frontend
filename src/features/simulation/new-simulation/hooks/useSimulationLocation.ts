import { useEffect, useRef, useState } from 'react'
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
  const skipNextLocationSearchRef = useRef(false)

  const watchedLocation = form.watch('location')
  const watchedLatitude = form.watch('locationLatitude')
  const watchedLongitude = form.watch('locationLongitude')
  const normalizedLocation = watchedLocation.trim()
  const hasResolvedLocation = normalizedLocation.length >= 2
  const latitudePreview = typeof watchedLatitude === 'number' ? watchedLatitude.toFixed(4) : 'N/A'
  const longitudePreview = typeof watchedLongitude === 'number' ? watchedLongitude.toFixed(4) : 'N/A'

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

    if (skipNextLocationSearchRef.current) {
      skipNextLocationSearchRef.current = false
      const timeoutId = window.setTimeout(() => {
        setDebouncedLocationQuery('')
      }, 0)

      return () => window.clearTimeout(timeoutId)
    }

    const timeoutId = window.setTimeout(() => {
      setDebouncedLocationQuery(nextQuery)
    }, delayMs)

    return () => window.clearTimeout(timeoutId)
  }, [normalizedLocation])

  function useBrowserLocation() {
    if (!navigator.geolocation) {
      setLocationAssistMessage('Tu navegador no permite acceder a la geolocalización.')
      return
    }

    setLocationAssistMessage(null)
    setIsResolvingBrowserLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = Number(position.coords.latitude.toFixed(6))
          const longitude = Number(position.coords.longitude.toFixed(6))

          form.setValue('locationLatitude', latitude, { shouldValidate: true, shouldDirty: true })
          form.setValue('locationLongitude', longitude, { shouldValidate: true, shouldDirty: true })

          const resolvedLocation = await locationResolution.mutateAsync({ latitude, longitude })
          skipNextLocationSearchRef.current = true
          form.setValue('location', `${resolvedLocation.name}, ${resolvedLocation.country}`, {
            shouldValidate: true,
            shouldDirty: true,
          })
          setLocationAssistMessage(`Ubicación actual cargada: ${resolvedLocation.name}, ${resolvedLocation.country}.`)
        } catch {
          setLocationAssistMessage('Se cargaron las coordenadas, pero no se pudo resolver el nombre de la ubicación.')
        } finally {
          setIsResolvingBrowserLocation(false)
        }
      },
      (error) => {
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
    skipNextLocationSearchRef.current = true
    form.setValue('location', `${suggestion.name}, ${suggestion.country}`, { shouldValidate: true, shouldDirty: true })
    form.setValue('locationLatitude', suggestion.lat, { shouldValidate: true, shouldDirty: true })
    form.setValue('locationLongitude', suggestion.lon, { shouldValidate: true, shouldDirty: true })
  }

  return {
    isResolvingBrowserLocation,
    isSearchingLocation: locationSuggestionsQuery.isFetching,
    locationAssistMessage,
    locationSuggestions: locationSuggestionsQuery.data ?? [],
    normalizedLocation,
    hasResolvedLocation,
    latitudePreview,
    longitudePreview,
    useBrowserLocation,
    applyLocationSuggestion,
  }
}
