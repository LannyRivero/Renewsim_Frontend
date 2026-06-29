import type { StatCard } from '../services/dashboardTypes'

function extractNumber(value: string) {
  const normalized = value.replace(/,/g, '').replace(/[^\d.-]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function getCardRead(label: string, value: string) {
  const numeric = extractNumber(value)

  if (label === 'Simulaciones totales' || label === 'Total Simulations') {
    return {
      status: numeric !== null && numeric > 0 ? 'Base activa' : 'Sin actividad',
      helper: 'Mide volumen disponible para sostener lectura operativa y tendencias del panel.',
    }
  }

  if (label === 'CO2 evitado' || label === 'CO2 Saved') {
    return {
      status: numeric !== null && numeric > 0 ? 'Impacto positivo' : 'Sin impacto',
      helper: 'Señal ambiental consolidada del portafolio operativo bajo medición.',
    }
  }

  if (label === 'ROI promedio' || label === 'Average ROI') {
    return {
      status: numeric !== null && numeric >= 8 ? 'Retorno sano' : 'Retorno débil',
      helper: 'Sirve para leer si el portafolio mantiene una banda de retorno defendible.',
    }
  }

  return {
    status: numeric !== null && numeric > 0 ? 'Producción activa' : 'Sin producción',
    helper: 'Lectura agregada de energía validada por backend en la ventana actual.',
  }
}

interface StatsGridProps {
  stats: StatCard[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon }) => {
        const read = getCardRead(label, value)

        return (
        <article
          key={label}
          className="rounded-[1rem] border border-[#d4ddd3] bg-[linear-gradient(180deg,rgba(244,247,243,0.96)_0%,rgba(238,243,237,0.94)_100%)] p-3 shadow-[0_16px_32px_-28px_rgba(89,103,92,0.16)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(21,36,30,0.94)_0%,rgba(18,31,26,0.9)_100%)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-content-dark/78">{label}</p>
              <p className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#193126] dark:text-content-dark lg:text-xl truncate">{value}</p>
              <div className="mt-2 inline-flex rounded-md border border-[#cfdacf] bg-[#f7faf6] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-content-dark/74">
                {read.status}
              </div>
              <p className="mt-2 text-[11px] leading-4 text-slate-600 dark:text-content-dark/72">{read.helper}</p>
            </div>
            <div className="rounded-2xl border border-[#d7dfd6] bg-[#f6f8f5] p-2 shadow-sm dark:border-white/10 dark:bg-white/8">
              <span className="material-symbols-outlined text-lg text-slate-700 dark:text-content-dark">
              {icon}
              </span>
            </div>
          </div>
        </article>
      )})}
    </div>
  )
}
