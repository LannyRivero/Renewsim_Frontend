import { useMemo, useState } from 'react'
import { Clock3, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRealSimulationHistory } from '../services/simulationService'
import {
  SimulationActionButton,
  SimulationBreadcrumbs,
  SimulationPageContent,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'
import type { BreadcrumbItem } from '@/shared/components'
import type { SimulationHistoryItem, SimulationHistoryRow } from '@/shared/types'
import { SimulationHistoryTable } from './SimulationHistoryTable'
import { SimulationHistoryFilters } from './components/SimulationHistoryFilters'
import { SimulationHistoryPagination } from './components/SimulationHistoryPagination'
import { useSimulationHistoryDelete } from './useSimulationHistoryDelete'
import { formatDisplayDate, formatPercent, formatStatusLabel, parseDate, parsePercentage } from './historyTable.utils'
import type { HistorySortField, HistorySortDirection } from './historyTable.utils'

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

export function SimulationHistoryPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-history'],
    queryFn: getRealSimulationHistory,
  })

  const deleteMutation = useSimulationHistoryDelete()
  const [search, setSearch] = useState('')
  const [energyFilter, setEnergyFilter] = useState<'all' | 'solar' | 'wind' | 'hydro'>('all')
  const [draftEnergyFilter, setDraftEnergyFilter] = useState<'all' | 'solar' | 'wind' | 'hydro'>('all')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [sort, setSort] = useState<{ field: HistorySortField; direction: HistorySortDirection }>({
    field: 'createdAt',
    direction: 'desc',
  })
  const [currentPage, setCurrentPage] = useState(1)

  const rows = useMemo(() => (data?.items ?? []).map(toHistoryTableItem), [data])
  const normalizedSearch = search.trim().toLowerCase()
  const filteredRows = useMemo(() => {
    const baseRows = rows
      .filter((row) => {
        if (energyFilter === 'all') return true
        return row.energyType.trim().toLowerCase() === energyFilter
      })
      .filter((row) => {
        if (!normalizedSearch) return true

        return [row.name, row.location, row.status, row.energyType].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        )
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

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="rounded-md px-3 pt-4 pb-4 sm:px-4 lg:h-auto lg:p-5" bodyClassName="lg:h-auto">
      <SimulationPageContent spacing="compact" className="lg:h-auto">
        <SimulationBreadcrumbs
          className="mb-1"
          items={[
            { label: 'Simulador', href: '/simulador' },
            { label: 'Historial' },
          ] satisfies BreadcrumbItem[]}
        />
        <SimulationSectionHeader
          eyebrow="Archivo de simulaciones"
          eyebrowIcon={<Clock3 className="h-3.5 w-3.5" />}
          title="Simulaciones disponibles para seguimiento"
          description="Encontrá escenarios previos, reabrí análisis puntuales y gestioná el archivo operativo sin duplicar la lectura agregada del dashboard."
          className="md:items-end"
          actions={
            <div className="w-full md:w-auto md:min-w-fit">
              <Link to="/simulador/nueva">
                <SimulationActionButton type="button" variant="primary" className="w-full px-3 py-1.5 text-sm md:w-auto">
                  <Plus className="h-4 w-4" />
                  Nueva simulación
                </SimulationActionButton>
              </Link>
            </div>
          }
        />

        <SimulationHistoryFilters
          search={search}
          isFilterPanelOpen={isFilterPanelOpen}
          draftEnergyFilter={draftEnergyFilter}
          onSearchChange={handleSearchChange}
          onTogglePanel={() => setIsFilterPanelOpen((current) => !current)}
          onDraftFilterChange={(value) => setDraftEnergyFilter(value)}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />

        {!isLoading && !isError && rows.length > 0 && filteredRows.length === 0 ? (
          <SimulationStateMessage>
            No hay simulaciones que coincidan con los filtros actuales.
          </SimulationStateMessage>
        ) : null}

        <SimulationHistoryTable
          rows={paginatedRows}
          sortField={sort.field}
          sortDirection={sort.direction}
          onSortChange={handleSortChange}
          isLoading={isLoading}
          isError={isError}
          isDeleting={deleteMutation.isPending}
          onDelete={(simulationId) => deleteMutation.mutate(simulationId)}
        />

        <SimulationHistoryPagination
          safeCurrentPage={safeCurrentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage((page) => Math.max(1, page - 1))}
          onNext={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
        />
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
