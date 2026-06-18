import { SimulationActionButton, SimulationStateMessage, SimulationTextInput } from '@/shared/components'
import type { ResolvedLocation } from '../../services/simulationService'
import type { SimulationCreateFormController } from '../hooks/useSimulationLocation'

interface LocationFieldProps {
  form: SimulationCreateFormController
  normalizedLocation: string
  hasResolvedLocation: boolean
  isResolvingBrowserLocation: boolean
  isSearchingLocation: boolean
  locationAssistMessage: string | null
  locationSuggestions: ResolvedLocation[]
  onUseBrowserLocation: () => void
  onSuggestionSelect: (suggestion: ResolvedLocation) => void
}

export function LocationField({
  form,
  normalizedLocation,
  isResolvingBrowserLocation,
  isSearchingLocation,
  locationAssistMessage,
  locationSuggestions,
  onUseBrowserLocation,
  onSuggestionSelect,
}: LocationFieldProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <label htmlFor="location" className="mb-1 block text-sm font-medium">
          Ubicación
        </label>
        <SimulationActionButton type="button" variant="outline" onClick={onUseBrowserLocation}  className="rounded-full px-2.5 py-2 shadow-[0_14px_26px_-20px_rgba(13,90,55,0.28)]">
          {isResolvingBrowserLocation ? 'Ubicando...' : 'Usar mi ubicación'}
        </SimulationActionButton>

      </div>
      <div className="rounded-[1rem] border border-[#d8e0d6] bg-[#f7faf5] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <SimulationTextInput
          id="location"
          type="text"
          placeholder="Ingresá ciudad o región"
          className="h-12"
          {...form.register('location')}
        />
        {normalizedLocation.length >= 2 && isSearchingLocation ? (
          <SimulationStateMessage className="mt-2 text-xs">Buscando ubicaciones...</SimulationStateMessage>
        ) : null}
        {form.formState.errors.location ? (
          <SimulationStateMessage tone="error" className="mt-2 text-xs">
            {form.formState.errors.location.message}
          </SimulationStateMessage>
        ) : null}
        {locationAssistMessage ? (
          <SimulationStateMessage className="mt-2 text-xs">{locationAssistMessage}</SimulationStateMessage>
        ) : null}
        {locationSuggestions.length > 0 ? (
          <ul className="mt-2 max-h-48 overflow-y-auto rounded-[0.9rem] border border-[#d8e0d6] bg-white shadow-sm dark:border-white/10 dark:bg-[#111d18]">
            {locationSuggestions.map((suggestion) => (
              <li key={`${suggestion.name}-${suggestion.country}-${suggestion.lat}-${suggestion.lon}`}>
                <button
                  type="button"
                  onClick={() => onSuggestionSelect(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-content-dark dark:hover:bg-white/10"
                >
                  {`${suggestion.name}, ${suggestion.country}`}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      
        <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
          <p className="text-xs text-on-surface-variant dark:text-content-dark/65">
            Ingresá una referencia legible para la ubicación y confirmá las coordenadas.
          </p>      
        </div>
      </div>
    </div>
  )
}
