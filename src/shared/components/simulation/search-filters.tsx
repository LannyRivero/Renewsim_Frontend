import { Search, SlidersHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'
import { SimulationActionButton } from './buttons'
import { SimulationTextInput } from './inputs'
import { SimulationCard } from './layout'

interface SimulationSearchFiltersProps {
  searchId: string
  searchLabel: string
  searchValue: string
  searchPlaceholder: string
  onSearchChange: (value: string) => void
  isFilterPanelOpen: boolean
  onTogglePanel: () => void
  children?: ReactNode
}

export function SimulationSearchFilters({
  searchId,
  searchLabel,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  isFilterPanelOpen,
  onTogglePanel,
  children,
}: SimulationSearchFiltersProps) {
  return (
    <SimulationCard
      density="compact"
      className={`rounded-sm border-[#d8dee8] bg-[#f6f8fb] p-4 backdrop-blur-sm dark:border-white/10 dark:bg-[#15191d] ${isFilterPanelOpen ? 'relative z-30' : 'relative'}`}
    >
      <div className="relative">
        <label htmlFor={searchId} className="sr-only">{searchLabel}</label>
        <div className="flex h-9 w-full items-center rounded border border-[#cfd8ce] bg-[#fafcf9] pl-3.5 pr-1 text-sm shadow-[0_8px_20px_-20px_rgba(89,103,92,0.14)] transition-colors focus-within:border-[#9fb49f] focus-within:ring-4 focus-within:ring-[#dfe8de] dark:border-white/10 dark:bg-[#111d18] dark:focus-within:border-white/20 dark:focus-within:ring-white/10">
          <Search className="mr-2 h-4 w-4 shrink-0 text-[#8c9e92] dark:text-content-dark/45" />
          <SimulationTextInput
            id={searchId}
            aria-label={searchLabel}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-full border-none bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="relative ml-2 shrink-0">
            <SimulationActionButton
              type="button"
              variant="outline"
              aria-label="Abrir filtros"
              aria-expanded={isFilterPanelOpen}
              onClick={onTogglePanel}
              className="h-7 border-transparent bg-transparent px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] shadow-none hover:bg-[#f3f6f2] dark:hover:bg-white/[0.04]"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filtros</span>
            </SimulationActionButton>

            {isFilterPanelOpen ? (
              <div className="absolute right-0 top-full z-20 mt-1 min-w-[260px] rounded-sm border border-[#d8dee8] bg-[#f6f8fb] p-4 shadow-[0_22px_50px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm dark:border-white/10 dark:bg-[#15191d]">
                {children}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </SimulationCard>
  )
}
