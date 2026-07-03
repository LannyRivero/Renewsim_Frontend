import { LocateFixed, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SimulationStateMessage } from '@/shared/components'
import type { ResolvedLocation } from '../../services/simulationService'
import type { SimulationCreateFormController } from '../hooks/useSimulationLocation'

interface LocationFieldModel {
  isResolvingBrowserLocation: boolean
  shouldShowSearchingMessage: boolean
  locationAssistMessage: string | null
  locationSuggestions: ResolvedLocation[]
  startBrowserLocationResolution: () => void
  applyLocationSuggestion: (suggestion: ResolvedLocation) => void
}

interface LocationFieldProps {
  form: SimulationCreateFormController
  location: LocationFieldModel
}

interface LocationSearchInputProps {
  form: SimulationCreateFormController
  isResolvingBrowserLocation: boolean
  onUseBrowserLocation: () => void
}

function LocationSearchInput({ form, isResolvingBrowserLocation, onUseBrowserLocation }: LocationSearchInputProps) {
  return (
    <div className="flex h-9 w-full items-center rounded border border-[#cfd8ce] bg-[#fafcf9] pl-3.5 pr-1 text-sm shadow-[0_8px_20px_-20px_rgba(89,103,92,0.14)] transition-colors focus-within:border-[#9fb49f] focus-within:ring-4 focus-within:ring-[#dfe8de] dark:border-white/10 dark:bg-[#111d18] dark:focus-within:border-white/20 dark:focus-within:ring-white/10">
      <input
        id="location"
        type="text"
        placeholder="Ingresá ciudad o región"
        className="flex-1 border-none bg-transparent py-2.5 text-sm text-[#415447] outline-none placeholder:text-[#8c9e92] dark:text-content-dark dark:placeholder:text-content-dark/45"
        {...form.register('locationSearch')}
      />
      <span className="group relative">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onUseBrowserLocation}
          disabled={isResolvingBrowserLocation}
          aria-label="Usar mi ubicación"
          className="flex size-7 shrink-0 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-content-dark/60 dark:hover:bg-white/10 dark:hover:text-content-dark"
        >
          {isResolvingBrowserLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
        </Button>
        <span className="pointer-events-none absolute -top-8 right-0 z-10 whitespace-nowrap rounded bg-[#0d5a37] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-emerald-400 dark:text-slate-950">
          Usar mi ubicación
        </span>
      </span>
    </div>
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
