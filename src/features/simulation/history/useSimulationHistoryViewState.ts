import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { SimulationHistoryItem, SimulationHistoryRow } from '@/shared/types'
import { formatDisplayDate, formatPercent, formatStatusLabel } from './historyTable.utils'
import type { HistorySortDirection, HistorySortField } from './historyTable.utils'

const ROWS_PER_PAGE = 10

function toHistoryTableItem(row: SimulationHistoryRow): SimulationHistoryItem {
  return {
    id: row.id,
    name: row.name,
    status: formatStatusLabel(row.status),
    location: row.locationLabel,
    createdAt: row.createdAt,
    date: formatDisplayDate(row.createdAt),
    energyType: row.technology,
    efficiency: 'N/A',
    roi: formatPercent(row.irrPct),
  }
}

export function useSimulationHistoryViewState() {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [draftLocation, setDraftLocation] = useState('')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [sort, setSort] = useState<{ field: HistorySortField; direction: HistorySortDirection }>({ field: 'createdAt', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const normalizedSearch = search.trim()
  const query = {
    name: normalizedSearch || undefined,
    location: location || undefined,
    page: currentPage - 1,
    size: ROWS_PER_PAGE,
    sortBy: sort.field,
    direction: sort.direction,
  } as const
  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-history', query],
    queryFn: () => import('../services/simulationService').then(({ getRealSimulationHistory }) => getRealSimulationHistory(query)),
    placeholderData: (previousData) => previousData,
  })
  const rows = (data?.items ?? []).map(toHistoryTableItem)
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / ROWS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  function handleSearchChange(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function handleLocationChange(value: string) {
    setDraftLocation(value)
  }

  function handleApplyFilters() {
    setLocation(draftLocation.trim())
    setCurrentPage(1)
    setIsFilterPanelOpen(false)
  }

  function handleResetFilters() {
    setLocation('')
    setDraftLocation('')
    setCurrentPage(1)
    setIsFilterPanelOpen(false)
  }

  function handleSortChange(field: HistorySortField) {
    setSort((current) => ({ field, direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc' }))
    setCurrentPage(1)
  }

  function handleHistoryItemDeleted() {
    const remainingPages = Math.max(1, Math.ceil(((data?.total ?? 0) - 1) / ROWS_PER_PAGE))
    setCurrentPage((page) => Math.min(page, remainingPages))
  }

  return {
    search, draftLocation, isFilterPanelOpen, sortField: sort.field, sortDirection: sort.direction,
    rows, paginatedRows: rows, safeCurrentPage, totalPages,
    setIsFilterPanelOpen,
    setCurrentPage,
    handleSearchChange,
    handleLocationChange,
    handleApplyFilters,
    handleResetFilters,
    handleSortChange,
    handleHistoryItemDeleted,
    isLoading, isError, total: data?.total ?? 0,
  }
}
