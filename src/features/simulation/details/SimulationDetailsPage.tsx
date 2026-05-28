import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'
import { buildSimulationInsights } from '../utils/simulationInsights'

export function SimulationDetailsPage() {
  const [searchParams] = useSearchParams()
  const resultFromStore = useSimulationStore((state) => state.lastResult)
  const lastRunInput = useSimulationStore((state) => state.lastRunInput)
  const simulationId = searchParams.get('id') ?? resultFromStore?.id ?? null

  const { data } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const location = data?.location ?? resultFromStore?.location ?? 'N/A'
  const energyType = data?.energyType ?? resultFromStore?.energyType ?? 'Unknown'
  const simulationName = `${energyType} Simulation`
  const date = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'
  const roi = typeof data?.roi === 'number'
    ? `${data.roi}%`
    : typeof resultFromStore?.roi === 'number'
      ? `${resultFromStore.roi}%`
      : 'N/A'
  const efficiency = typeof data?.efficiency === 'number'
    ? `${data.efficiency}%`
    : typeof resultFromStore?.efficiency === 'number'
      ? `${resultFromStore.efficiency}%`
      : 'N/A'
  const insights = buildSimulationInsights(lastRunInput, resultFromStore)

  return (
    <section className="min-h-screen bg-surface dark:bg-[#0f1a16]">
      <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface/80 backdrop-blur-sm dark:border-white/10 dark:bg-[#0f1a16]/90">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="size-7 rounded-full bg-primary-container" />
            <h2 className="text-xl font-bold">RenewSim</h2>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/simulador" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/simulador/historial" className="text-sm font-medium text-primary">
              Simulations
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
              className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low dark:text-content-dark/60"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-10 rounded-full bg-surface-container" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-on-surface dark:text-content-dark">Simulation Details</h1>
          <p className="mt-2 text-on-surface-variant dark:text-content-dark/60">
            Review the comprehensive results of your energy simulation, including financial summaries,
            environmental impact, and educational insights.
          </p>
        </div>

        <div className="space-y-10">
          <section className="rounded-lg border border-outline-variant bg-surface-container-low p-6 dark:border-white/10 dark:bg-[#15241e]">
            <h2 className="mb-4 text-xl font-bold">Simulation Overview</h2>
            <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
              <div>
                <p className="text-on-surface-variant dark:text-content-dark/60">Simulation Name</p>
                <p className="mt-1 font-medium">{simulationName}</p>
              </div>
              <div>
                <p className="text-on-surface-variant dark:text-content-dark/60">Date</p>
                <p className="mt-1 font-medium">{date}</p>
              </div>
              <div>
                <p className="text-on-surface-variant dark:text-content-dark/60">Location</p>
                <p className="mt-1 font-medium">{location}</p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-outline-variant bg-surface dark:border-white/10 dark:bg-[#111d18]">
            <div className="p-6">
              <h2 className="text-xl font-bold">Energy Source Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low dark:bg-[#15241e]">
                  <tr>
                    <th className="px-6 py-3 font-medium" scope="col">Energy Source</th>
                    <th className="px-6 py-3 font-medium" scope="col">Initial Investment</th>
                    <th className="px-6 py-3 font-medium" scope="col">Annual Savings</th>
                    <th className="px-6 py-3 font-medium" scope="col">ROI</th>
                    <th className="px-6 py-3 font-medium" scope="col">CO2 Reduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant dark:divide-white/10">
                  <tr><td className="px-6 py-4 font-medium">Solar Panels</td><td className="px-6 py-4">$25,000</td><td className="px-6 py-4">$3,000</td><td className="px-6 py-4">12%</td><td className="px-6 py-4">5 tons</td></tr>
                  <tr><td className="px-6 py-4 font-medium">Wind Turbine</td><td className="px-6 py-4">$40,000</td><td className="px-6 py-4">$5,000</td><td className="px-6 py-4">10%</td><td className="px-6 py-4">8 tons</td></tr>
                  <tr><td className="px-6 py-4 font-medium">Geothermal</td><td className="px-6 py-4">$60,000</td><td className="px-6 py-4">$7,000</td><td className="px-6 py-4">11.7%</td><td className="px-6 py-4">10 tons</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <section className="rounded-lg border border-outline-variant bg-surface-container-low p-6 dark:border-white/10 dark:bg-[#15241e]">
              <h3 className="font-semibold">Financial Summary</h3>
              <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">Total Investment: $125,000</p>
              <p className="text-sm text-on-surface-variant dark:text-content-dark/70">
                Total Savings: ${(insights.energyGeneratedKwh * 0.12).toLocaleString('en-US')}/year
              </p>
              <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Overall ROI: {roi}</p>
            </section>
            <section className="rounded-lg border border-outline-variant bg-surface-container-low p-6 dark:border-white/10 dark:bg-[#15241e]">
              <h3 className="font-semibold">Environmental Impact</h3>
              <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">
                Total CO2 Reduction: {insights.co2AvoidedTons} tons/year
              </p>
              <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Efficiency: {efficiency}</p>
            </section>
          </div>

          <section className="rounded-lg border border-outline-variant bg-surface-container-low p-6 dark:border-white/10 dark:bg-[#15241e]">
            <h3 className="font-semibold">Climate Conditions Used</h3>
            <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">
              Irradiance: {lastRunInput?.climate.irradiance ?? 'N/A'} kWh/m2/day
            </p>
            <p className="text-sm text-on-surface-variant dark:text-content-dark/70">
              Wind speed: {lastRunInput?.climate.windSpeed ?? 'N/A'} m/s
            </p>
            <p className="text-sm text-on-surface-variant dark:text-content-dark/70">
              Hydrology: {lastRunInput?.climate.hydrology ?? 'N/A'} m3/s
            </p>
          </section>

          <section className="rounded-r-lg border-l-4 border-primary bg-green-50 p-6 dark:bg-green-900/20">
            <h3 className="mb-2 text-xl font-bold">Educational Insights</h3>
            <p className="text-sm text-on-surface dark:text-content-dark/80">
              This simulation demonstrates the significant financial and environmental benefits of transitioning to
              renewable energy sources. Combining multiple technologies can optimize both ROI and emissions
              reduction.
            </p>
          </section>
        </div>
      </main>
    </section>
  )
}
