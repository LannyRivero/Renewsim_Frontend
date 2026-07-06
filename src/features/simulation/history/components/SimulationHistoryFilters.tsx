import { SimulationSearchFilters, SimulationActionButton, SimulationSelect } from '@/shared/components'

interface SimulationHistoryFiltersProps {
  search: string
  isFilterPanelOpen: boolean
  draftEnergyFilter: 'all' | 'solar' | 'wind' | 'hydro'
  onSearchChange: (value: string) => void
  onTogglePanel: () => void
  onDraftFilterChange: (value: 'all' | 'solar' | 'wind' | 'hydro') => void
  onApplyFilters: () => void
  onResetFilters: () => void
}

export function SimulationHistoryFilters({
  search,
  isFilterPanelOpen,
  draftEnergyFilter,
  onSearchChange,
  onTogglePanel,
  onDraftFilterChange,
  onApplyFilters,
  onResetFilters,
}: SimulationHistoryFiltersProps) {
  return (
    <SimulationSearchFilters
      searchId="history-search"
      searchLabel="Buscar simulación"
      searchValue={search}
      searchPlaceholder="Buscar por nombre, ubicación, estado o tecnología"
      isFilterPanelOpen={isFilterPanelOpen}
      onSearchChange={onSearchChange}
      onTogglePanel={onTogglePanel}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#738679] dark:text-content-dark/60">Tecnología</p>
        <label htmlFor="history-energy-filter" className="sr-only">Filtrar por tecnología</label>
        <SimulationSelect
          id="history-energy-filter"
          aria-label="Filtrar por tecnología"
          value={draftEnergyFilter}
          onChange={(event) => onDraftFilterChange(event.target.value as 'all' | 'solar' | 'wind' | 'hydro')}
          className="mt-2 h-9 w-full rounded border-[#d9e1d8] bg-[#fcfdfc] dark:bg-[#111917]"
        >
          <option value="all">Todas las tecnologías</option>
          <option value="solar">Solar</option>
          <option value="wind">Eólica</option>
          <option value="hydro">Hidro</option>
        </SimulationSelect>
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
