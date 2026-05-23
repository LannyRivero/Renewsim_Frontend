import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { simulationSchema } from '../schemas/simulationSchema'
import { createSimulation } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'
import { useToastStore } from '@/stores/toastStore'

const FIELD_CLASS =
  'w-full h-12 px-4 rounded-lg bg-surface dark:bg-surface-dark border border-outline-variant dark:border-white/10 placeholder:text-on-surface-variant/60 dark:placeholder:text-content-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-container/60 focus:border-primary-container transition'

const READONLY_CLASS =
  'w-full h-12 px-4 rounded-lg bg-surface-container-low dark:bg-white/5 border border-outline-variant dark:border-white/10 text-on-surface-variant dark:text-content-dark/70 cursor-not-allowed'

export function NewSimulationPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const draft = useSimulationStore((state) => state.draft)
  const setDraftField = useSimulationStore((state) => state.setDraftField)
  const setLastResult = useSimulationStore((state) => state.setLastResult)
  const [formError, setFormError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createSimulation,
    onSuccess: (result) => {
      setLastResult(result)
      useToastStore.getState().pushToast({
        title: 'Simulation Completed',
        description: 'Your simulation was created successfully.',
        variant: 'success',
      })
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] })
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const parsed = simulationSchema.safeParse(draft)
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? 'Invalid form values.'
      setFormError(firstError)
      return
    }

    mutation.mutate({
      ...parsed.data,
      climate: {
        irradiance: 5.4,
        windSpeed: 7.2,
        hydrology: 12.5,
      },
    })
  }

  return (
    <section className="min-h-screen bg-surface dark:bg-background-dark">
      <header className="sticky top-0 z-10 border-b border-outline-variant dark:border-white/10 bg-surface/90 dark:bg-background-dark/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-primary font-bold">
              Simulations
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              Resources
            </a>
            <a href="#" className="text-on-surface-variant hover:text-primary transition-colors">
              Community
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-white/5"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div
              aria-label="Avatar"
              className="h-10 w-10 rounded-full bg-primary-container/30 border border-outline-variant dark:border-white/10"
            />
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface dark:text-content-dark">
            New custom simulation
          </h1>
          <p className="mt-2 text-base text-on-surface-variant dark:text-content-dark/60">
            Configure your simulation with project-specific parameters.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="location" className="mb-1 block text-sm font-medium">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={draft.location}
                onChange={(event) => setDraftField('location', event.target.value)}
                placeholder="Enter location or use geolocation"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label htmlFor="energy-type" className="mb-1 block text-sm font-medium">
                Energy type
              </label>
              <select
                id="energy-type"
                className={FIELD_CLASS}
                value={draft.energyType}
                onChange={(event) => setDraftField('energyType', event.target.value as 'solar' | 'wind' | 'hydro')}
              >
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
                <option value="hydro">Hydroelectric</option>
              </select>
            </div>

            <div>
              <label htmlFor="project-size" className="mb-1 block text-sm font-medium">
                Project size (kW/MW)
              </label>
              <input
                id="project-size"
                type="number"
                min={1}
                value={draft.projectSize}
                onChange={(event) => setDraftField('projectSize', Number(event.target.value))}
                placeholder="Example: 500 kW"
                className={FIELD_CLASS}
              />
            </div>

            <div>
              <label htmlFor="budget" className="mb-1 block text-sm font-medium">
                Budget (EUR)
              </label>
              <input
                id="budget"
                type="number"
                min={1}
                value={draft.budget}
                onChange={(event) => setDraftField('budget', Number(event.target.value))}
                placeholder="Example: 1000000"
                className={FIELD_CLASS}
              />
            </div>
          </div>

          {formError ? (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {formError}
            </p>
          ) : null}

          <div>
            <h2 className="text-lg font-bold text-on-surface dark:text-content-dark">Climate data (read-only)</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label htmlFor="irradiance" className="mb-1 block text-sm font-medium">
                  Irradiance (kWh/m2/day)
                </label>
                <input id="irradiance" readOnly value="5.4" className={READONLY_CLASS} />
              </div>

              <div>
                <label htmlFor="wind-speed" className="mb-1 block text-sm font-medium">
                  Wind speed (m/s)
                </label>
                <input id="wind-speed" readOnly value="7.2" className={READONLY_CLASS} />
              </div>

              <div>
                <label htmlFor="hydrology" className="mb-1 block text-sm font-medium">
                  Hydrology (m3/s)
                </label>
                <input id="hydrology" readOnly value="12.5" className={READONLY_CLASS} />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-lg bg-primary-container px-8 py-3 text-base font-semibold text-on-primary transition hover:brightness-95 md:w-auto"
            >
              {mutation.isPending ? 'Running simulation...' : 'Run simulation'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
