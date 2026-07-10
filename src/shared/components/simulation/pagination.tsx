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
        <SimulationActionButton
          type="button"
          onClick={onPrev}
          disabled={isPrevDisabled}
          variant="outline"
          className="h-8 rounded-lg px-3 py-1 text-[#435749]"
        >
          {prevLabel}
        </SimulationActionButton>
        <SimulationActionButton
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          variant="outline"
          className="h-8 rounded-lg px-3 py-1 text-[#435749]"
        >
          {nextLabel}
        </SimulationActionButton>
      </div>
    </div>
  )
}

interface SimulationPageNavProps {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
  onPageSelect?: (page: number) => void
}

function buildVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'ellipsis', totalPages] as const
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages] as const
  }

  return [1, 'ellipsis', currentPage, 'ellipsis', totalPages] as const
}

export function SimulationPageNav({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageSelect,
}: SimulationPageNavProps) {
  if (totalPages <= 1) return null

  const visiblePages = buildVisiblePages(currentPage, totalPages)

  return (
    <div className="flex justify-end border-t border-[#dde4dc] pt-3 dark:border-white/8">
      <div className="flex flex-wrap items-center justify-end gap-1.5 text-sm">
        <SimulationActionButton
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={currentPage === 1}
          className="h-8 border-transparent bg-transparent px-1.5 py-1 text-sm font-medium text-[#6a7c71] shadow-none hover:border-transparent hover:bg-[#f5f8f4] disabled:text-[#b4c0b7] dark:text-content-dark/45 dark:hover:bg-white/[0.05]"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </SimulationActionButton>

        {visiblePages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm font-semibold tracking-[0.08em] text-[#415347] dark:text-content-dark/70">
              ...
            </span>
          ) : (
            <SimulationActionButton
              key={page}
              type="button"
              onClick={() => onPageSelect?.(page)}
              disabled={page === currentPage || !onPageSelect}
              variant={page === currentPage ? 'primary' : 'outline'}
              className={[
                'h-8 min-w-8 rounded-md px-2 text-sm font-semibold transition-colors',
                page === currentPage
                  ? 'bg-[#0d5a37] text-white shadow-[0_10px_24px_-18px_rgba(13,90,55,0.55)]'
                  : 'border-transparent bg-transparent text-[#1f3428] shadow-none hover:border-transparent hover:bg-[#edf5ef] dark:text-content-dark/80 dark:hover:bg-white/[0.06]',
              ].join(' ')}
              aria-current={page === currentPage ? 'page' : undefined}
              aria-label={page === currentPage ? `Página actual, ${page}` : `Ir a la página ${page}`}
            >
              {page}
            </SimulationActionButton>
          ),
        )}

        <SimulationActionButton
          type="button"
          variant="outline"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="h-8 border-transparent bg-transparent px-1.5 py-1 text-sm font-medium text-[#1f3428] shadow-none hover:border-transparent hover:bg-[#f5f8f4] disabled:text-[#b4c0b7] dark:text-content-dark/80 dark:hover:bg-white/[0.05]"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </SimulationActionButton>
      </div>
    </div>
  )
}
