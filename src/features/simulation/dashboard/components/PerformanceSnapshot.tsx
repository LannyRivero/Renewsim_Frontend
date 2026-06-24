import type { EfficiencyMetric, TargetVsActual } from '../services/dashboardTypes'
import { formatTargetPair } from '../services/dashboardFormatters'
import { SimulationCard } from '@/shared/components'

const LABEL_ES: Record<string, string> = {
  'Capacity factor': 'Factor de capacidad',
  'Specific yield': 'Rendimiento específico',
  'Positive ROI': 'ROI positivo',
  'Cost per kWh': 'Costo por kWh',
  'Grid availability': 'Disponibilidad de red',
  'Energy output': 'Producción energética',
  'CO2 reduction': 'Reducción de CO₂',
  'ROI': 'ROI',
}

interface PerformanceSnapshotProps {
  metrics: EfficiencyMetric[]
  targetVsActual: TargetVsActual[]
}

export function PerformanceSnapshot({ metrics, targetVsActual }: PerformanceSnapshotProps) {
  return (
    <section className="grid grid-cols-1 gap-2.5 items-start h-auto xl:grid-cols-[1fr_1.2fr]">
      <SimulationCard density="compact">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-content-dark/55">
          KPIs de Eficiencia
        </p>
        {metrics.length > 0 ? (
          <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-[#eef3ed] p-2 dark:bg-white/[0.045]">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-content-dark/55">{LABEL_ES[metric.label] ?? metric.label}</p>
                <p className="mt-1 truncate text-xl font-black leading-tight tracking-[-0.03em] text-[#193126] dark:text-content-dark">{metric.value}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-600 dark:text-content-dark/65 lg:hidden">{metric.hint}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2.5 text-sm text-slate-500 dark:text-content-dark/60">
            El backend todavIa no enviO KPIs de eficiencia.
          </div>
        )}
      </SimulationCard>

      <SimulationCard density="compact">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-content-dark/55">
          Objetivo vs Actual
        </p>
        {targetVsActual.length > 0 ? (
          <div className="mt-2.5 space-y-1.5">
            {targetVsActual.map((item) => {
              const ratio = item.target > 0 ? Math.min((item.actual / item.target) * 100, 100) : 0
              return (
                <div key={item.label} className="rounded-xl bg-[#eef3ed] p-2 dark:bg-white/[0.045]">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <p className="font-semibold text-[#274034] dark:text-content-dark">{LABEL_ES[item.label] ?? item.label}</p>
                    <p className="text-slate-600 dark:text-content-dark/70">
                      {formatTargetPair(item.actual, item.target, item.unit)}
                    </p>
                  </div>
                  <div className="mt-2 px-1">
                    <div className="h-2 rounded-full bg-slate-200/90 dark:bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#0f6f45] transition-all dark:bg-emerald-400"
                        style={{ width: `${ratio}%` }}
                        aria-label={`${item.label} progress`}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mt-2.5 text-sm text-slate-500 dark:text-content-dark/60">
            El backend todavIa no enviO objetivos comparables.
          </div>
        )}
      </SimulationCard>
    </section>
  )
}
