import type { DistributionSlice } from '../services/dashboardTypes'
import { formatKwh } from '../services/dashboardFormatters'
import { SimulationCard, SimulationStatusBadge } from '@/shared/components'

interface DistributionDonutProps {
  data: DistributionSlice[]
}

export function DistributionDonut({ data }: DistributionDonutProps) {
  const colors = [
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-2)',
  ]
  const total = data.reduce((sum, item) => sum + item.kwh, 0)
  const topSource = data.reduce<DistributionSlice | null>((leader, item) => {
    if (!leader || item.kwh > leader.kwh) return item
    return leader
  }, null)
  const topShare = topSource && total > 0 ? Math.round((topSource.kwh / total) * 100) : null

  return (
    <SimulationCard className="flex flex-col">
      <div className="mb-2.5 flex items-start justify-between  ">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-content-dark/78">
            Mezcla Operativa
          </p>
          <p className="mt-1 text-[11px] leading-4 text-slate-600 dark:text-content-dark/72">
            Participacion relativa de cada fuente dentro de la produccion consolidada.
          </p>
        </div>
        {data.length > 0 ? null : (
          <SimulationStatusBadge className="rounded-full px-3 py-1.5">
            Sin datos
          </SimulationStatusBadge>
        )}
      </div>

      {data.length > 0 ? (
        <div className="space-y-3 pt-4" role="img" aria-label="Energy distribution">
          <div className="rounded-xl border border-[#dde4dc] bg-[#fbfcfb] p-4 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-content-dark/74">Fuente dominante</p>
                <p className="mt-1 text-lg font-bold text-[#1c2a22] dark:text-content-dark">{topSource?.label ?? 'Sin mezcla'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-content-dark/74">Participacion</p>
                <p className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#1c2a22] dark:text-content-dark">{topShare !== null ? `${topShare}%` : '0%'}</p>
              </div>
            </div>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[#edf3ec] dark:bg-white/[0.05]">
              {data.map((item, index) => {
                const share = total > 0 ? (item.kwh / total) * 100 : 0

                return (
                  <div
                    key={item.label}
                    className="h-full"
                    style={{
                      width: `${share}%`,
                      backgroundColor: colors[index % colors.length],
                    }}
                    title={`${item.label}: ${Math.round(share)}%`}
                    aria-hidden="true"
                  />
                )
              })}
            </div>
          </div>

          <ul className="space-y-1.5">
            {data
              .map((item, index) => ({
                ...item,
                color: colors[index % colors.length],
                share: total > 0 ? Math.round((item.kwh / total) * 100) : 0,
              }))
              .sort((a, b) => b.kwh - a.kwh)
              .filter((item) => item.label !== topSource?.label)
              .map(({ label, kwh, share, color }) => (
                <li key={label} className="flex items-center justify-between rounded-lg border border-[#dde4dc] bg-[#fbfcfb] px-3 py-1.5 text-sm dark:border-white/10 dark:bg-white/[0.025]">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-medium text-slate-800 dark:text-content-dark/82">{label}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1c2a22] dark:text-content-dark">{share}%</p>
                    <p className="text-[11px] text-slate-600 dark:text-content-dark/72">{formatKwh(kwh)}</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ) : (
        <div className="mb-1 flex min-h-[120px] items-center justify-center text-sm text-slate-500 dark:text-content-dark/60">
          El backend todavIa no enviO distribuciOn de energIa.
        </div>
      )}
    </SimulationCard>
  )
}
