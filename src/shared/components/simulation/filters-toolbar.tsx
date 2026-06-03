import { Search, SlidersHorizontal } from 'lucide-react'
import { SimulationCard, SimulationToolbar } from './layout'
import { SimulationSelect, SimulationTextInput } from './controls'

interface SimulationFiltersToolbarOption {
  value: string
  label: string
}

interface SimulationFiltersToolbarProps {
  searchId: string
  searchLabel: string
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  filterId: string
  filterLabel: string
  filterValue: string
  onFilterChange: (value: string) => void
  filterOptions: SimulationFiltersToolbarOption[]
  searchHint?: string
}

export function SimulationFiltersToolbar({
  searchId,
  searchLabel,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filterId,
  filterLabel,
  filterValue,
  onFilterChange,
  filterOptions,
  searchHint,
}: SimulationFiltersToolbarProps) {
  const searchHintId = searchHint ? `${searchId}-hint` : undefined

  return (
    <SimulationCard density="compact" tone="soft" className="border-black/5 dark:border-white/10">
      <SimulationToolbar className="gap-4">
        <div>
          <label
            htmlFor={searchId}
            className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60"
          >
            <Search className="h-3.5 w-3.5" />
            {searchLabel}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-content-dark/40" />
            <SimulationTextInput
              id={searchId}
              aria-describedby={searchHintId}
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 rounded-lg border-slate-200/80 bg-white pl-10 pr-3 shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-[#111d18] dark:shadow-none"
            />
          </div>
          {searchHint ? <p id={searchHintId} className="mt-2 text-xs text-slate-500 dark:text-content-dark/55">{searchHint}</p> : null}
        </div>

        <div>
          <label
            htmlFor={filterId}
            className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {filterLabel}
          </label>
          <SimulationSelect
            id={filterId}
            value={filterValue}
            onChange={(event) => onFilterChange(event.target.value)}
            className="h-11 rounded-lg border-slate-200/80 bg-white shadow-sm shadow-slate-200/40 dark:border-white/10 dark:bg-[#111d18] dark:shadow-none"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SimulationSelect>
        </div>
      </SimulationToolbar>
    </SimulationCard>
  )
}
