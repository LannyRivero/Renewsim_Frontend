import type { StatCard } from '../data/dashboardMock'

interface StatsGridProps {
  stats: StatCard[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map(({ label, value, icon }) => (
        <article
          key={label}
          className="card rounded-xl p-6 flex items-start gap-4"
        >
          <div className="p-2.5 rounded-lg bg-primary-container/12 dark:bg-primary-container/15 shrink-0">
            <span className="material-symbols-outlined text-primary dark:text-primary-inverse text-xl">
              {icon}
            </span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant dark:text-content-dark/50">{label}</p>
            <p className="text-2xl font-extrabold text-on-surface dark:text-content-dark mt-0.5">
              {value}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
