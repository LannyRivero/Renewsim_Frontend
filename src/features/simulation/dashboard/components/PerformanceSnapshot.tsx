import type { EfficiencyMetric, TargetVsActual } from '../data/dashboardMock'
import { SimulationCard } from '@/shared/components'

interface PerformanceSnapshotProps {
  metrics: EfficiencyMetric[]
  targetVsActual: TargetVsActual[]
}

export function PerformanceSnapshot({ metrics, targetVsActual }: PerformanceSnapshotProps) {
  return (
    <section className="grid grid-cols-1 gap-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <SimulationCard density="compact">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-content-dark/70">
          Efficiency KPIs
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md bg-slate-50/60 p-2 dark:bg-white/5">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-content-dark/70">{metric.label}</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-content-dark">{metric.value}</p>
              <p className="mt-1 text-xs text-slate-600 dark:text-content-dark/65 xl:hidden">{metric.hint}</p>
            </div>
          ))}
        </div>
      </SimulationCard>

      <SimulationCard density="compact">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-content-dark/70">
          Target vs Actual
        </p>
        <div className="mt-2 space-y-1.5">
          {targetVsActual.map((item) => {
            const ratio = item.target > 0 ? Math.min((item.actual / item.target) * 100, 100) : 0
            return (
              <div key={item.label} className="rounded-md bg-slate-50/60 p-2 dark:bg-white/5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <p className="font-semibold text-slate-900 dark:text-content-dark">{item.label}</p>
                  <p className="text-slate-600 dark:text-content-dark/70">
                    {item.actual.toLocaleString('en-US')} / {item.target.toLocaleString('en-US')} {item.unit}
                  </p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary/70 transition-all dark:bg-primary/60"
                    style={{ width: `${ratio}%` }}
                    aria-label={`${item.label} progress`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </SimulationCard>
    </section>
  )
}
