import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { simulationCreateSchema, type SimulationCreateFormValues } from '../../schemas/simulationSchema'
import { createRealSimulation } from '../../services/simulationService'
import { useToastStore } from '@/stores/toastStore'
import type { MonthlySeries, RealCreateSimulationRequest, SimulationResult } from '@/shared/types'

function buildMonthlyConsumptionKwh(annualConsumptionKwh: number): MonthlySeries {
  const monthlyBase = Number((annualConsumptionKwh / 12).toFixed(2))
  const values = Array.from({ length: 12 }, () => monthlyBase)
  const partialTotal = Number((monthlyBase * 11).toFixed(2))
  values[11] = Number((annualConsumptionKwh - partialTotal).toFixed(2))

  return values as MonthlySeries
}

function hasMeaningfulMonthlyConsumption(monthlyConsumptionKwh: MonthlySeries): boolean {
  return monthlyConsumptionKwh.some((value) => value > 0)
}

function buildRealSimulationPayload(draft: SimulationCreateFormValues): RealCreateSimulationRequest {
  return {
    name: draft.name.trim(),
    technology: draft.technology,
    location: {
      ...draft.location,
    },
    system: {
      ...draft.system,
    },
    demand: {
      annualConsumptionKwh: draft.demand.annualConsumptionKwh,
      monthlyConsumptionKwh: hasMeaningfulMonthlyConsumption(draft.demand.monthlyConsumptionKwh as MonthlySeries)
        ? (draft.demand.monthlyConsumptionKwh as MonthlySeries)
        : buildMonthlyConsumptionKwh(draft.demand.annualConsumptionKwh),
    },
    economics: {
      ...draft.economics,
    },
  }
}

function toStoredSimulationResult(result: Awaited<ReturnType<typeof createRealSimulation>>): SimulationResult {
  return {
    id: result.id,
    name: result.input.name,
    status: result.status,
    createdAt: result.createdAt,
    location: result.location.label,
    energyType: result.technology,
    roi: result.financial.irrPct ?? undefined,
    efficiency: Number((result.technical.performanceRatio * 100).toFixed(1)),
  }
}

interface UseSimulationSubmissionParams {
  simulationActions: {
    setLastResult: (result: SimulationResult) => void
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
    mutationFn: async (draft: SimulationCreateFormValues) => createRealSimulation(buildRealSimulationPayload(draft)),
    onSuccess: async (result) => {
      queryClient.setQueryData(['simulation-details', result.id], result)

      simulationActions.setLastResult(toStoredSimulationResult(result))
      useToastStore.getState().pushToast({
        title: 'Simulación completada',
        description: 'La simulación se creó correctamente.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
      navigate(`/simulador/detalles?id=${encodeURIComponent(result.id)}`)
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

    simulationActions.setLastRunInput(parsed.data)
    mutation.mutate(parsed.data)
  }

  return {
    formError,
    isSubmitting: mutation.isPending,
    submitLabel,
    handleSubmit,
  }
}
