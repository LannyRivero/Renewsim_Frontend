import { FilePenLine } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToastStore } from '@/stores/toastStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { editSimulationSchema } from '../schemas/simulationSchema'
import type { EditSimulationValues } from '../schemas/simulationSchema'
import { getSimulationById, updateSimulationById } from '../services/simulationService'
import { SimulationPageContent, SimulationPageShell, SimulationSectionHeader } from '@/shared/components'
import { EditSimulationForm } from './EditSimulationForm'
import {
  buildEditSimulationFormDefaults,
  parseEditSimulationForm,
  toNormalizedEnergyType,
} from './editSimulationViewModel'

export function EditSimulationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const lastResult = useSimulationStore((state) => state.lastResult)
  const lastRunInput = useSimulationStore((state) => state.lastRunInput)
  const setLastResult = useSimulationStore((state) => state.setLastResult)
  const setLastRunInput = useSimulationStore((state) => state.setLastRunInput)
  const simulationId = searchParams.get('id') ?? lastResult?.id ?? null

  const { data } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const updateMutation = useMutation({
    mutationFn: async (values: EditSimulationValues) => {
      if (!simulationId) {
        throw new Error('Missing simulation id')
      }
      const payload = editSimulationSchema.parse(values)
      await updateSimulationById(simulationId, payload)
    },
    onSuccess: (_data, values) => {
      if (simulationId) {
        const normalizedEnergyType = toNormalizedEnergyType(values.energySource)

        setLastResult({
          id: simulationId,
          location: values.location,
          energyType: normalizedEnergyType,
          roi: lastResult?.roi,
          efficiency: lastResult?.efficiency,
        })

        if (lastRunInput) {
          setLastRunInput({
            ...lastRunInput,
            location: values.location,
            energyType: normalizedEnergyType,
          })
        }
      }

      useToastStore.getState().pushToast({
        title: 'Cambios guardados',
        description: 'La simulación se actualizó correctamente.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
      if (simulationId) {
        queryClient.invalidateQueries({ queryKey: ['simulation-details', simulationId] })
        navigate(`/simulador/detalles?id=${encodeURIComponent(simulationId)}`)
        return
      }

      navigate('/simulador/historial')
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar la simulación. Verificá los campos.',
        variant: 'error',
      })
    },
  })

  const formDefaults = buildEditSimulationFormDefaults({ data, lastResult })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    updateMutation.mutate(parseEditSimulationForm(new FormData(event.currentTarget)))
  }

  return (
    <SimulationPageShell>
      <SimulationPageContent className="mx-auto w-full max-w-3xl">
        <SimulationSectionHeader
          eyebrow="Editor de escenarios"
          eyebrowIcon={<FilePenLine className="h-3.5 w-3.5" />}
          title="Editar simulación"
          description="Ajustá el escenario actual con un formulario más preciso que concentre los datos económicos importantes en una sola vista."
        />
        <EditSimulationForm
          defaults={formDefaults}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
