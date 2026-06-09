import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { simulationCreateSchema, type SimulationCreateFormValues } from '../../schemas/simulationSchema'
import {
  createSimulation,
  getSimulationById,
  getSimulationHistory,
} from '../../services/simulationService'
import { useToastStore } from '@/stores/toastStore'

interface UseSimulationSubmissionParams {
  simulationActions: {
    setLastResult: (result: Awaited<ReturnType<typeof createSimulation>>) => void
    setLastRunInput: (payload: SimulationCreateFormValues) => void
  }
}

export function useSimulationSubmission({
  simulationActions,
}: UseSimulationSubmissionParams) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createSimulation,
    onSuccess: async (result) => {
      await queryClient.fetchQuery({
        queryKey: ['simulation-details', result.id],
        queryFn: () => getSimulationById(result.id),
      })

      await queryClient.fetchQuery({
        queryKey: ['simulation-history'],
        queryFn: getSimulationHistory,
      })

      simulationActions.setLastResult(result)
      useToastStore.getState().pushToast({
        title: 'Simulación completada',
        description: 'La simulación se creó correctamente.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
      navigate(`/simulador/resultados?id=${encodeURIComponent(result.id)}`)
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Error de simulación',
        description: 'No se pudo ejecutar la simulación. Intentá nuevamente.',
        variant: 'error',
      })
    },
  })

  const submitLabel = mutation.isPending ? 'Ejecutando simulación...' : 'Ejecutar simulación'

  function handleSubmit(draft: SimulationCreateFormValues, event?: Pick<React.FormEvent<HTMLFormElement>, 'preventDefault'>) {
    event?.preventDefault()
    setFormError(null)

    const parsed = simulationCreateSchema.safeParse(draft)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid form values.'
      setFormError(firstError)
      return
    }

    const normalizedLocation = parsed.data.location.trim()
    const payload = {
      name: `${parsed.data.energyType.toUpperCase()} - ${normalizedLocation}`,
      technology: parsed.data.energyType,
      installedCapacity: parsed.data.projectSize,
      location: {
        lat: parsed.data.locationLatitude,
        lon: parsed.data.locationLongitude,
      },
    } as const

    simulationActions.setLastRunInput(parsed.data)
    mutation.mutate(payload)
  }

  return {
    formError,
    isSubmitting: mutation.isPending,
    submitLabel,
    handleSubmit,
  }
}
