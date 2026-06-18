import type { StatCard } from '../services/dashboardTypes'

interface StatsGridProps {
  stats: StatCard[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon }, index) => (
        <article
          key={label}
          className="rounded-[1rem] border border-[#d4ddd3] bg-[linear-gradient(180deg,rgba(244,247,243,0.96)_0%,rgba(238,243,237,0.94)_100%)] p-3 shadow-[0_16px_32px_-28px_rgba(89,103,92,0.16)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(21,36,30,0.94)_0%,rgba(18,31,26,0.9)_100%)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-content-dark/55">{label}</p>
              <p className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#193126] dark:text-content-dark lg:text-xl truncate">{value}</p>
              <p className="mt-1.5 text-[10px] leading-4 text-slate-500 dark:text-content-dark/55 lg:hidden">{index % 2 === 0 ? 'Resumen operativo actual' : 'Actualizado con datos confirmados por backend'}</p>
            </div>
            <div className="rounded-2xl border border-[#d7dfd6] bg-[#f6f8f5] p-2 shadow-sm dark:border-white/10 dark:bg-white/8">
              <span className="material-symbols-outlined text-lg text-slate-700 dark:text-content-dark">
              {icon}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
