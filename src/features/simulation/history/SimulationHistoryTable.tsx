import { useState } from 'react'
import { SimulationCard } from '@/shared/components'
import type { SimulationHistoryItem } from '@/shared/types'
import { SimulationHistoryDesktopTable } from './components/SimulationHistoryDesktopTable'
import { SimulationHistoryMobileList } from './components/SimulationHistoryMobileList'
import type { HistorySortDirection, HistorySortField } from './historyTable.utils'

export function SimulationHistoryTable({
  rows,
  sortField,
  sortDirection,
  onSortChange,
  isLoading,
  isError,
  isDeleting,
  onDelete,
}: {
  rows: SimulationHistoryItem[]
  sortField: HistorySortField
  sortDirection: HistorySortDirection
  onSortChange: (field: HistorySortField) => void
  isLoading: boolean
  isError: boolean
  isDeleting: boolean
  onDelete: (simulationId: string) => void
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <SimulationCard className="flex min-h-0 flex-col overflow-visible border-[#d8dee8] bg-[#f6f8fb] p-0 backdrop-blur-sm dark:border-white/10 dark:bg-[#15191d]">
      <div>
        <SimulationHistoryMobileList
          rows={rows}
          openMenuId={openMenuId}
          isDeleting={isDeleting}
          onToggleMenu={(simulationId) => setOpenMenuId((current) => (current === simulationId ? null : simulationId))}
          onCloseMenu={() => setOpenMenuId(null)}
          onDelete={onDelete}
        />

        <SimulationHistoryDesktopTable
          rows={rows}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={onSortChange}
          isLoading={isLoading}
          isError={isError}
          openMenuId={openMenuId}
          isDeleting={isDeleting}
          onToggleMenu={(simulationId) => setOpenMenuId((current) => (current === simulationId ? null : simulationId))}
          onCloseMenu={() => setOpenMenuId(null)}
          onDelete={onDelete}
        />
      </div>
    </SimulationCard>
  )
}
