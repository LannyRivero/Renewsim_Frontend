import type { DistributionSlice, StatusDistributionSlice } from '../services/dashboardTypes'
import { formatKwh } from '../services/dashboardFormatters'
import { SimulationCard, SimulationStatusBadge } from '@/shared/components'

interface DistributionDonutProps {
  data: DistributionSlice[] | StatusDistributionSlice[]
  variant?: 'energy' | 'status'
}

function hasKwh(item: DistributionSlice | StatusDistributionSlice): item is DistributionSlice {
  return 'kwh' in item
}

export function DistributionDonut({ data, variant = 'energy' }: DistributionDonutProps) {
  const colors = [
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-2)',
  ]
  const normalizedData = data.map((item) => ({
    label: item.label,
    value: hasKwh(item) ? item.kwh : item.count,
    detail: hasKwh(item) ? formatKwh(item.kwh) : `${item.count}`,
  }))
  const total = normalizedData.reduce((sum, item) => sum + item.value, 0)
  const topSource = normalizedData.reduce<(typeof normalizedData)[number] | null>((leader, item) => {
    if (!leader || item.value > leader.value) return item
    return leader
  }, null)
  const topShare = topSource && total > 0 ? Math.round((topSource.value / total) * 100) : null

  return (
    <SimulationCard className="flex h-full min-h-[300px] flex-col rounded-sm">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-content-dark/78">
            {variant === 'status' ? 'Estado operativo' : 'Mezcla Operativa'}
          </p>
          <p className="mt-1 text-[1.9rem] font-black tracking-[-0.03em] text-[#193126] dark:text-content-dark lg:text-[1.45rem]">
            {topShare !== null ? `${topShare}%` : '0%'}
          </p>
          <p className="mt-1 text-[11px] leading-4 text-slate-600 dark:text-content-dark/72">
            {topSource
              ? variant === 'status'
                ? `Estado dominante: ${topSource.label}.`
                : `Fuente dominante: ${topSource.label}.`
              : variant === 'status'
                ? 'Distribución relativa de simulaciones por estado.'
                : 'Participación relativa de cada fuente dentro de la producción consolidada.'}
          </p>
        </div>
        {data.length > 0 ? null : (
          <SimulationStatusBadge className="rounded-full px-3 py-1.5">
            Sin datos
          </SimulationStatusBadge>
        )}
      </div>

      {data.length > 0 ? (
        <div className="flex h-full flex-col space-y-3 pt-3" role="img" aria-label="Energy distribution">
          <div className="rounded-sm border border-[#dde4dc] bg-[#fbfcfb] p-4 dark:border-white/10 dark:bg-white/[0.025]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-content-dark/74">{variant === 'status' ? 'Estado dominante' : 'Fuente dominante'}</p>
                <p className="mt-1 text-lg font-bold text-[#1c2a22] dark:text-content-dark">{topSource?.label ?? 'Sin mezcla'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:text-content-dark/74">{variant === 'status' ? 'Cantidad' : 'Participacion'}</p>
                <p className="mt-1 text-lg font-bold text-[#1c2a22] dark:text-content-dark">{topSource ? topSource.detail : variant === 'status' ? '0' : '0 kWh'}</p>
              </div>
            </div>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[#edf3ec] dark:bg-white/[0.05]">
              {normalizedData.map((item, index) => {
                const share = total > 0 ? (item.value / total) * 100 : 0

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
              {normalizedData
                .map((item, index) => ({
                  ...item,
                  color: colors[index % colors.length],
                  share: total > 0 ? Math.round((item.value / total) * 100) : 0,
                }))
                .sort((a, b) => b.value - a.value)
                .filter((item) => item.label !== topSource?.label)
                .map(({ label, detail, share, color }) => (
                  <li key={label} className="flex items-center justify-between rounded-sm border border-[#dde4dc] bg-[#fbfcfb] px-3 py-2 text-sm dark:border-white/10 dark:bg-white/[0.025]">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-medium text-slate-800 dark:text-content-dark/82">{label}</span>
                  </div>
                  <div className="text-right">
                      <p className="font-semibold text-[#1c2a22] dark:text-content-dark">{share}%</p>
                      <p className="text-[11px] text-slate-600 dark:text-content-dark/72">{detail}</p>
                    </div>
                  </li>
                ))}
          </ul>
        </div>
      ) : (
        <div className="mb-1 flex min-h-[120px] flex-1 items-center justify-center text-sm text-slate-500 dark:text-content-dark/60">
          {variant === 'status' ? 'El backend todavía no envió distribución por estado.' : 'El backend todavIa no enviO distribuciOn de energIa.'}
        </div>
      )}
    </SimulationCard>
  )
}
