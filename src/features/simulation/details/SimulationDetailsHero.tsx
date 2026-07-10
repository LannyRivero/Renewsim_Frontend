import { MapPin, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { SimulationCard, SimulationStatusBadge } from '@/shared/components'
import type { DetailMetric } from './simulationDetailsViewModel'
import { MetricTile } from './SimulationDetailsMetricTile'

function getDecisionTone(status: string) {
  const normalized = status.trim().toLowerCase()

  if (normalized === 'recomendado') {
    return {
      badge: 'success' as const,
      shell: 'border-emerald-200/70 bg-[linear-gradient(135deg,rgba(244,252,248,0.98)_0%,rgba(255,255,255,0.96)_52%,rgba(246,251,248,0.98)_100%)] dark:border-emerald-400/20 dark:bg-[linear-gradient(135deg,rgba(18,33,27,0.98)_0%,rgba(22,32,29,0.96)_52%,rgba(17,27,24,0.98)_100%)]',
      accent: 'text-emerald-700 dark:text-emerald-300',
    }
  }
  if (normalized === 'no recomendado') {
    return {
      badge: 'neutral' as const,
      shell: 'border-rose-200/70 bg-[linear-gradient(135deg,rgba(254,247,248,0.98)_0%,rgba(255,255,255,0.96)_52%,rgba(252,246,247,0.98)_100%)] dark:border-rose-400/20 dark:bg-[linear-gradient(135deg,rgba(31,21,24,0.98)_0%,rgba(22,32,29,0.96)_52%,rgba(27,20,23,0.98)_100%)]',
      accent: 'text-rose-700 dark:text-rose-300',
    }
  }
  return {
    badge: 'neutral' as const,
    shell: 'border-amber-200/70 bg-[linear-gradient(135deg,rgba(255,250,242,0.98)_0%,rgba(255,255,255,0.96)_52%,rgba(253,249,243,0.98)_100%)] dark:border-amber-300/20 dark:bg-[linear-gradient(135deg,rgba(35,29,20,0.98)_0%,rgba(22,32,29,0.96)_52%,rgba(28,24,19,0.98)_100%)]',
    accent: 'text-amber-700 dark:text-amber-300',
  }
}

export function ExecutiveDecisionHero({
  pageTitle,
  pageDescription,
  action,
  simulationName,
  location,
  date,
  energyType,
  decisionStatus,
  decisionHeadline,
  keyMetrics,
  decisionDrivers,
}: {
  pageTitle: string
  pageDescription: string
  action?: ReactNode
  simulationName: string
  location: string
  date: string
  energyType: string
  decisionStatus: string
  decisionHeadline: string
  keyMetrics: DetailMetric[]
  decisionDrivers: string[]
}) {
  const tone = getDecisionTone(decisionStatus)

  return (
    <SimulationCard className={`overflow-hidden border p-0 shadow-[0_36px_90px_-54px_rgba(15,23,42,0.38)] ${tone.shell}`}>
      <div className="border-b border-[#dbe4df] px-5 py-3.5 dark:border-white/10 xl:px-6 xl:py-4">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/55">Centro de decisión</p>
            <h1 className="mt-2 text-[1.9rem] font-bold tracking-[-0.04em] text-[#15211b] dark:text-content-dark lg:text-[2.2rem]">{pageTitle}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/62">{pageDescription}</p>
          </div>
          {action ? <div className="w-full lg:w-auto">{action}</div> : null}
        </div>
      </div>
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
        <div className="border-b border-[#dbe4df] p-4 dark:border-white/10 xl:border-r xl:border-b-0 xl:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <SimulationStatusBadge tone={tone.badge} className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]">Estado de decisión</SimulationStatusBadge>
          </div>
          <div className="mt-4 space-y-2.5">
            <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-[#15211b] dark:text-content-dark lg:text-[2.35rem]">{simulationName}</h2>
            <p className={`max-w-4xl text-[1.2rem] font-semibold tracking-[-0.025em] leading-8 lg:text-[1.35rem] lg:leading-9 ${tone.accent}`}>{decisionHeadline}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-content-dark/62">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{location}</span>
            <span>{energyType}</span>
            {date !== 'N/A' ? <span>{date}</span> : null}
          </div>
          {decisionDrivers.length ? (
            <div className="mt-5 grid gap-2.5 md:grid-cols-3">
              {decisionDrivers.slice(0, 3).map((driver, index) => (
                <div key={`${driver}-${index}`} className="border-l-2 border-[#d7dfd8] pl-4 pr-2 py-1 transition-all duration-200 hover:border-[#c2cec6] hover:translate-x-0.5 dark:border-white/10 dark:hover:border-white/20">
                  <span className="inline-flex items-center rounded-full border border-[#d7dfd8] bg-white/72 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-[0_10px_24px_-20px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/[0.05] dark:text-content-dark/65">Factor {index + 1}</span>
                  <p className="mt-2 text-[0.96rem] leading-7 text-slate-700 dark:text-content-dark/70">{driver}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="border-t border-white/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),rgba(255,255,255,0.36))] p-4 backdrop-blur-[3px] dark:border-white/6 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] xl:border-t-0 xl:p-5">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/50"><TrendingUp className="h-3.5 w-3.5" />Indicadores clave para comité</div>
          <div className="mt-3.5 grid gap-2">
            {keyMetrics.map((metric) => <MetricTile key={`${metric.label}-${metric.value}`} metric={metric} variant="hero-subtle" />)}
          </div>
        </div>
      </div>
    </SimulationCard>
  )
}

export function ExecutiveInsightGrid({ metrics }: { metrics: DetailMetric[] }) {
  const icons = [ShieldAlert, TrendingUp, Sparkles]
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {metrics.map((metric, index) => {
        const Icon = icons[index] ?? Sparkles
        return (
          <SimulationCard key={`${metric.label}-${metric.value}`} className="border-[#dae2dd] bg-white p-4 shadow-[0_20px_50px_-42px_rgba(15,23,42,0.5)] dark:border-white/10 dark:bg-[#17211d]">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md border border-[#dce4df] bg-[#f7faf8] p-2 text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/70"><Icon className="h-4 w-4" /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/55">{metric.label}</p>
                {metric.label === 'Próximo paso' && metric.value.startsWith('Pasar') ? <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-content-dark/45">Siguiente</p> : null}
                <p className="mt-2 text-[1.05rem] font-semibold leading-7 text-[#1b2922] dark:text-content-dark">{metric.value}</p>
                {metric.helper ? <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-content-dark/60">{metric.helper}</p> : null}
              </div>
            </div>
          </SimulationCard>
        )
      })}
    </div>
  )
}
