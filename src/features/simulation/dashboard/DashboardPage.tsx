import { useQuery } from '@tanstack/react-query'
import { Activity, Info } from 'lucide-react'
import { StatsGrid } from './components/StatsGrid'
import { EnergyBarChart } from './components/EnergyBarChart'
import { DistributionDonut } from './components/DistributionDonut'
import { PerformanceSnapshot } from './components/PerformanceSnapshot'
import { SimulationPageShell, SimulationSectionHeader, SimulationStatusBadge } from '@/shared/components'
import {
  DASHBOARD_STATS,
  EFFICIENCY_METRICS,
  ENERGY_BY_SOURCE,
  DISTRIBUTION,
  TARGET_VS_ACTUAL,
} from './data/dashboardMock'
import { getDashboardData } from './services/dashboardService'

export function DashboardPage() {
  const { data, isError, error } = useQuery({
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
    <SimulationPageShell contentClassName="p-4 sm:p-4 lg:h-full lg:p-4">
      <div className="flex flex-col gap-1.5 lg:h-full">
        <SimulationSectionHeader
          eyebrow="Comando de Operaciones"
          eyebrowIcon={<Activity className="h-3.5 w-3.5" />}
          title="Panel de Energía"
          description="Salud de la generación, mezcla de fuentes y rendimiento objetivo en una vista operativa."
          className="gap-2 md:items-end"
        />

        <StatsGrid stats={stats} />

        {isError && !data ? (
          <div>
            <SimulationStatusBadge tone="neutral" className="gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium">
              <Info className="h-3.5 w-3.5" />
              {error instanceof Error ? 'Se muestran los datos de vista previa mientras el servicio del panel en vivo no está disponible.' : 'Se muestran los datos de vista previa mientras el servicio del panel en vivo no está disponible.'}
            </SimulationStatusBadge>
          </div>
        ) : null}

        <PerformanceSnapshot
          metrics={efficiencyMetrics}
          targetVsActual={targetVsActual}
        />

        <div className="flex min-h-0 flex-[1.15] flex-col">
          <div className="mb-0.5">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/70">
              Resumen de Energía
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-content-dark/65 lg:hidden">
              Vista consolidada por fuente de generación y peso de distribución.
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
            <div className="min-h-0">
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
