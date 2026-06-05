import { FilePenLine } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToastStore } from '@/stores/toastStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { editSimulationSchema } from '../schemas/simulationSchema'
import { getSimulationById, updateSimulationById } from '../services/simulationService'
import {
  SimulationActionButton,
  SimulationCard,
  SimulationPageShell,
  SimulationSectionHeader,
} from '@/shared/components'

export function EditSimulationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const lastResult = useSimulationStore((state) => state.lastResult)
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
    mutationFn: async (values: Parameters<typeof editSimulationSchema.parse>[0]) => {
      if (!simulationId) {
        throw new Error('Missing simulation id')
      }
      const payload = editSimulationSchema.parse(values)
      await updateSimulationById(simulationId, payload)
    },
    onSuccess: () => {
      useToastStore.getState().pushToast({
        title: 'Changes Saved',
        description: 'Simulation was updated successfully.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
      if (simulationId) {
        queryClient.invalidateQueries({ queryKey: ['simulation-details', simulationId] })
      }
      navigate('/simulador/historial')
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Update Error',
        description: 'Could not update simulation. Please verify the fields.',
        variant: 'error',
      })
    },
  })

  const inferredSource =
    data?.energyType?.toLowerCase() === 'wind'
      ? 'Wind Turbine'
      : data?.energyType?.toLowerCase() === 'hydro'
        ? 'Hydroelectric'
        : 'Solar Panels'

  const initialName = `${data?.energyType ?? lastResult?.energyType ?? 'Energy'} Simulation`
  const initialLocation = data?.location ?? lastResult?.location ?? 'San Francisco, CA'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    updateMutation.mutate({
      simulationName: String(formData.get('simulationName') ?? ''),
      location: String(formData.get('location') ?? ''),
      energySource: String(formData.get('energySource') ?? ''),
      systemSizeKw: Number(formData.get('systemSizeKw') ?? 0),
      annualConsumptionKwh: Number(formData.get('annualConsumptionKwh') ?? 0),
      incentives: Number(formData.get('incentives') ?? 0),
      electricityRate: Number(formData.get('electricityRate') ?? 0),
    })
  }

  return (
    <SimulationPageShell>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <SimulationSectionHeader
          eyebrow="Scenario Editor"
          eyebrowIcon={<FilePenLine className="h-3.5 w-3.5" />}
          title="Edit Simulation"
          description="Refine the current scenario with a tighter, production-grade form that keeps the important economic inputs in one surface."
        />

        <SimulationCard className="p-6 sm:p-7">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="simulation-name" className="mb-2 block text-sm font-medium">
              Simulation Name
            </label>
            <input
              id="simulation-name"
              name="simulationName"
              defaultValue={initialName}
              className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
            />
          </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium">
              Location
            </label>
            <select
              id="location"
              name="location"
              className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
              defaultValue={initialLocation}
            >
              <option>{initialLocation}</option>
              <option>San Francisco, CA</option>
              <option>Austin, TX</option>
              <option>Miami, FL</option>
              <option>Denver, CO</option>
            </select>
          </div>

          <div>
            <label htmlFor="energy-source" className="mb-2 block text-sm font-medium">
              Energy Source
            </label>
            <select
              id="energy-source"
              name="energySource"
              className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
              defaultValue={inferredSource}
            >
              <option>Solar Panels</option>
              <option>Wind Turbine</option>
              <option>Hydroelectric</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="system-size" className="mb-2 block text-sm font-medium">
                System Size (kW)
              </label>
              <input
                id="system-size"
                name="systemSizeKw"
                type="number"
                step="0.1"
                defaultValue={7.5}
                className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
              />
            </div>
            <div>
              <label htmlFor="energy-consumption" className="mb-2 block text-sm font-medium">
                Annual Energy Consumption (kWh)
              </label>
              <input
                id="energy-consumption"
                name="annualConsumptionKwh"
                type="number"
                defaultValue={10000}
                className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="incentives" className="mb-2 block text-sm font-medium">
                Incentives/Rebates ($)
              </label>
              <input
                id="incentives"
                name="incentives"
                type="number"
                defaultValue={1500}
                className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
              />
            </div>
            <div>
              <label htmlFor="electricity-rate" className="mb-2 block text-sm font-medium">
                Electricity Rate ($/kWh)
              </label>
              <input
                id="electricity-rate"
                name="electricityRate"
                type="number"
                step="0.01"
                defaultValue={0.18}
                className="w-full rounded-xl border border-slate-200/90 bg-white/96 px-3.5 py-2.5 text-sm text-slate-700 shadow-[0_8px_22px_-20px_rgba(15,23,42,0.4)] outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200/70 dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <SimulationActionButton
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </SimulationActionButton>
          </div>
        </form>
        </SimulationCard>
      </div>
    </SimulationPageShell>
  )
}
