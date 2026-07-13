import { FilePenLine, RotateCcw, Save } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToastStore } from '@/stores/toastStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { editSimulationSchema } from '../schemas/simulationSchema'
import type { EditSimulationValues } from '../schemas/simulationSchema'
import { getRealSimulationById, updateSimulationById } from '../services/simulationService'
import { SimulationActionButton, SimulationPageContent, SimulationPageHeader, SimulationPageShell, SimulationStateMessage } from '@/shared/components'
import type { BreadcrumbItem } from '@/shared/components'
import { EditSimulationForm } from './EditSimulationForm'
import { buildUpdatedSimulationPayload } from './editSimulationPayload'
import {
  buildEditSimulationFormDefaults,
  parseEditSimulationForm,
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getRealSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const updateMutation = useMutation({
    mutationFn: async (values: EditSimulationValues) => {
      if (!simulationId) {
        throw new Error('Missing simulation id')
      }
      if (!data) {
        throw new Error('Missing simulation details')
      }

      const payload = await buildUpdatedSimulationPayload(data, editSimulationSchema.parse(values))
      await updateSimulationById(simulationId, payload)
    },
    onSuccess: (_data, values) => {
      if (simulationId) {
        setLastResult({
          id: simulationId,
          location: values.location,
          energyType: values.technology,
          roi: lastResult?.roi,
          efficiency: lastResult?.efficiency,
        })

        if (lastRunInput) {
          setLastRunInput({
            ...lastRunInput,
            name: values.name,
            technology: values.technology,
            locationSearch: values.location,
            location: {
              ...lastRunInput.location,
              label: values.location,
            },
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
  const formKey = [
    simulationId ?? 'new',
    formDefaults.name,
    formDefaults.location,
    formDefaults.installedCapacityKw,
    formDefaults.annualConsumptionKwh,
    formDefaults.electricityPurchasePricePerKwh,
    formDefaults.capexTotal,
  ].join('|')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    updateMutation.mutate(parseEditSimulationForm(new FormData(event.currentTarget)))
  }

  const simName = data?.input?.name ?? lastResult?.name ?? 'Simulación'

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="rounded-md px-3 pt-4 pb-4 sm:px-4 lg:p-5" bodyClassName="lg:h-auto">
      <SimulationPageContent spacing="compact" className="lg:h-auto">
        <SimulationPageHeader
          items={[
            { label: 'Simulador', href: '/simulador' },
            { label: 'Historial', href: '/simulador/historial' },
            { label: simName, href: `/simulador/detalles?id=${encodeURIComponent(simulationId ?? '')}` },
            { label: 'Editar' },
          ] satisfies BreadcrumbItem[]}
          eyebrow="Editor de escenarios"
          eyebrowIcon={<FilePenLine className="h-3.5 w-3.5" />}
          title="Editar simulación"
          description="Ajustá el escenario actual con un formulario más preciso que concentre los datos económicos importantes en una sola vista."
          actions={
            <div className="flex w-full flex-col gap-2 md:w-auto md:min-w-fit md:flex-row">
              <SimulationActionButton
                type="reset"
                form="edit-simulation-form"
                variant="outline"
                disabled={updateMutation.isPending}
                className="w-full px-3 py-1.5 text-sm md:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Reiniciar cambios
              </SimulationActionButton>
              <SimulationActionButton
                type="submit"
                form="edit-simulation-form"
                variant="primary"
                disabled={updateMutation.isPending}
                className="w-full px-3 py-1.5 text-sm md:w-auto"
              >
                <Save className="h-4 w-4" />
                {updateMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
              </SimulationActionButton>
            </div>
          }
        />
        {simulationId && isLoading ? <SimulationStateMessage>Cargando simulación para editar...</SimulationStateMessage> : null}
        {simulationId && isError ? (
          <SimulationStateMessage tone="error">No se pudo cargar la simulación para edición. Intentá nuevamente.</SimulationStateMessage>
        ) : null}
        <EditSimulationForm
          key={formKey}
          defaults={formDefaults}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
