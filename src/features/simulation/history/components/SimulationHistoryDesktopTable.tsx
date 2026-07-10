import { Link } from 'react-router-dom'
import {
  SimulationStateMessage,
  SimulationStatusBadge,
  SimulationTable,
  SimulationTableBodyRow,
  SimulationTableCell,
  SimulationTableHeadCell,
  SimulationTableHeaderRow,
  SimulationTechnologyBadge,
} from '@/shared/components'
import type { SimulationHistoryItem } from '@/shared/types'
import type { HistorySortDirection, HistorySortField } from '../historyTable.utils'
import { getStatusTone } from '../historyTable.utils'
import { SimulationHistoryRowActions } from './SimulationHistoryRowActions'
import { SimulationHistorySortButton } from './SimulationHistorySortButton'

interface SimulationHistoryDesktopTableProps {
  rows: SimulationHistoryItem[]
  sortField: HistorySortField
  sortDirection: HistorySortDirection
  isLoading: boolean
  isError: boolean
  openMenuId: string | null
  isDeleting: boolean
  onSortChange: (field: HistorySortField) => void
  onToggleMenu: (simulationId: string) => void
  onCloseMenu: () => void
  onDelete: (simulationId: string) => void
}

export function SimulationHistoryDesktopTable({
  rows,
  sortField,
  sortDirection,
  isLoading,
  isError,
  openMenuId,
  isDeleting,
  onSortChange,
  onToggleMenu,
  onCloseMenu,
  onDelete,
}: SimulationHistoryDesktopTableProps) {
  return (
    <SimulationTable className="hidden w-full table-fixed lg:table">
      <thead className="sticky top-0 z-10 bg-[#eef3f7] shadow-[inset_0_-1px_0_0_rgba(208,217,228,1)] dark:bg-[#15191d] dark:shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.06)]">
        <SimulationTableHeaderRow className="border-none bg-transparent">
            <SimulationTableHeadCell
            scope="col"
            aria-sort={sortField === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            className="w-[26%] py-2 text-[11px] tracking-[0.14em] text-[#5e7066]"
          >
            <SimulationHistorySortButton field="name" label="Simulación" activeField={sortField} direction={sortDirection} onSortChange={onSortChange} />
          </SimulationTableHeadCell>
          <SimulationTableHeadCell
            scope="col"
            aria-sort={sortField === 'status' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            className="w-[14rem] px-3 py-2 text-[11px] tracking-[0.14em] text-[#5e7066]"
          >
            <SimulationHistorySortButton field="status" label="Estado operativo" activeField={sortField} direction={sortDirection} onSortChange={onSortChange} />
          </SimulationTableHeadCell>
          <SimulationTableHeadCell
            scope="col"
            aria-sort={sortField === 'createdAt' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            className="w-[9.5rem] py-2 text-[11px] tracking-[0.14em] text-[#5e7066]"
          >
            <SimulationHistorySortButton field="createdAt" label="Fecha" activeField={sortField} direction={sortDirection} onSortChange={onSortChange} />
          </SimulationTableHeadCell>
          <SimulationTableHeadCell
            scope="col"
            aria-sort={sortField === 'roi' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
            className="w-[6rem] px-3 py-2 text-[11px] tracking-[0.14em] text-[#5e7066]"
          >
            <SimulationHistorySortButton field="roi" label="ROI" activeField={sortField} direction={sortDirection} onSortChange={onSortChange} />
          </SimulationTableHeadCell>
          <SimulationTableHeadCell scope="col" className="py-2 text-[11px] tracking-[0.14em] text-[#5e7066]">
            Ubicación
          </SimulationTableHeadCell>
        </SimulationTableHeaderRow>
      </thead>

      <tbody>
        {rows.map((row) => (
          <SimulationTableBodyRow key={row.id} className="border-[#e7ebf2] transition-colors hover:bg-[#fbfcfe] dark:border-white/6 dark:hover:bg-white/[0.02]">
            <SimulationTableCell className="py-2 text-sm text-on-surface-variant dark:text-content-dark/60">
              <div className="min-w-0">
                <Link to={`/simulador/detalles?id=${row.id}`} className="line-clamp-2 font-semibold leading-5 text-slate-900 hover:text-primary dark:text-content-dark dark:hover:text-content-dark/80">
                  {row.name}
                </Link>
              </div>
            </SimulationTableCell>
            <SimulationTableCell className="px-3 py-2 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <SimulationTechnologyBadge technology={row.energyType} />
                <SimulationStatusBadge tone={getStatusTone(row.status)} className="whitespace-nowrap rounded-sm px-2 py-0.5">
                  {row.status}
                </SimulationStatusBadge>
              </div>
            </SimulationTableCell>
            <SimulationTableCell className="whitespace-nowrap py-2 text-sm text-on-surface-variant dark:text-content-dark/60">{row.date}</SimulationTableCell>
            <SimulationTableCell className="whitespace-nowrap px-3 py-2 text-sm font-semibold text-primary">{row.roi}</SimulationTableCell>
            <SimulationTableCell className="py-2 text-sm text-[#4f6256] dark:text-content-dark/75">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate leading-6">{row.location}</p>
                </div>
                <SimulationHistoryRowActions
                  row={row}
                  isOpen={openMenuId === row.id}
                  isDeleting={isDeleting}
                  onToggle={() => onToggleMenu(row.id)}
                  onClose={onCloseMenu}
                  onDelete={onDelete}
                />
              </div>
            </SimulationTableCell>
          </SimulationTableBodyRow>
        ))}

        {!isLoading && !isError && rows.length === 0 ? (
          <SimulationTableBodyRow className="border-[#e7ebf2] dark:border-white/6">
            <SimulationTableCell colSpan={5} className="px-5 py-12 text-center">
              <SimulationStateMessage>Todavía no hay simulaciones. Creá tu primera simulación para ver resultados aquí.</SimulationStateMessage>
            </SimulationTableCell>
          </SimulationTableBodyRow>
        ) : null}
        {isLoading ? (
          <SimulationTableBodyRow className="border-[#e7ebf2] dark:border-white/6">
            <SimulationTableCell colSpan={5} className="px-5 py-12 text-center">
              <SimulationStateMessage>Cargando historial de simulaciones...</SimulationStateMessage>
            </SimulationTableCell>
          </SimulationTableBodyRow>
        ) : null}
        {isError ? (
          <SimulationTableBodyRow className="border-[#e7ebf2] dark:border-white/6">
            <SimulationTableCell colSpan={5} className="px-5 py-12 text-center">
              <SimulationStateMessage tone="error">No se pudo cargar el historial de simulaciones. Intentá nuevamente.</SimulationStateMessage>
            </SimulationTableCell>
          </SimulationTableBodyRow>
        ) : null}
      </tbody>
    </SimulationTable>
  )
}
