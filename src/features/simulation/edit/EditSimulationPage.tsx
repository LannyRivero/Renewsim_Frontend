import { FilePenLine } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToastStore } from '@/stores/toastStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { editSimulationSchema } from '../schemas/simulationSchema'
import type { EditSimulationValues } from '../schemas/simulationSchema'
import { getRealSimulationById, searchLocations, updateSimulationById } from '../services/simulationService'
import type { MonthlySeries, RealCreateSimulationRequest } from '@/shared/types'
import { SimulationBreadcrumbs, SimulationPageContent, SimulationPageShell, SimulationSectionHeader } from '@/shared/components'
import type { BreadcrumbItem } from '@/shared/components'
import { EditSimulationForm } from './EditSimulationForm'
import {
  buildEditSimulationFormDefaults,
  parseEditSimulationForm,
  toNormalizedEnergyType,
} from './editSimulationViewModel'

function scaleMonthlyConsumptionKwh(currentMonthly: MonthlySeries, nextAnnualConsumptionKwh: number): MonthlySeries {
  const currentTotal = currentMonthly.reduce((sum, value) => sum + value, 0)

  if (currentTotal <= 0) {
    const monthlyBase = Number((nextAnnualConsumptionKwh / 12).toFixed(2))
    const values = Array.from({ length: 12 }, () => monthlyBase)
    values[11] = Number((nextAnnualConsumptionKwh - monthlyBase * 11).toFixed(2))
    return values as MonthlySeries
  }

  const scaled = currentMonthly.map((value) => Number(((value / currentTotal) * nextAnnualConsumptionKwh).toFixed(2)))
  const scaledTotal = scaled.reduce((sum, value) => sum + value, 0)
  scaled[11] = Number((scaled[11] + (nextAnnualConsumptionKwh - scaledTotal)).toFixed(2))

  return scaled as MonthlySeries
}

async function resolveEditedLocation(
  currentPayload: RealCreateSimulationRequest,
  nextLocationLabel: string,
): Promise<RealCreateSimulationRequest['location']> {
  if (nextLocationLabel === currentPayload.location.label) {
    return currentPayload.location
  }

  const matches = await searchLocations(nextLocationLabel, 1)
  const bestMatch = matches[0]

  if (!bestMatch) {
    throw new Error('No se pudo resolver la nueva ubicación seleccionada.')
  }

  return {
    label: bestMatch.label,
    lat: bestMatch.lat,
    lon: bestMatch.lon,
    country: bestMatch.country,
    countryCode: bestMatch.countryCode,
  }
}

async function buildUpdatedSimulationPayload(
  currentSimulation: Awaited<ReturnType<typeof getRealSimulationById>>,
  values: EditSimulationValues,
): Promise<RealCreateSimulationRequest> {
  const currentPayload = currentSimulation.input
  const normalizedEnergyType = toNormalizedEnergyType(values.energySource)

  if (normalizedEnergyType !== 'solar') {
    throw new Error('Por ahora el backend real solo soporta simulaciones solares.')
  }

  const location = await resolveEditedLocation(currentPayload, values.location)
  const capexWithoutIncentives = Math.max(0, currentPayload.economics.capexTotal - values.incentives)

  return {
    name: values.simulationName,
    technology: normalizedEnergyType,
    location,
    system: {
      ...currentPayload.system,
      installedCapacityKw: values.systemSizeKw,
    },
    demand: {
      annualConsumptionKwh: values.annualConsumptionKwh,
      monthlyConsumptionKwh: scaleMonthlyConsumptionKwh(
        currentPayload.demand.monthlyConsumptionKwh,
        values.annualConsumptionKwh,
      ),
    },
    economics: {
      ...currentPayload.economics,
      capexTotal: capexWithoutIncentives,
      electricityPurchasePricePerKwh: values.electricityRate,
    },
  }
}

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
            name: values.simulationName,
            technology: 'solar',
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    updateMutation.mutate(parseEditSimulationForm(new FormData(event.currentTarget)))
  }

  const simName = data?.input?.name ?? lastResult?.name ?? 'Simulación'

  return (
    <SimulationPageShell>
      <SimulationPageContent className="mx-auto w-full max-w-3xl">
        <SimulationBreadcrumbs
          className="mb-1"
          items={[
            { label: 'Simulador', href: '/simulador' },
            { label: 'Historial', href: '/simulador/historial' },
            { label: simName, href: `/simulador/detalles?id=${encodeURIComponent(simulationId ?? '')}` },
            { label: 'Editar' },
          ] satisfies BreadcrumbItem[]}
        />
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
