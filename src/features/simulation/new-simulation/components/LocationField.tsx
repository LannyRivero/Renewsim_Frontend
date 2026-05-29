import { SimulationStateMessage, SimulationTextInput } from '@/shared/components'

interface LocationFieldProps {
  location: string
  onLocationChange: (value: string) => void
  isSearchingLocation: boolean
  searchMessage: string | null
  suggestions: string[]
  onSuggestionSelect: (suggestion: string) => void
  hasLocationQuery: boolean
}

export function LocationField({
  location,
  onLocationChange,
  isSearchingLocation,
  searchMessage,
  suggestions,
  onSuggestionSelect,
  hasLocationQuery,
}: LocationFieldProps) {
  return (
    <div className="relative">
      <label htmlFor="location" className="mb-1 block text-sm font-medium">
        Location
      </label>
      <SimulationTextInput
        id="location"
        type="text"
        value={location}
        onChange={(event) => onLocationChange(event.target.value)}
        placeholder="Enter location or use geolocation"
        className="h-12"
      />
      {hasLocationQuery && isSearchingLocation ? (
        <SimulationStateMessage className="mt-2 text-xs">Searching locations...</SimulationStateMessage>
      ) : null}
      {searchMessage ? (
        <SimulationStateMessage tone="error" className="mt-2 text-xs">
          {searchMessage}
        </SimulationStateMessage>
      ) : null}
      {suggestions.length > 0 ? (
        <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-[#111d18]">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => onSuggestionSelect(suggestion)}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-content-dark dark:hover:bg-white/10"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
