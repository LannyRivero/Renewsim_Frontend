import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { DistributionSlice } from '../data/dashboardMock'

ChartJS.register(ArcElement, Tooltip, Legend)

// Green palette: primary at different opacities
const COLORS = [
  'rgba(29, 201, 98, 0.85)',
  'rgba(29, 201, 98, 0.60)',
  'rgba(29, 201, 98, 0.38)',
  'rgba(29, 201, 98, 0.20)',
]

interface DistributionDonutProps {
  data: DistributionSlice[]
}

export function DistributionDonut({ data }: DistributionDonutProps) {
  const chartData = {
    labels: data.map((s) => s.label),
    datasets: [
      {
        data: data.map((s) => s.kwh),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: COLORS.slice(0, data.length).map((c) =>
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
            `${ctx.label}: ${ctx.parsed.toLocaleString('es-ES')} kWh`,
        },
      },
    },
  }

  return (
    <div className="card rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-on-surface dark:text-content-dark">
            Distribución
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-primary dark:text-primary-inverse">
          <span className="material-symbols-outlined text-base">trending_up</span>
          +5%
        </div>
      </div>

      {/* Chart + center label */}
      <div
        className="relative h-44 flex justify-center items-center"
        role="img"
        aria-label="Distribución de energía"
      >
        <Doughnut data={chartData} options={options as never} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-on-surface-variant dark:text-content-dark/50">
            fuentes
          </span>
          <span className="text-2xl font-extrabold text-on-surface dark:text-content-dark">
            {data.length}
          </span>
        </div>
      </div>

      {/* Custom legend */}
      <ul className="mt-4 flex flex-col gap-1.5">
        {data.map(({ label, kwh }, i) => (
          <li key={label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-on-surface-variant dark:text-content-dark/60">
                {label}
              </span>
            </div>
            <span className="font-semibold text-on-surface dark:text-content-dark">
              {kwh.toLocaleString('es-ES')} kWh
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
