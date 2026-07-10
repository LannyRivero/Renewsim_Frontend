import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { HistorySortDirection, HistorySortField } from '../historyTable.utils'

interface SimulationHistorySortButtonProps {
  field: HistorySortField
  label: string
  activeField: HistorySortField
  direction: HistorySortDirection
  onSortChange: (field: HistorySortField) => void
}

export function SimulationHistorySortButton({
  field,
  label,
  activeField,
  direction,
  onSortChange,
}: SimulationHistorySortButtonProps) {
  const isActive = activeField === field

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => onSortChange(field)}
      className="inline-flex h-auto items-center gap-1.5 rounded-none border-none bg-transparent px-0 py-0 font-semibold text-[#55695e] shadow-none hover:bg-transparent hover:text-[#1c2a22] dark:text-content-dark/75 dark:hover:bg-transparent dark:hover:text-content-dark"
    >
      <span>{label}</span>
      <span className="flex flex-col leading-none">
        <ChevronUp className={`h-3 w-3 ${isActive && direction === 'asc' ? 'text-[#1c2a22] dark:text-content-dark' : 'text-[#b6c2b6] dark:text-content-dark/35'}`} />
        <ChevronDown className={`-mt-1 h-3 w-3 ${isActive && direction === 'desc' ? 'text-[#1c2a22] dark:text-content-dark' : 'text-[#b6c2b6] dark:text-content-dark/35'}`} />
      </span>
    </Button>
  )
}
