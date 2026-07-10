import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { SimulationActionButton, SimulationCard } from '@/shared/components'
import type { DetailPlaceholderContent, DetailSectionContent } from './simulationDetailsViewModel'
import { MetricTile } from './SimulationDetailsMetricTile'

function ExpandableSectionShell({
  eyebrow,
  title,
  summary,
  isOpen,
  onToggle,
  children,
}: {
  eyebrow: string
  title: string
  summary?: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <SimulationCard className="border-[#d7dfd6] bg-white p-4 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.55)] dark:border-white/10 dark:bg-[#16201d] lg:p-5">
      <SimulationActionButton
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        variant="soft"
        className="w-full items-start justify-between gap-4 text-left px-4 py-2.5"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-content-dark/55">{eyebrow}</p>
          <h3 className="mt-2 text-[1.25rem] font-bold tracking-[-0.03em] text-[#16231c] dark:text-content-dark">{title}</h3>
          {summary ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/60">{summary}</p> : null}
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-[#dce3de] bg-[#f7faf8] px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-[0_10px_22px_-20px_rgba(15,23,42,0.24)] transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/62">
          {isOpen ? 'Ocultar sección' : 'Mostrar sección'}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </SimulationActionButton>

      {isOpen ? <div className="mt-4 border-t border-[#e3e9e4] pt-4 dark:border-white/8">{children}</div> : null}
    </SimulationCard>
  )
}

export function FinancialCommandCenter({ content, isOpen, onToggle }: { content: DetailSectionContent; isOpen: boolean; onToggle: () => void }) {
  return (
    <ExpandableSectionShell eyebrow={content.sectionLabel} title={content.title} summary={content.summary} isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <div className="rounded-full border border-[#dce3de] bg-[#f7faf8] px-3 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/62">
            Lectura financiera priorizada
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          {content.primaryMetrics.map((metric) => (
            <MetricTile key={`${metric.label}-${metric.value}`} metric={metric} variant="financial-primary" />
          ))}
        </div>
        {content.supportingMetrics?.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {content.supportingMetrics.map((metric) => (
              <MetricTile key={`${metric.label}-${metric.value}`} metric={metric} variant="financial-secondary" />
            ))}
          </div>
        ) : null}
      </div>
    </ExpandableSectionShell>
  )
}

export function ClimateCompactBar({ content, isOpen, onToggle }: { content: DetailSectionContent; isOpen: boolean; onToggle: () => void }) {
  return (
    <ExpandableSectionShell eyebrow={content.sectionLabel} title={content.title} summary={content.summary} isOpen={isOpen} onToggle={onToggle}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {content.primaryMetrics.map((metric) => (
            <div key={metric.label} className="rounded-md border border-[#dce4df] bg-white/85 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/55">{metric.label}</p>
              <p className="mt-1 text-sm font-semibold text-[#1b2922] dark:text-content-dark">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
      {content.supportingMetrics?.length ? (
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#e5ebe7] pt-3 text-xs text-slate-600 dark:border-white/8 dark:text-content-dark/60">
          {content.supportingMetrics.slice(0, 3).map((metric) => (
            <span key={metric.label}><span className="font-semibold text-slate-500 dark:text-content-dark/55">{metric.label}:</span> {metric.value}</span>
          ))}
        </div>
      ) : null}
    </ExpandableSectionShell>
  )
}

export function ComparisonCompactNote({ content, isOpen, onToggle }: { content: DetailPlaceholderContent; isOpen: boolean; onToggle: () => void }) {
  return (
    <ExpandableSectionShell eyebrow={content.sectionLabel} title={content.title} summary={content.description} isOpen={isOpen} onToggle={onToggle}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="rounded-full border border-dashed border-[#cad6cf] px-3 py-1 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:text-content-dark/55">
          Módulo en expansión
        </div>
      </div>
    </ExpandableSectionShell>
  )
}
