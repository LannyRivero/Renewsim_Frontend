import { Link } from 'react-router-dom'

const SIMULATION_ROWS = [
  { date: '15 de mayo de 2024', energyType: 'Solar', efficiency: '85%', roi: '12%' },
  { date: '22 de abril de 2024', energyType: 'Eolica', efficiency: '92%', roi: '15%' },
  { date: '10 de marzo de 2024', energyType: 'Hidroelectrica', efficiency: '78%', roi: '10%' },
  { date: '5 de febrero de 2024', energyType: 'Biomasa', efficiency: '80%', roi: '8%' },
  { date: '1 de enero de 2024', energyType: 'Geotermica', efficiency: '88%', roi: '14%' },
]

export function SimulationHistoryPage() {
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
              Simulador
            </Link>
            <Link to="/como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
              Recursos
            </Link>
            <Link to="/acerca-de" className="text-sm font-medium hover:text-primary transition-colors">
              Comunidad
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Notificaciones"
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
            Historial de Simulaciones
          </h1>
          <Link
            to="/simulador/nueva"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">add</span>
            Nueva Simulacion
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-sm dark:border-white/10 dark:bg-surface-dark">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low dark:bg-background-dark">
                <tr>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    Tipo de Energia
                  </th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    Eficiencia
                  </th>
                  <th scope="col" className="px-6 py-4 text-sm font-medium">
                    ROI
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant dark:divide-white/10">
                {SIMULATION_ROWS.map((row) => (
                  <tr
                    key={`${row.date}-${row.energyType}`}
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
                          to="/simulador/editar"
                          aria-label={`Ver simulacion ${row.energyType}`}
                          className="rounded-lg p-2 text-primary transition-colors hover:bg-primary/10"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </Link>
                        <button
                          type="button"
                          aria-label={`Editar simulacion ${row.energyType}`}
                          className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-primary/10 dark:text-content-dark/60"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          type="button"
                          aria-label={`Eliminar simulacion ${row.energyType}`}
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
