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
    <SimulationPageShell>
      <div className="flex flex-col gap-6 lg:h-full">
        <SimulationSectionHeader
          eyebrow="Simulation Setup"
          title="New custom simulation"
          description="Configure your simulation with project-specific parameters."
          className="md:items-center"
        />

        <form className="space-y-6" onSubmit={handleSubmit}>
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
              onEnergyTypeChange={(value) => setDraftField('energyType', value)}
              onProjectSizeChange={(value) => setDraftField('projectSize', value)}
              onBudgetChange={(value) => setDraftField('budget', value)}
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

          <div className="flex justify-end">
            <SimulationActionButton
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-container px-8 py-3 text-base font-semibold text-on-primary hover:brightness-95 md:w-auto"
            >
              {submitLabel}
            </SimulationActionButton>
          </div>
        </form>
      </div>
    </SimulationPageShell>
  )
}
