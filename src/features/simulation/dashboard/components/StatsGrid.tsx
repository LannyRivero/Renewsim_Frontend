import type { StatCard } from '../data/dashboardMock'

interface StatsGridProps {
  stats: StatCard[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon }) => (
        <article
          key={label}
          className="rounded-md border border-black/10 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-[#15241e]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">{label}</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900 dark:text-content-dark lg:text-2xl">{value}</p>
            </div>
            <div className="rounded-md border border-primary/20 bg-primary/10 p-2 dark:border-primary/30 dark:bg-primary/15">
              <span className="material-symbols-outlined text-lg text-primary dark:text-primary-inverse">
              {icon}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
