import { Link } from 'react-router-dom'
import { SimulationActionButton, SimulationCard, SimulationStateMessage } from '@/shared/components'
import type { SimulationHistoryItem } from '@/shared/types'

export function SimulationHistoryTable({
  rows,
  isLoading,
  isError,
  isDeleting,
  onDelete,
}: {
  rows: SimulationHistoryItem[]
  isLoading: boolean
  isError: boolean
  isDeleting: boolean
  onDelete: (simulationId: string) => void
}) {
  return (
    <SimulationCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/85 dark:bg-white/8">
            <tr>
              <th scope="col" className="px-6 py-4 text-sm font-medium">Fecha</th>
              <th scope="col" className="px-6 py-4 text-sm font-medium">Tipo de energía</th>
              <th scope="col" className="px-6 py-4 text-sm font-medium">Eficiencia</th>
              <th scope="col" className="px-6 py-4 text-sm font-medium">ROI</th>
              <th scope="col" className="px-6 py-4 text-right text-sm font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 dark:divide-white/10">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03]">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-on-surface-variant dark:text-content-dark/60">
                  {row.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-content-dark">{row.energyType}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">{row.efficiency}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-primary">{row.roi}</td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/simulador/detalles?id=${encodeURIComponent(row.id)}`}
                      aria-label={`Ver simulación ${row.energyType}`}
                      className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </Link>
                    <Link
                      to={`/simulador/editar?id=${encodeURIComponent(row.id)}`}
                      aria-label={`Editar simulación ${row.energyType}`}
                      className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-primary/10 dark:text-content-dark/60"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                    <SimulationActionButton
                      type="button"
                      variant="ghost"
                      aria-label={`Eliminar simulación ${row.energyType}`}
                      onClick={() => onDelete(row.id)}
                      disabled={isDeleting}
                      className="rounded-lg p-2 text-red-500 hover:bg-red-500/10"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </SimulationActionButton>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && !isError && rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <SimulationStateMessage>Todavía no hay simulaciones. Creá tu primera simulación para ver resultados aquí.</SimulationStateMessage>
                </td>
              </tr>
            ) : null}
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <SimulationStateMessage>Cargando historial de simulaciones...</SimulationStateMessage>
                </td>
              </tr>
            ) : null}
            {isError ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <SimulationStateMessage tone="error">No se pudo cargar el historial de simulaciones. Intentá nuevamente.</SimulationStateMessage>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </SimulationCard>
  )
}
