import { SimulationCard } from '@/shared/components'
import type { ReactNode } from 'react'
import type { DetailMetric, DetailPlaceholderContent, DetailSectionContent } from './simulationDetailsViewModel'

function DetailMetricItem({ metric }: { metric: DetailMetric }) {
  return (
    <div className="rounded-[0.75rem] border border-[#dde4dc] bg-[#fbfcfb] px-4 py-3 dark:border-white/10 dark:bg-white/[0.025]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">{metric.label}</p>
      <p className="mt-1 text-[1.1rem] font-bold tracking-[-0.02em] text-[#1c2a22] dark:text-content-dark">{metric.value}</p>
      {metric.helper ? <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-content-dark/65">{metric.helper}</p> : null}
    </div>
  )
}

export function SimulationDetailSectionFrame({
  content,
  contextLabel,
  children,
}: {
  content: Pick<DetailSectionContent, 'sectionLabel' | 'title' | 'summary'>
  contextLabel?: string
  children: ReactNode
}) {
  return (
    <SimulationCard className="border-[#d7dfd6] bg-white p-4 dark:border-white/10 dark:bg-[#16201d]">
      <div className="space-y-4">
        <div>
          <p className="inline-flex rounded-md border border-[#dde4dc] bg-[#f7f9f6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/60">
            {content.sectionLabel}
          </p>
          {contextLabel ? <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">{contextLabel}</p> : null}
          <h2 className="mt-2.5 text-[1.45rem] font-bold tracking-[-0.025em] text-[#1c2a22] dark:text-content-dark">{content.title}</h2>
          {content.summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">{content.summary}</p> : null}
        </div>
        {children}
      </div>
    </SimulationCard>
  )
}

export function SimulationDetailPrimaryMetrics({ metrics }: { metrics: DetailMetric[] }) {
  return (
    <section className="space-y-2" aria-label="Indicadores principales">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">Indicadores principales</h3>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <DetailMetricItem key={`${metric.label}-${metric.value}`} metric={metric} />
        ))}
      </div>
    </section>
  )
}

export function SimulationDetailSupportingMetrics({ metrics }: { metrics: DetailMetric[] }) {
  return (
    <section className="space-y-2" aria-label="Detalles complementarios">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">Detalles complementarios</h3>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <DetailMetricItem key={`${metric.label}-${metric.value}`} metric={metric} />
        ))}
      </div>
    </section>
  )
}

export function SimulationDetailPlaceholder({ content }: { content: DetailPlaceholderContent }) {
  return (
    <SimulationDetailSectionFrame content={content}>
      <div className="rounded-[0.75rem] border border-dashed border-[#d8dfd7] bg-[#fbfcfb] p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.025] dark:text-content-dark/65">
        {content.description}
      </div>
    </SimulationDetailSectionFrame>
  )
}
