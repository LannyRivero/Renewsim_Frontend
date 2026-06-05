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
