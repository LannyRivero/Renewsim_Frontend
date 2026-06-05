import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { DistributionSlice } from '../data/dashboardMock'
import { formatKwh } from '../services/dashboardFormatters'
import { SimulationCard, SimulationStatusBadge } from '@/shared/components'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DistributionDonutProps {
  data: DistributionSlice[]
}

export function DistributionDonut({ data }: DistributionDonutProps) {
  const styles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
  const colors = [
    styles?.getPropertyValue('--chart-3').trim() || 'rgba(29,201,98,0.45)',
    styles?.getPropertyValue('--chart-4').trim() || 'rgba(29,201,98,0.25)',
    styles?.getPropertyValue('--chart-5').trim() || 'rgba(29,201,98,0.12)',
    styles?.getPropertyValue('--chart-4').trim() || 'rgba(29,201,98,0.25)',
  ]

  const chartData = {
    labels: data.map((s) => s.label),
    datasets: [
      {
        data: data.map((s) => s.kwh),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length).map((c) =>
          c.replace(/[\d.]+\)$/, '1)'),
        ),
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; parsed: number }) =>
            `${ctx.label}: ${formatKwh(ctx.parsed)}`,
        },
      },
    },
  }

  return (
    <SimulationCard className="flex h-full min-h-0 flex-col">
      <div className="mb-2.5 flex items-start justify-between  ">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-content-dark/55">
            Distribución de Energía
          </p>
          <p className="mt-1 text-[11px] leading-4 text-slate-500 dark:text-content-dark/60 lg:hidden">Participación relativa de la producción en la mezcla de energías renovables activas.</p>
        </div>
        <SimulationStatusBadge className="rounded-full px-3 py-1.5" icon={<span className="material-symbols-outlined text-base">trending_up</span>}>
          +5%
        </SimulationStatusBadge>
      </div>

      {/* Chart + center label */}
      <div
        className="relative mb-1 flex min-h-[110px] flex-1 items-center justify-center lg:min-h-[150px]"
        role="img"
        aria-label="Energy distribution"
      >
        <Doughnut data={chartData} options={options as never} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400 dark:text-content-dark/55">
            fuente(s)
          </span>
          <span className="text-[1.7rem] font-black tracking-[-0.03em] text-[#193126] dark:text-content-dark lg:text-[1.4rem]">
            {data.length}
          </span>
        </div>
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5">
        {data.map(({ label, kwh }, i) => (
          <li key={label} className="flex items-center justify-between rounded-lg bg-[#eef3ed] px-2 py-1 text-[10px] dark:bg-white/[0.045]">
            <div className="flex items-center gap-1">
                <span
                  className="size-1 rounded-full shrink-0"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
              <span className="text-slate-600 dark:text-content-dark/70">
                {label}
              </span>
            </div>
            <span className="font-semibold text-[#274034] dark:text-content-dark/90">
              {formatKwh(kwh)}
            </span>
          </li>
        ))}
      </ul>
    </SimulationCard>
  )
}
