import { Clock3, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteSimulationById, getSimulationHistory } from '../services/simulationService'
import { useToastStore } from '@/stores/toastStore'
import {
  SimulationActionButton,
  SimulationCard,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'

export function SimulationHistoryPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-history'],
    queryFn: getSimulationHistory,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSimulationById,
    onMutate: async (simulationId) => {
      await queryClient.cancelQueries({ queryKey: ['simulation-history'] })

      const previousHistory = queryClient.getQueryData<typeof data>(['simulation-history'])

      queryClient.setQueryData(['simulation-history'], (current: typeof data) => {
        if (!current) return current
        return current.filter((item) => item.id !== simulationId)
      })

      return { previousHistory }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
      useToastStore.getState().pushToast({
        title: 'Simulation Deleted',
        description: 'The simulation was deleted successfully.',
        variant: 'success',
      })
    },
    onError: (_error, _simulationId, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['simulation-history'], context.previousHistory)
      }
      useToastStore.getState().pushToast({
        title: 'Delete Error',
        description: 'Could not delete simulation. Please try again.',
        variant: 'error',
      })
    },
  })

  const rows = data ?? []

  return (
    <SimulationPageShell>
      <div className="flex flex-col gap-6 lg:h-full">
        <SimulationSectionHeader
          eyebrow="Simulation Archive"
          eyebrowIcon={<Clock3 className="h-3.5 w-3.5" />}
          title="Simulation History"
          description="Track previous runs, reopen key scenarios, and manage historical analysis without leaving the workspace."
          actions={
            <Link to="/simulador/nueva">
              <SimulationActionButton type="button" variant="primary">
                <Plus className="h-4 w-4" />
                New Simulation
              </SimulationActionButton>
            </Link>
          }
        />

        <SimulationCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/85 dark:bg-white/8">
                <tr>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    Energy Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    Efficiency
                  </th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    ROI
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-white/10">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-white/[0.03]"
                  >
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
                          aria-label={`View simulation ${row.energyType}`}
                          className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </Link>
                        <Link
                          to={`/simulador/editar?id=${encodeURIComponent(row.id)}`}
                          aria-label={`Edit simulation ${row.energyType}`}
                          className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-primary/10 dark:text-content-dark/60"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete simulation ${row.energyType}`}
                          onClick={() => deleteMutation.mutate(row.id)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && !isError && rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <SimulationStateMessage>No simulations yet. Create your first simulation to see results here.</SimulationStateMessage>
                    </td>
                  </tr>
                ) : null}
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <SimulationStateMessage>Loading simulation history...</SimulationStateMessage>
                    </td>
                  </tr>
                ) : null}
                {isError ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <SimulationStateMessage tone="error">Could not load simulation history. Please try again.</SimulationStateMessage>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </SimulationCard>
      </div>
    </SimulationPageShell>
  )
}
