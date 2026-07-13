import { SimulationPagination } from '@/shared/components'

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
    <SimulationPagination
      summaryLabel={`Showing ${showingFrom}-${showingTo} of ${total} users`}
      pageLabel={`Page ${currentPage} of ${totalPages}`}
      prevLabel="Prev"
      nextLabel="Next"
      onPrev={onPrev}
      onNext={onNext}
      isPrevDisabled={currentPage === 1}
      isNextDisabled={currentPage === totalPages}
    />
  )
}
