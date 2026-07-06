import { SimulationStatusBadge, SimulationTechnologyBadge } from '@/shared/components'
import type { SimulationHistoryItem } from '@/shared/types'
import { getStatusTone } from '../historyTable.utils'
import { SimulationHistoryRowActions } from './SimulationHistoryRowActions'

interface SimulationHistoryMobileListProps {
  rows: SimulationHistoryItem[]
  openMenuId: string | null
  isDeleting: boolean
  onToggleMenu: (simulationId: string) => void
  onCloseMenu: () => void
  onDelete: (simulationId: string) => void
}

export function SimulationHistoryMobileList({
  rows,
  openMenuId,
  isDeleting,
  onToggleMenu,
  onCloseMenu,
  onDelete,
}: SimulationHistoryMobileListProps) {
  return (
    <div className="divide-y divide-[#f1f4ef] dark:divide-white/6 lg:hidden">
      {rows.map((row) => (
        <article key={row.id} className="space-y-3 px-4 py-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-semibold leading-6 text-slate-900 dark:text-content-dark">{row.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#738679] dark:text-content-dark/55">{row.date}</p>
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

          <div className="flex flex-wrap items-center gap-2">
            <SimulationTechnologyBadge technology={row.energyType} />
            <SimulationStatusBadge tone={getStatusTone(row.status)} className="whitespace-nowrap rounded-sm px-2 py-0.5">
              {row.status}
            </SimulationStatusBadge>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#738679] dark:text-content-dark/55">ROI</p>
              <p className="mt-1 font-semibold text-primary">{row.roi}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#738679] dark:text-content-dark/55">Ubicación</p>
              <p className="mt-1 truncate text-[#4f6256] dark:text-content-dark/75">{row.location}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
