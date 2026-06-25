import { Sparkles } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LocationField } from './components/LocationField'
import { useSimulationLocation } from './hooks/useSimulationLocation'
import { useSimulationSubmission } from './hooks/useSimulationSubmission'
import {
  simulationCreateSchema,
  type SimulationCreateFormInput,
  type SimulationCreateFormValues,
} from '../schemas/simulationSchema'
import {
  SimulationActionButton,
  SimulationCard,
  SimulationPageContent,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationSelect,
  SimulationStateMessage,
  SimulationTextInput,
} from '@/shared/components'
import { useSimulationStore } from '@/stores/simulationStore'

export function NewSimulationPage() {
  const setLastResult = useSimulationStore((state) => state.setLastResult)
  const setLastRunInput = useSimulationStore((state) => state.setLastRunInput)

  const form = useForm<SimulationCreateFormInput, undefined, SimulationCreateFormValues>({
    resolver: zodResolver(simulationCreateSchema),
    defaultValues: {
      location: '',
      energyType: 'solar',
      projectSize: '',
      budget: '',
      energyConsumption: '',
      locationLatitude: '',
      locationLongitude: '',
    },
    mode: 'onBlur',
  })

  const {
    isResolvingBrowserLocation,
    isSearchingLocation,
    locationAssistMessage,
    locationSuggestions,
    normalizedLocation,
    hasResolvedLocation,
    latitudePreview,
    longitudePreview,
    useBrowserLocation,
    applyLocationSuggestion,
  } = useSimulationLocation({ form })
  const locationSummary = hasResolvedLocation ? normalizedLocation : 'Todavía no seleccionaste una ubicación'
  const coordinatesSummary = hasResolvedLocation ? `${latitudePreview}, ${longitudePreview}` : 'Todavía no seleccionaste coordenadas'

  const { formError, isSubmitting, submitLabel, handleSubmit } = useSimulationSubmission({
    simulationActions: {
      setLastResult,
      setLastRunInput,
    },
  })
  return (
    <SimulationPageShell
      className="lg:h-auto lg:min-h-[calc(100vh-8.5rem)]"
      contentClassName="px-3 pt-4 pb-4 sm:px-4 lg:min-h-[calc(100vh-8.5rem)] lg:p-5"
      bodyClassName="lg:h-full"
    >
      <SimulationPageContent spacing="compact" className="lg:min-h-full">
        <SimulationSectionHeader
          eyebrow="Configuración de simulación"
          eyebrowIcon={<Sparkles className="h-3.5 w-3.5" />}
          title="Nueva simulación"
          description="Define los datos del proyecto y valida la ubicación de instalación antes de pasar a resultados."
          className="md:items-center"
          actions={
            <div className="w-full md:w-auto md:min-w-fit">
              <SimulationActionButton
                type="submit"
                form="new-simulation-form"
                variant="primary"
                disabled={isSubmitting}
                className="w-full rounded-full px-4 py-2 shadow-[0_14px_26px_-20px_rgba(13,90,55,0.28)] md:w-auto"
              >
                {submitLabel}
              </SimulationActionButton>
            </div>
          }
        />

        <form
          id="new-simulation-form"
          className="space-y-4 lg:flex lg:flex-1 lg:flex-col"
          onSubmit={form.handleSubmit((values, event) => {
            handleSubmit(values, event)
          })}
        >
          <SimulationCard className="space-y-5 lg:flex lg:flex-1 lg:flex-col lg:justify-between" density="comfortable">
            <div className="space-y-5">
              <LocationField
                form={form}
                normalizedLocation={normalizedLocation}
                hasResolvedLocation={hasResolvedLocation}
                isResolvingBrowserLocation={isResolvingBrowserLocation}
                isSearchingLocation={isSearchingLocation}
                locationAssistMessage={locationAssistMessage}
                locationSuggestions={locationSuggestions}
                onUseBrowserLocation={useBrowserLocation}
                onSuggestionSelect={applyLocationSuggestion}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="energyType" className="mb-1 block text-sm font-medium">
                    Tipo de energía
                  </label>
                  <SimulationSelect id="energyType" className="h-12" {...form.register('energyType')}>
                    <option value="solar">Solar</option>
                    <option value="wind">Eólica</option>
                    <option value="hydro">Hidráulica</option>
                  </SimulationSelect>
                </div>

                <div>
                  <label htmlFor="projectSize" className="mb-1 block text-sm font-medium">
                    Tamaño del proyecto
                  </label>
                  <SimulationTextInput id="projectSize" type="number" min={1} placeholder="500" className="h-12" {...form.register('projectSize')} />
                </div>

                <div>
                  <label htmlFor="budget" className="mb-1 block text-sm font-medium">
                    Presupuesto
                  </label>
                  <SimulationTextInput id="budget" type="number" min={1} placeholder="1000000" className="h-12" {...form.register('budget')} />
                </div>

                <div>
                  <label htmlFor="energyConsumption" className="mb-1 block text-sm font-medium">
                    Consumo energético
                  </label>
                  <SimulationTextInput
                    id="energyConsumption"
                    type="number"
                    min={1}
                    placeholder="1000"
                    className="h-12"
                    {...form.register('energyConsumption')}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[1rem] border border-[#d8e0d6] bg-[#f7faf5] p-4 dark:border-white/10 dark:bg-white/[0.03] lg:mt-6">
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface dark:text-content-dark">Cómo se usará esta ubicación</h3>
                  <p className="mt-1 text-xs text-on-surface-variant dark:text-content-dark/65">
                    Estas coordenadas se utilizarán para consultar clima, calcular energía y devolver los resultados financieros.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/60">
                      Ubicación activa
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-content-dark">
                      {locationSummary}
                    </p>
                  </div>
                  <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/60">
                      Coordenadas
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-content-dark">
                      {coordinatesSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {formError ? (
              <SimulationStateMessage tone="error" className="text-sm">
                {formError}
              </SimulationStateMessage>
            ) : null}
          </SimulationCard>
        </form>
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
