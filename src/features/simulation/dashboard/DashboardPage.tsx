import { useQuery } from '@tanstack/react-query'
import { StatsGrid } from './components/StatsGrid'
import { EnergyBarChart } from './components/EnergyBarChart'
import { DistributionDonut } from './components/DistributionDonut'
import { PerformanceSnapshot } from './components/PerformanceSnapshot'
import { SimulationPageShell, SimulationSectionHeader, SimulationStateMessage } from '@/shared/components'
import {
  DASHBOARD_STATS,
  EFFICIENCY_METRICS,
  ENERGY_BY_SOURCE,
  DISTRIBUTION,
  TARGET_VS_ACTUAL,
} from './data/dashboardMock'
import { getDashboardData } from './services/dashboardService'

export function DashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: getDashboardData,
    staleTime: 60_000,
  })

  const stats = data?.stats ?? DASHBOARD_STATS
  const efficiencyMetrics = data?.efficiencyMetrics ?? EFFICIENCY_METRICS
  const targetVsActual = data?.targetVsActual ?? TARGET_VS_ACTUAL
  const energyBySource = data?.energyBySource ?? ENERGY_BY_SOURCE
  const distribution = data?.distribution ?? DISTRIBUTION

  return (
    <SimulationPageShell>
      <div className="flex flex-col gap-2.5 lg:h-full">
        <SimulationSectionHeader
          eyebrow="Operations Overview"
          title="Energy Dashboard"
          description="Monitor generation, distribution, and source performance at a glance."
          className="md:items-end"
        />

        <StatsGrid stats={stats} />

        {isLoading ? <SimulationStateMessage>Loading dashboard data...</SimulationStateMessage> : null}
        {isError ? (
          <SimulationStateMessage tone="error">
            {error instanceof Error ? error.message : 'Could not load dashboard data.'}
          </SimulationStateMessage>
        ) : null}

        <PerformanceSnapshot
          metrics={efficiencyMetrics}
          targetVsActual={targetVsActual}
        />

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant dark:text-content-dark/70">
              Energy Summary
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/65 lg:hidden">
              Consolidated view by generation source and distribution weight.
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="min-h-0 lg:col-span-2">
              <EnergyBarChart data={energyBySource} />
            </div>
            <div className="min-h-0">
              <DistributionDonut data={distribution} />
            </div>
          </div>
        </div>
      </div>
    </SimulationPageShell>
  )
}
