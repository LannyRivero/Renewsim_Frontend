import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'
import { buildSimulationInsights } from '../utils/simulationInsights'

function MetricCard({
  label,
  value,
  delta,
  positive = true,
}: {
  label: string
  value: string
  delta: string
  positive?: boolean
}) {
  return (
    <article className="rounded-lg border border-outline-variant bg-surface p-6 dark:border-white/10 dark:bg-[#111d18]">
      <p className="text-sm font-medium text-on-surface-variant dark:text-content-dark/60">{label}</p>
      <p className="mt-2 text-3xl font-bold text-on-surface dark:text-content-dark">{value}</p>
      <p
        className={`mt-1 text-sm font-semibold ${
          positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}
      >
        {positive ? '▲' : '▼'} {delta}
      </p>
    </article>
  )
}

export function SimulationResultsPage() {
  const [searchParams] = useSearchParams()
  const lastResult = useSimulationStore((state) => state.lastResult)
  const lastRunInput = useSimulationStore((state) => state.lastRunInput)
  const simulationId = searchParams.get('id') ?? lastResult?.id ?? null

  const { data } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const effectiveResult = data
    ? {
        id: data.id,
        location: data.location,
        energyType: data.energyType,
        roi: data.roi,
        efficiency: data.efficiency,
      }
    : lastResult

  const resultLocation = effectiveResult?.location ?? 'N/A'
  const resultEnergyType = effectiveResult?.energyType ?? 'solar'
  const insights = buildSimulationInsights(lastRunInput, effectiveResult)
  const roiValue = `${insights.roiPercent}%`
  const efficiencyValue = `${insights.efficiencyPercent}%`
  const energyValue = `${insights.energyGeneratedKwh.toLocaleString('en-US')} kWh`
  const paybackValue = `${insights.paybackYears} years`
  const co2Value = `${insights.co2AvoidedTons} tons`

  return (
    <section className="min-h-screen bg-surface dark:bg-[#0f1a16]">
      <header className="border-b border-outline-variant bg-surface dark:border-white/10 dark:bg-[#0f1a16]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">      

          <div className="flex items-center gap-6">
            <nav className="hidden items-center gap-6 md:flex">
              <Link to="/simulador" className="text-sm font-medium hover:text-primary transition-colors">
                Simulations
              </Link>
              <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                Learn
              </Link>
              <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                Community
              </Link>
            </nav>
            <button
              type="button"
              aria-label="Help"
              className="flex size-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-primary-container/20"
            >
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="size-10 rounded-full bg-surface-container" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-on-surface dark:text-content-dark">
            Simulation Results
          </h1>
          <p className="text-base text-on-surface-variant dark:text-content-dark/60">
            Review the outcomes of your energy simulation and explore the impact of your choices.
          </p>
          <p className="text-sm text-on-surface-variant dark:text-content-dark/60">
            Location: {resultLocation} | Energy type: {resultEnergyType}
          </p>
        </header>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-on-surface dark:text-content-dark">Key Metrics</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Energy Generated" value={energyValue} delta={efficiencyValue} />
          <MetricCard label="Return on Investment (ROI)" value={roiValue} delta="Model-calculated" />
          <MetricCard label="Payback Period" value={paybackValue} delta="Adjusted by climate" />
          <MetricCard label="CO2 Emissions Avoided" value={co2Value} delta="Estimated yearly" />
        </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-on-surface dark:text-content-dark">
            Recommended Technology
          </h2>
        <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface dark:border-white/10 dark:bg-[#111d18]">
          <div className="grid gap-6 p-8 md:grid-cols-2 md:items-stretch">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{insights.recommendedTechnology}</h3>
              <p className="text-sm text-on-surface-variant dark:text-content-dark/65">
                Harness solar energy with photovoltaic panels to reduce costs and emissions.
              </p>
              <p className="text-sm text-on-surface dark:text-content-dark">
                The simulation indicates that solar energy offers the best balance between returns and sustainability.
              </p>
              {effectiveResult ? (
                <p className="text-xs text-on-surface-variant dark:text-content-dark/70">
                  Simulation ID: {effectiveResult.id}
                </p>
              ) : null}
              <button
                type="button"
                className="rounded-lg bg-primary-container/15 px-4 py-2 text-sm font-bold text-primary hover:bg-primary-container/25"
              >
                Learn More
              </button>
            </div>
            <div className="min-h-64 rounded-lg bg-gradient-to-br from-primary-container/40 via-surface-container to-surface-container-low" />
          </div>
        </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-on-surface dark:text-content-dark">Comparative Analysis</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <article className="rounded-lg border border-outline-variant bg-surface p-6 dark:border-white/10 dark:bg-[#111d18]">
              <p className="text-sm font-medium text-on-surface-variant dark:text-content-dark/60">
                Energy Generation (kWh)
              </p>
              <div className="mt-6 grid h-52 grid-cols-3 items-end gap-4">
                <div className="rounded bg-primary/30" style={{ height: '100%' }} />
                <div className="rounded bg-surface-container" style={{ height: '70%' }} />
                <div className="rounded bg-surface-container" style={{ height: '60%' }} />
              </div>
            </article>

            <article className="rounded-lg border border-outline-variant bg-surface p-6 dark:border-white/10 dark:bg-[#111d18]">
              <p className="text-sm font-medium text-on-surface-variant dark:text-content-dark/60">ROI Over Time</p>
              <div className="mt-6 h-52 rounded bg-gradient-to-t from-primary/10 to-primary/30" />
            </article>

            <article className="rounded-lg border border-outline-variant bg-surface p-6 dark:border-white/10 dark:bg-[#111d18]">
              <p className="text-sm font-medium text-on-surface-variant dark:text-content-dark/60">CO2 Reduction (tons)</p>
              <div className="mt-6 space-y-4">
                <div className="h-4 rounded bg-surface-container">
                  <div className="h-full w-[90%] rounded bg-primary/40" />
                </div>
                <div className="h-4 rounded bg-surface-container">
                  <div className="h-full w-[70%] rounded bg-primary/40" />
                </div>
                <div className="h-4 rounded bg-surface-container">
                  <div className="h-full w-[80%] rounded bg-primary/40" />
                </div>
              </div>
            </article>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-on-surface dark:text-content-dark">Understanding Your Results</h2>
          <p className="text-base text-on-surface-variant dark:text-content-dark/70">
            Your simulation indicates strong annual generation potential, competitive ROI, and significant
            emissions reduction. These insights help prioritize technologies with the best financial and
            environmental balance for your project.
          </p>
        </section>

        <div>
        <Link
          to="/simulador/nueva"
          className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
        >
          Run Another Simulation
        </Link>
        </div>
      </div>
    </section>
  )
}
