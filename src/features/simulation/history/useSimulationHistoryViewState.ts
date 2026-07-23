import { useMemo, useState } from 'react'
import type { SimulationHistoryItem, SimulationHistoryRow } from '@/shared/types'
import { formatDisplayDate, formatPercent, formatStatusLabel, parseDate, parsePercentage } from './historyTable.utils'
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

export function useSimulationHistoryViewState(rowsData: SimulationHistoryRow[] | undefined) {
  const [search, setSearch] = useState('')
  const [energyFilter, setEnergyFilter] = useState<'all' | 'solar' | 'wind' | 'hydro'>('all')
  const [draftEnergyFilter, setDraftEnergyFilter] = useState<'all' | 'solar' | 'wind' | 'hydro'>('all')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [sort, setSort] = useState<{ field: HistorySortField; direction: HistorySortDirection }>({
    field: 'createdAt',
    direction: 'desc',
  })
  const [currentPage, setCurrentPage] = useState(1)

  const rows = useMemo(() => (rowsData ?? []).map(toHistoryTableItem), [rowsData])
  const normalizedSearch = search.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    const baseRows = rows
      .filter((row) => {
        if (energyFilter === 'all') return true
        return row.energyType.trim().toLowerCase() === energyFilter
      })
      .filter((row) => {
        if (!normalizedSearch) return true

        return [row.name, row.location, row.status, row.energyType].some((value) => value.toLowerCase().includes(normalizedSearch))
      })

    return [...baseRows].sort((left, right) => {
      const directionMultiplier = sort.direction === 'asc' ? 1 : -1

      if (sort.field === 'name') {
        return left.name.localeCompare(right.name) * directionMultiplier
      }

      if (sort.field === 'status') {
        const statusComparison = left.status.localeCompare(right.status) * directionMultiplier
        if (statusComparison !== 0) return statusComparison

        return left.energyType.localeCompare(right.energyType) * directionMultiplier
      }

      if (sort.field === 'createdAt') {
        return (parseDate(left.createdAt) - parseDate(right.createdAt)) * directionMultiplier
      }

      return (parsePercentage(left.roi) - parsePercentage(right.roi)) * directionMultiplier
    })
  }, [rows, energyFilter, normalizedSearch, sort])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const start = (safeCurrentPage - 1) * ROWS_PER_PAGE
  const paginatedRows = filteredRows.slice(start, start + ROWS_PER_PAGE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  function handleEnergyFilterChange(value: 'all' | 'solar' | 'wind' | 'hydro') {
    setEnergyFilter(value)
    setCurrentPage(1)
  }

  function handleApplyFilters() {
    handleEnergyFilterChange(draftEnergyFilter)
    setIsFilterPanelOpen(false)
  }

  function handleResetFilters() {
    setDraftEnergyFilter('all')
    handleEnergyFilterChange('all')
    setIsFilterPanelOpen(false)
  }

  function handleSortChange(field: HistorySortField) {
    setSort((currentSort) => {
      if (currentSort.field === field) {
        return {
          field,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return {
        field,
        direction: field === 'name' || field === 'status' ? 'asc' : 'desc',
      }
    })
    setCurrentPage(1)
  }

  return {
    search,
    draftEnergyFilter,
    isFilterPanelOpen,
    sortField: sort.field,
    sortDirection: sort.direction,
    rows,
    filteredRows,
    paginatedRows,
    safeCurrentPage,
    totalPages,
    setDraftEnergyFilter,
    setIsFilterPanelOpen,
    setCurrentPage,
    handleSearchChange,
    handleApplyFilters,
    handleResetFilters,
    handleSortChange,
  }
}
