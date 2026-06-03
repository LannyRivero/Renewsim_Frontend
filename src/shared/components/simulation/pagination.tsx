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
    <div className="mt-4 flex flex-col gap-2 rounded-md border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#15241e] dark:text-content-dark/75 md:flex-row md:items-center md:justify-between">
      <span>{summaryLabel}</span>
      <span>{pageLabel}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isPrevDisabled}
          className="rounded-sm border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
        >
          {prevLabel}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="rounded-sm border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
