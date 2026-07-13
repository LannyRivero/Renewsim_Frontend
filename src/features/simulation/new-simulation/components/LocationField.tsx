import { SimulationLocationSearchBar, SimulationStateMessage } from '@/shared/components'
import type { ResolvedLocation } from '../../services/simulationService'
import type { SimulationCreateFormController } from '../hooks/useSimulationLocation'

interface LocationFieldModel {
  isResolvingBrowserLocation: boolean
  shouldShowSearchingMessage: boolean
  locationAssistMessage: string | null
  locationSuggestions: ResolvedLocation[]
  startBrowserLocationResolution: () => void
  applyLocationSuggestion: (suggestion: ResolvedLocation) => void
  handleLocationSearchChange: (nextValue: string) => void
}

interface LocationFieldProps {
  form: SimulationCreateFormController
  location: LocationFieldModel
}

interface LocationSearchInputProps {
  form: SimulationCreateFormController
  isResolvingBrowserLocation: boolean
  onUseBrowserLocation: () => void
  onLocationSearchChange: (nextValue: string) => void
}

function LocationSearchInput({
  form,
  isResolvingBrowserLocation,
  onUseBrowserLocation,
  onLocationSearchChange,
}: LocationSearchInputProps) {
  const locationSearchField = form.register('locationSearch')

  return (
    <SimulationLocationSearchBar
      isResolvingBrowserLocation={isResolvingBrowserLocation}
      onUseBrowserLocation={onUseBrowserLocation}
      input={
        <input
          id="location"
          type="text"
          placeholder="Ingresá ciudad o región"
          className="w-full border-none bg-transparent py-2.5 text-sm text-[#415447] outline-none placeholder:text-[#8c9e92] dark:text-content-dark dark:placeholder:text-content-dark/45"
          {...locationSearchField}
          onChange={(event) => {
            locationSearchField.onChange(event)
            onLocationSearchChange(event.target.value)
          }}
        />
      }
    />
  )
}

function LocationSuggestionList({
  suggestions,
  onSuggestionSelect,
}: {
  suggestions: ResolvedLocation[]
  onSuggestionSelect: (suggestion: ResolvedLocation) => void
}) {
  if (suggestions.length === 0) {
    return null
  }

  return (
    <ul className="mt-2 max-h-48 overflow-y-auto rounded-sm border border-[#d8dee8] bg-white shadow-sm dark:border-white/10 dark:bg-[#111d18]">
      {suggestions.map((suggestion) => (
        <li key={`${suggestion.name}-${suggestion.country}-${suggestion.lat}-${suggestion.lon}`}>
          <button
            type="button"
            onClick={() => onSuggestionSelect(suggestion)}
            className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-content-dark dark:hover:bg-white/10"
          >
            {suggestion.label}
          </button>
        </li>
      ))}
    </ul>
  )
}

function LocationMessages({
  form,
  shouldShowSearchingMessage,
  locationAssistMessage,
}: {
  form: SimulationCreateFormController
  shouldShowSearchingMessage: boolean
  locationAssistMessage: string | null
}) {
  const locationSearchError = form.formState.errors.locationSearch?.message
  const resolvedLocationError = form.formState.errors.location?.label?.message

  return (
    <>
      {shouldShowSearchingMessage ? (
        <SimulationStateMessage className="mt-2 text-xs">Buscando ubicaciones...</SimulationStateMessage>
      ) : null}
      {locationSearchError ? (
        <SimulationStateMessage tone="error" className="mt-2 text-xs">
          {locationSearchError}
        </SimulationStateMessage>
      ) : null}
      {!locationSearchError && resolvedLocationError ? (
        <SimulationStateMessage tone="error" className="mt-2 text-xs">
          {resolvedLocationError}
        </SimulationStateMessage>
      ) : null}
      {locationAssistMessage ? <SimulationStateMessage className="mt-2 text-xs">{locationAssistMessage}</SimulationStateMessage> : null}
    </>
  )
}

export function LocationField({ form, location }: LocationFieldProps) {
  return (
    <div>
      <label htmlFor="location" className="mb-1 block text-sm font-medium">
        Ubicación
      </label>
      <div className="rounded-sm border border-[#d8dee8] bg-[#f6f8fb] p-4 dark:border-white/10 dark:bg-[#15191d]">
        <LocationSearchInput
          form={form}
          isResolvingBrowserLocation={location.isResolvingBrowserLocation}
          onUseBrowserLocation={location.startBrowserLocationResolution}
          onLocationSearchChange={location.handleLocationSearchChange}
        />
        <LocationMessages
          form={form}
          shouldShowSearchingMessage={location.shouldShowSearchingMessage}
          locationAssistMessage={location.locationAssistMessage}
        />
        <LocationSuggestionList
          suggestions={location.locationSuggestions}
          onSuggestionSelect={location.applyLocationSuggestion}
        />
      </div>
    </div>
  )
}
