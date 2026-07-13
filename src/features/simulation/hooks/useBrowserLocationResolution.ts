import { useEffect, useRef, useState } from 'react'
import { resolveLocation, type ResolvedLocation } from '../services/simulationService'

interface UseBrowserLocationResolutionParams {
  onResolved: (resolvedLocation: ResolvedLocation, coords: { latitude: number; longitude: number }) => void | Promise<void>
}

export function useBrowserLocationResolution({ onResolved }: UseBrowserLocationResolutionParams) {
  const [isResolvingBrowserLocation, setIsResolvingBrowserLocation] = useState(false)
  const [locationAssistMessage, setLocationAssistMessage] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  function clearLocationAssistMessage() {
    setLocationAssistMessage(null)
  }

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
          const resolvedLocation = await resolveLocation(latitude, longitude)
          if (!isMountedRef.current) return

          await onResolved(resolvedLocation, { latitude, longitude })
          if (!isMountedRef.current) return

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
            ? 'El navegador bloqueó el acceso a tu ubicación. Dale permiso e intentá otra vez.'
            : error.code === error.TIMEOUT
              ? 'No se pudo obtener tu ubicación a tiempo. Intentá nuevamente.'
              : 'No se pudo resolver tu ubicación actual.'
        setLocationAssistMessage(message)
        setIsResolvingBrowserLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }

  return {
    isResolvingBrowserLocation,
    locationAssistMessage,
    clearLocationAssistMessage,
    startBrowserLocationResolution,
  }
}
