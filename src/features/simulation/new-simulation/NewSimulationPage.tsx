import { ClimatePreviewCard } from './components/ClimatePreviewCard'
import { LocationField } from './components/LocationField'
import { SimulationInputFields } from './components/SimulationInputFields'
import { useClimatePreview } from './hooks/useClimatePreview'
import { useLocationSuggestions } from './hooks/useLocationSuggestions'
import { useSimulationSubmission } from './hooks/useSimulationSubmission'
import {
  SimulationActionButton,
  SimulationCard,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'
import { useSimulationStore } from '@/stores/simulationStore'

export function NewSimulationPage() {
  const draft = useSimulationStore((state) => state.draft)
  const setDraftField = useSimulationStore((state) => state.setDraftField)
  const setLastResult = useSimulationStore((state) => state.setLastResult)
  const setLastRunInput = useSimulationStore((state) => state.setLastRunInput)
  const {
    hasLocationQuery,
    isSearchingLocation,
    locationSearchMessage,
    locationSuggestions,
    clearLocationSuggestions,
  } = useLocationSuggestions(draft.location)
  const {
    isRefreshingClimate,
    displayedClimatePreview,
    resolvedClimate,
    setResolvedClimate,
    setClimatePreview,
  } = useClimatePreview({
    location: draft.location,
    energyType: draft.energyType,
  })
  const { formError, isSubmitting, submitLabel, handleSubmit } = useSimulationSubmission({
    draft,
    climateState: {
      resolvedClimate,
      setResolvedClimate,
      setClimatePreview,
    },
    simulationActions: {
      setLastResult,
      setLastRunInput,
    },
  })

  return (
    <SimulationPageShell contentClassName="px-2.5 pt-4 pb-0 lg:h-full">
      <section className="flex flex-col lg:h-full">
        <SimulationSectionHeader
          eyebrow="Simulación Setup"
          description="Configura tu simulación con parámetros específicos del proyecto."
          className="md:items-center"
        />

        <form className=" space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <SimulationActionButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-full px-8 py-3 text-base md:w-auto"
            >
              {submitLabel}
            </SimulationActionButton>
          </div>

          <SimulationCard className="grid grid-cols-1 gap-6" density="comfortable">
            <LocationField
              location={draft.location}
              onLocationChange={(value) => setDraftField('location', value)}
              isSearchingLocation={isSearchingLocation}
              searchMessage={locationSearchMessage}
              suggestions={locationSuggestions}
              onSuggestionSelect={(suggestion) => {
                setDraftField('location', suggestion)
                clearLocationSuggestions()
              }}
              hasLocationQuery={hasLocationQuery}
            />

            <SimulationInputFields
              energyType={draft.energyType}
              projectSize={draft.projectSize}
              budget={draft.budget}
              energyConsumption={draft.energyConsumption}
              onEnergyTypeChange={(value) => setDraftField('energyType', value)}
              onProjectSizeChange={(value) => setDraftField('projectSize', value)}
              onBudgetChange={(value) => setDraftField('budget', value)}
              onEnergyConsumptionChange={(value) => setDraftField('energyConsumption', value)}
            />
          </SimulationCard>

          {formError ? (
            <SimulationStateMessage tone="error" className="text-sm">
              {formError}
            </SimulationStateMessage>
          ) : null}

          <ClimatePreviewCard
            energyType={draft.energyType}
            hasLocationQuery={hasLocationQuery}
            isRefreshingClimate={isRefreshingClimate}
            preview={displayedClimatePreview}
          />
        </form>
      </section>
    </SimulationPageShell>
  )
}
