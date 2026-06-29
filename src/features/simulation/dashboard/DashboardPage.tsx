import { useQuery } from '@tanstack/react-query'
import { Activity, Info } from 'lucide-react'
import { StatsGrid } from './components/StatsGrid'
import { EnergyBarChart } from './components/EnergyBarChart'
import { DistributionDonut } from './components/DistributionDonut'
import { PerformanceSnapshot } from './components/PerformanceSnapshot'
import { SimulationPageContent, SimulationPageShell, SimulationSectionHeader, SimulationStatusBadge } from '@/shared/components'
import { getDashboardData } from './services/dashboardService'
import type { DashboardData } from './services/dashboardTypes'

const EMPTY_DASHBOARD_DATA: DashboardData = {
  stats: [
    { label: 'Simulaciones totales', value: '0', icon: 'insights' },
    { label: 'CO2 evitado', value: 'N/D', icon: 'eco' },
    { label: 'ROI promedio', value: 'N/D', icon: 'trending_up' },
    { label: 'Energía generada', value: 'N/D', icon: 'bolt' },
  ],
  energyBySource: [],
  distribution: [],
  efficiencyMetrics: [],
  targetVsActual: [],
}

export function DashboardPage() {
  const { data, isError, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: getDashboardData,
    staleTime: 60_000,
  })

  const stats = data?.stats ?? EMPTY_DASHBOARD_DATA.stats
  const efficiencyMetrics = data?.efficiencyMetrics ?? EMPTY_DASHBOARD_DATA.efficiencyMetrics
  const targetVsActual = data?.targetVsActual ?? EMPTY_DASHBOARD_DATA.targetVsActual
  const energyBySource = data?.energyBySource ?? EMPTY_DASHBOARD_DATA.energyBySource
  const distribution = data?.distribution ?? EMPTY_DASHBOARD_DATA.distribution

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="px-4 py-4 sm:px-5 sm:py-5 lg:h-auto lg:px-5 lg:py-5" bodyClassName="lg:h-auto">
      <SimulationPageContent spacing="compact" className="lg:h-auto">
        <SimulationSectionHeader
          eyebrow="Comando de Operaciones"
          eyebrowIcon={<Activity className="h-3.5 w-3.5" />}
          title="Panel operativo"
          description="Salud de la generación, mezcla de fuentes y rendimiento objetivo en una vista operativa."
          className="gap-2 md:items-end"
        />

        <StatsGrid stats={stats} />

        {isError && !data ? (
          <div>
            <SimulationStatusBadge tone="neutral" className="gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium">
              <Info className="h-3.5 w-3.5" />
              {error instanceof Error ? 'No se pudo cargar el panel desde backend.' : 'No se pudo cargar el panel desde backend.'}
            </SimulationStatusBadge>
          </div>
        ) : null}

        <div className="flex min-h-0 flex-col gap-3">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-content-dark/78">
              Resumen de Energía
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">
              Vista consolidada por fuente de generación y peso de distribución.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
            <div>
              <EnergyBarChart data={energyBySource} />
            </div>
            <div>
              <DistributionDonut data={distribution} />
            </div>
          </div>
        </div>

        <PerformanceSnapshot
          metrics={efficiencyMetrics}
          targetVsActual={targetVsActual}
        />
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
