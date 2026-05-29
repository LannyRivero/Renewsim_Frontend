import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { simulationSchema, type SimulationFormValues } from '../../schemas/simulationSchema'
import { createSimulation } from '../../services/simulationService'
import { getClimateData } from '../../services/weatherService'
import {
  canReuseResolvedClimate,
  toClimatePreview,
  type ResolvedClimate,
} from '../helpers/climate'
import { useToastStore } from '@/stores/toastStore'

interface UseSimulationSubmissionParams {
  draft: SimulationFormValues
  climateState: {
    resolvedClimate: ResolvedClimate | null
    setResolvedClimate: (value: ResolvedClimate) => void
    setClimatePreview: (value: ReturnType<typeof toClimatePreview>) => void
  }
  simulationActions: {
    setLastResult: (result: Awaited<ReturnType<typeof createSimulation>>) => void
    setLastRunInput: (payload: Parameters<typeof createSimulation>[0]) => void
  }
}

export function useSimulationSubmission({
  draft,
  climateState,
  simulationActions,
}: UseSimulationSubmissionParams) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoadingClimate, setIsLoadingClimate] = useState(false)

  const mutation = useMutation({
    mutationFn: createSimulation,
    onSuccess: (result) => {
      simulationActions.setLastResult(result)
      useToastStore.getState().pushToast({
        title: 'Simulation Completed',
        description: 'Your simulation was created successfully.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
      navigate('/simulador/resultados')
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Simulation Error',
        description: 'Could not run simulation. Please try again.',
        variant: 'error',
      })
    },
  })

  const submitLabel = isLoadingClimate
    ? 'Fetching climate data...'
    : mutation.isPending
      ? 'Running simulation...'
      : 'Run simulation'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const parsed = simulationSchema.safeParse(draft)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid form values.'
      setFormError(firstError)
      return
    }

    setIsLoadingClimate(true)

    const normalizedLocation = parsed.data.location.trim()
    const canReuseClimate = canReuseResolvedClimate(
      climateState.resolvedClimate,
      normalizedLocation,
      parsed.data.energyType,
    )

    const climatePromise = canReuseClimate
      ? Promise.resolve(climateState.resolvedClimate!.data)
      : getClimateData(normalizedLocation, parsed.data.energyType)

    climatePromise
      .then((climate) => {
        climateState.setClimatePreview(toClimatePreview(climate))
        climateState.setResolvedClimate({
          location: normalizedLocation,
          energyType: parsed.data.energyType,
          data: climate,
        })

        mutation.mutate({
          ...parsed.data,
          climate,
        })

        simulationActions.setLastRunInput({
          ...parsed.data,
          climate,
        })
      })
      .catch((error) => {
        const description =
          error instanceof Error ? error.message : 'Could not fetch climate data. Please try again.'

        setFormError(description)
        useToastStore.getState().pushToast({
          title: 'Climate Data Error',
          description,
          variant: 'error',
        })
      })
      .finally(() => {
        setIsLoadingClimate(false)
      })
  }

  return {
    formError,
    isSubmitting: mutation.isPending || isLoadingClimate,
    submitLabel,
    handleSubmit,
  }
}
