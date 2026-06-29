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
    <section className="grid grid-cols-1 gap-2.5 items-start h-auto xl:grid-cols-[0.95fr_1.25fr]">
      <SimulationCard density="compact" className="border-[#d7dfd6] bg-[#fcfdfb] dark:bg-[#16201d]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-content-dark/78">
          KPIs de Eficiencia
        </p>
        {metrics.length > 0 ? (
          <div className="mt-2.5 grid gap-2 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl border border-[#dde4dc] bg-[#f7faf7] p-3 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 dark:text-content-dark/78">{LABEL_ES[metric.label] ?? metric.label}</p>
                <p className="mt-1 truncate text-xl font-black leading-tight tracking-[-0.03em] text-[#193126] dark:text-content-dark">{metric.value}</p>
                <p className="mt-2 text-[11px] leading-4 text-slate-700 dark:text-content-dark/72">{metric.hint}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2.5 text-sm text-slate-500 dark:text-content-dark/60">
            El backend todavIa no enviO KPIs de eficiencia.
          </div>
        )}
      </SimulationCard>

      <SimulationCard density="compact" className="border-[#d7dfd6] bg-[#fcfdfb] dark:bg-[#16201d]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-content-dark/78">
          Objetivo vs Actual
        </p>
        {targetVsActual.length > 0 ? (
          <div className="mt-2.5 space-y-2">
            {targetVsActual.map((item) => {
              const hasReference = item.target > 0
              const rawRatio = hasReference ? (item.actual / item.target) * 100 : 0
              const ratio = Math.min(rawRatio, 100)
              const status = !hasReference ? 'Sin referencia' : rawRatio >= 105 ? 'Supera objetivo' : rawRatio >= 100 ? 'Cumple objetivo' : 'Debajo del objetivo'
              const toneClass = !hasReference ? 'bg-slate-300 dark:bg-white/20' : rawRatio >= 105 ? 'bg-emerald-500 dark:bg-emerald-400' : rawRatio >= 100 ? 'bg-[#0f6f45] dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-300'
              return (
                <div key={item.label} className="rounded-xl border border-[#dde4dc] bg-[#f7faf7] p-3 dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-start justify-between gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-[#274034] dark:text-content-dark">{LABEL_ES[item.label] ?? item.label}</p>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-content-dark/74">
                        {status}
                      </div>
                    </div>
                    <p className="text-right text-slate-700 dark:text-content-dark/78">
                      {formatTargetPair(item.actual, item.target, item.unit)}
                    </p>
                  </div>
                  <div className="mt-3 px-1">
                    <div className="h-2.5 rounded-full bg-slate-200/90 dark:bg-white/10">
                      <div
                        role="progressbar"
                        aria-label={`${LABEL_ES[item.label] ?? item.label}`}
                        aria-valuemin={0}
                        aria-valuemax={hasReference ? item.target : 100}
                        aria-valuenow={hasReference ? item.actual : 0}
                        aria-valuetext={hasReference ? formatTargetPair(item.actual, item.target, item.unit) : 'Sin referencia'}
                        className={`h-full rounded-full transition-all ${toneClass}`}
                        style={{ width: `${ratio}%` }}
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
