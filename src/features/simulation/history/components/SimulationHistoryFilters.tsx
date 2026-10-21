import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SimulationSearchFilters, SimulationActionButton, SimulationTextInput, SimulationStateMessage } from '@/shared/components'
import { getSavedLocationSuggestions } from '../../services/simulationService'

interface SimulationHistoryFiltersProps {
  search: string
  draftLocation: string
  isFilterPanelOpen: boolean
  onSearchChange: (value: string) => void
  onLocationChange: (value: string) => void
  onTogglePanel: () => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

export function SimulationHistoryFilters({
  search,
  draftLocation,
  isFilterPanelOpen,
  onSearchChange,
  onLocationChange,
  onTogglePanel,
  onApplyFilters,
  onResetFilters,
}: SimulationHistoryFiltersProps) {
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const selectedSuggestionRef = useRef(false)
  const normalizedQuery = draftLocation.trim()
  const suggestionsQuery = useQuery({
    queryKey: ['simulation-history-location-suggestions', debouncedQuery],
    queryFn: () => getSavedLocationSuggestions(debouncedQuery),
    enabled: debouncedQuery.length >= 2 && isFilterPanelOpen,
    staleTime: 60_000,
  })

  useEffect(() => {
    if (selectedSuggestionRef.current) {
      selectedSuggestionRef.current = false
      setDebouncedQuery('')
      return
    }
    const nextQuery = normalizedQuery.length >= 2 ? normalizedQuery : ''
    const timeoutId = window.setTimeout(() => setDebouncedQuery(nextQuery), nextQuery ? 350 : 0)
    return () => window.clearTimeout(timeoutId)
  }, [normalizedQuery])

  function selectLocation(location: string) {
    selectedSuggestionRef.current = true
    onLocationChange(location)
  }

  return (
    <SimulationSearchFilters
      searchId="history-search"
      searchLabel="Buscar por nombre"
      searchValue={search}
      searchPlaceholder="Buscar simulación por nombre"
      isFilterPanelOpen={isFilterPanelOpen}
      onSearchChange={onSearchChange}
      onTogglePanel={onTogglePanel}
    >
      <div className="relative z-50">
        <label htmlFor="history-location-filter" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#738679] dark:text-content-dark/60">Ubicación</label>
        <SimulationTextInput
          id="history-location-filter"
          aria-label="Filtrar por ubicación"
          value={draftLocation}
          onChange={(event) => onLocationChange(event.target.value)}
          name="simulation-history-location-filter"
          autoComplete="off"
          spellCheck={false}
          placeholder="Ingresá una ubicación"
          className="mt-2 h-9 w-full"
        />
        {normalizedQuery.length >= 2 && (suggestionsQuery.isFetching || suggestionsQuery.isFetched || suggestionsQuery.isError) ? (
          <ul role="listbox" aria-label="Ubicaciones sugeridas" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-sm border border-[#d8dee8] bg-white shadow-lg dark:border-white/10 dark:bg-[#111d18]">
            {suggestionsQuery.isFetching ? (
              <li className="px-3 py-2"><SimulationStateMessage className="text-xs">Buscando ubicaciones...</SimulationStateMessage></li>
            ) : suggestionsQuery.isError ? (
              <li className="px-3 py-2"><SimulationStateMessage tone="error" className="text-xs">No se pudieron cargar las ubicaciones. Intentá nuevamente.</SimulationStateMessage></li>
            ) : suggestionsQuery.data?.length ? (
              suggestionsQuery.data.map((location) => (
                <li key={location} role="option" aria-selected="false">
                  <button type="button" onClick={() => selectLocation(location)} className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-content-dark dark:hover:bg-white/10">
                    {location}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-2"><SimulationStateMessage className="text-xs">No encontramos ubicaciones para “{normalizedQuery}”.</SimulationStateMessage></li>
            )}
          </ul>
        ) : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#eef2ed] pt-3 dark:border-white/8">
        <SimulationActionButton type="button" variant="soft" onClick={onResetFilters} className="h-8 px-2.5 py-1 text-sm font-medium">
          Limpiar
        </SimulationActionButton>
        <SimulationActionButton type="button" variant="primary" onClick={onApplyFilters} className="h-8 px-3 py-1 text-sm">
          Aplicar
        </SimulationActionButton>
      </div>
    </SimulationSearchFilters>
  )
}
