import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToastStore } from '@/stores/toastStore'
import { useSimulationStore } from '@/stores/simulationStore'
import { editSimulationSchema } from '../schemas/simulationSchema'
import { getSimulationById, updateSimulationById } from '../services/simulationService'

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
    <section className="min-h-screen bg-surface dark:bg-background-dark">
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface/80 backdrop-blur-sm dark:border-white/10 dark:bg-background-dark/80">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-full bg-primary-container" />
            <h2 className="text-xl font-bold">RenewSim</h2>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/simulador" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/simulador/historial" className="text-sm font-medium text-primary">
              Simulations
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low dark:text-content-dark/60"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-10 rounded-full bg-surface-container" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface dark:text-content-dark">
            Edit Simulation
          </h1>
          <p className="mt-2 text-on-surface-variant dark:text-content-dark/60">
            Update the parameters for your existing simulation below.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="simulation-name" className="mb-2 block text-sm font-medium">
              Simulation Name
            </label>
              <input
                id="simulation-name"
                name="simulationName"
                defaultValue={initialName}
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              />
            </div>

          <div>
            <label htmlFor="location" className="mb-2 block text-sm font-medium">
              Location
            </label>
            <select
              id="location"
              name="location"
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
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
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
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
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
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
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
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
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
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
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:bg-surface-dark"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </section>
  )
}
