interface AdminPaginationProps {
  showingFrom: number
  showingTo: number
  total: number
  currentPage: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export function AdminPagination({
  showingFrom,
  showingTo,
  total,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: AdminPaginationProps) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-black/10 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-white/10 dark:bg-[#15241e] dark:text-content-dark/75 md:flex-row md:items-center md:justify-between">
      <span>
        Showing {showingFrom}-{showingTo} of {total} users
      </span>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage === 1}
          className="rounded-sm border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="rounded-sm border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
        >
          Next
        </button>
      </div>
    </div>
  )
}
