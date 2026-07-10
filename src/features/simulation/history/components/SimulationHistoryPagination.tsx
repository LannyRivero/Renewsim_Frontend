import { SimulationPageNav } from '@/shared/components'

interface SimulationHistoryPaginationProps {
  safeCurrentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
  onPageSelect: (page: number) => void
}

export function SimulationHistoryPagination({
  safeCurrentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageSelect,
}: SimulationHistoryPaginationProps) {
  return (
    <SimulationPageNav
      currentPage={safeCurrentPage}
      totalPages={totalPages}
      onPrevious={onPrevious}
      onNext={onNext}
      onPageSelect={onPageSelect}
    />
  )
}
