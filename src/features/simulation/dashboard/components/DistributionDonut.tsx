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
    <SimulationCard className="flex h-full flex-col">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-content-dark/70">
            Distribution
          </p>
        </div>
        <SimulationStatusBadge icon={<span className="material-symbols-outlined text-base">trending_up</span>}>
          +5%
        </SimulationStatusBadge>
      </div>

      {/* Chart + center label */}
      <div
        className="relative flex min-h-[118px] flex-1 items-center justify-center lg:min-h-[132px]"
        role="img"
        aria-label="Energy distribution"
      >
        <Doughnut data={chartData} options={options as never} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-500 dark:text-content-dark/65">
            sources
          </span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-content-dark lg:text-2xl">
            {data.length}
          </span>
        </div>
      </div>

      {/* Custom legend */}
      <ul className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5">
        {data.map(({ label, kwh }, i) => (
          <li key={label} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
              <span className="text-slate-600 dark:text-content-dark/70">
                {label}
              </span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-content-dark">
              {formatKwh(kwh)}
            </span>
          </li>
        ))}
      </ul>
    </SimulationCard>
  )
}
