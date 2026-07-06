import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SimulationActionButton } from './controls'

interface SimulationPaginationProps {
  summaryLabel: string
  pageLabel: string
  prevLabel?: string
  nextLabel?: string
  onPrev: () => void
  onNext: () => void
  isPrevDisabled: boolean
  isNextDisabled: boolean
}

export function SimulationPagination({
  summaryLabel,
  pageLabel,
  prevLabel = 'Prev',
  nextLabel = 'Next',
  onPrev,
  onNext,
  isPrevDisabled,
  isNextDisabled,
}: SimulationPaginationProps) {
  return (
    <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#d1dad0] bg-[#e8eee8] px-4 py-2.5 text-sm text-[#5b6e61] dark:border-white/10 dark:bg-[#15241e] dark:text-content-dark/75 md:flex-row md:items-center md:justify-between">
      <span>{summaryLabel}</span>
      <span>{pageLabel}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isPrevDisabled}
          className="rounded-lg border border-[#c8d3c8] bg-[#f8fbf7] px-3 py-1 text-[#435749] disabled:opacity-50 dark:border-white/10"
        >
          {prevLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="rounded-lg border border-[#c8d3c8] bg-[#f8fbf7] px-3 py-1 text-[#435749] disabled:opacity-50 dark:border-white/10"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}

interface SimulationPageNavProps {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

export function SimulationPageNav({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: SimulationPageNavProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-end border-t border-[#dde4dc] pt-3 dark:border-white/8">
      <div className="flex flex-wrap items-center justify-end gap-2 text-sm">
        <SimulationActionButton
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="h-8 border-transparent bg-transparent px-2 py-1 text-sm font-medium text-[#6a7c71] shadow-none hover:border-transparent hover:bg-[#f5f8f4] dark:hover:bg-white/[0.05]"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </SimulationActionButton>
        <span className="px-1 text-sm font-medium text-[#6a7c71] dark:text-content-dark/60">{currentPage}/{totalPages}</span>
        <SimulationActionButton
          type="button"
          variant="outline"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="h-8 border-transparent bg-transparent px-2 py-1 text-sm font-medium shadow-none hover:border-transparent hover:bg-[#f5f8f4] dark:hover:bg-white/[0.05]"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </SimulationActionButton>
      </div>
    </div>
  )
}
