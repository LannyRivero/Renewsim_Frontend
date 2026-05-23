import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteSimulationById, getSimulationHistory } from '../services/simulationService'
import { useToastStore } from '@/stores/toastStore'

const FALLBACK_ROWS = [
  { id: 'mock-1', date: 'May 15, 2024', energyType: 'Solar', efficiency: '85%', roi: '12%' },
  { id: 'mock-2', date: 'April 22, 2024', energyType: 'Wind', efficiency: '92%', roi: '15%' },
  { id: 'mock-3', date: 'March 10, 2024', energyType: 'Hydroelectric', efficiency: '78%', roi: '10%' },
  { id: 'mock-4', date: 'February 5, 2024', energyType: 'Biomass', efficiency: '80%', roi: '8%' },
  { id: 'mock-5', date: 'January 1, 2024', energyType: 'Geothermal', efficiency: '88%', roi: '14%' },
]

export function SimulationHistoryPage() {
  const queryClient = useQueryClient()
  const { data } = useQuery({
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

  const rows = data && data.length > 0 ? data : FALLBACK_ROWS

  return (
    <section className="min-h-screen bg-surface dark:bg-background-dark">
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface/80 backdrop-blur-sm dark:border-white/10 dark:bg-background-dark/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <span className="material-symbols-outlined">air</span>
            </div>
            <h2 className="text-xl font-bold">RenewSim</h2>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/simulador" className="text-sm font-medium hover:text-primary transition-colors">
              Simulator
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Resources
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Community
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-full p-2 transition-colors hover:bg-primary/10 dark:hover:bg-primary/20"
            >
              <span className="material-symbols-outlined text-on-surface-variant dark:text-content-dark/60">
                notifications
              </span>
            </button>
            <div className="size-10 rounded-full bg-surface-container" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface dark:text-content-dark">
            Simulation History
          </h1>
          <Link
            to="/simulador/nueva"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">add</span>
            New Simulation
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm dark:border-white/10 dark:bg-surface-dark">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low dark:bg-background-dark">
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
              <tbody className="divide-y divide-outline-variant dark:divide-white/10">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-surface-container-low dark:hover:bg-background-dark"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-on-surface-variant dark:text-content-dark/60">
                      {row.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{row.energyType}</td>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
