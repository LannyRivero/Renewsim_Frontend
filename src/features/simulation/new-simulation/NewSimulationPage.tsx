import { Play, Sliders } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AdvancedSettingsSection } from './components/AdvancedSettingsSection'
import { BasicFormFields } from './components/BasicFormFields'
import { LocationField } from './components/LocationField'
import { useSimulationLocation } from './hooks/useSimulationLocation'
import { useSimulationSubmission } from './hooks/useSimulationSubmission'
import { DEFAULT_SIMULATION_FORM_VALUES, simulationCreateSchema, type SimulationCreateFormInput, type SimulationCreateFormValues} from '../schemas/simulationSchema'
import { SimulationActionButton, SimulationCard, SimulationPageContent, SimulationPageShell, SimulationSectionHeader, SimulationStateMessage} from '@/shared/components'
import { useSimulationStore } from '@/stores/simulationStore'

export function NewSimulationPage() {
  const setLastResult = useSimulationStore((state) => state.setLastResult)
  const setLastRunInput = useSimulationStore((state) => state.setLastRunInput)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const form = useForm<SimulationCreateFormInput, undefined, SimulationCreateFormValues>({
    resolver: zodResolver(simulationCreateSchema),
    defaultValues: DEFAULT_SIMULATION_FORM_VALUES,
    mode: 'onBlur',
  })

  const location = useSimulationLocation({ form })

  const { formError, isSubmitting, submitLabel, handleSubmit } = useSimulationSubmission({
    simulationActions: {
      setLastResult,
      setLastRunInput,
    },
  })
  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="rounded-md px-3 pt-4 pb-4 sm:px-4 lg:p-5" bodyClassName="lg:h-auto">
      <SimulationPageContent spacing="compact">
        <SimulationSectionHeader
          eyebrow="Configuración de simulación"
          eyebrowIcon={<Sliders className="h-3.5 w-3.5" />}
          title="Nueva simulación"
          description="Define los datos del proyecto y valida la ubicación de instalación antes de pasar a resultados."
          className="md:items-end"
          actions={
            <div className="w-full md:w-auto md:min-w-fit">
              <SimulationActionButton
                type="submit"
                form="new-simulation-form"
                variant="primary"
                disabled={isSubmitting}
                className="w-full px-3 py-1.5 text-sm md:w-auto"
              >
                <Play className="h-4 w-4" />
                {submitLabel}
              </SimulationActionButton>
            </div>
          }
        />

        <form
          id="new-simulation-form"
          className="space-y-4"
          onSubmit={form.handleSubmit((values, event) => {
            handleSubmit(values, event)
          })}
        >
          <SimulationCard className="space-y-5 rounded-sm border-[#d7dde6] bg-white/85 backdrop-blur-sm dark:border-white/10 dark:bg-[#121417]/85" density="comfortable">
            <div className="space-y-5">
              <LocationField
                form={form}
                location={location}
              />

              <BasicFormFields form={form} />

              <AdvancedSettingsSection
                form={form}
                isAdvancedOpen={isAdvancedOpen}
                onToggle={() => setIsAdvancedOpen((current) => !current)}
              />
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
