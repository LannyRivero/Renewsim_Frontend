import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts'
import { SimulationCard } from '@/shared/components'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  SimulationDetailPlaceholder,
  SimulationDetailPrimaryMetrics,
  SimulationDetailSectionFrame,
  SimulationDetailSupportingMetrics,
} from './SimulationDetailsSectionPrimitives'
import type { DetailChartDatum, DetailPlaceholderContent, DetailSectionContent } from './simulationDetailsViewModel'

export function SimulationDetailSectionCard({
  content,
  contextLabel,
}: {
  content: DetailSectionContent
  contextLabel?: string
}) {
  return (
    <SimulationDetailSectionFrame content={content} contextLabel={contextLabel}>
      <SimulationDetailPrimaryMetrics metrics={content.primaryMetrics} />
      {content.supportingMetrics?.length ? <SimulationDetailSupportingMetrics metrics={content.supportingMetrics} /> : null}
    </SimulationDetailSectionFrame>
  )
}

export function SimulationOverviewCard({ content }: { content: DetailSectionContent }) {
  return <SimulationDetailSectionCard content={content} contextLabel="Lectura ejecutiva del escenario" />
}

export function SimulationExecutiveSummaryGrid({ content }: { content: DetailSectionContent }) {
  return <SimulationDetailSectionCard content={content} />
}

export function SimulationComparisonPositionCard({ content }: { content: DetailSectionContent }) {
  return <SimulationDetailSectionCard content={content} contextLabel="Baseline para contraste" />
}

export function SimulationFinancialSnapshot({ content }: { content: DetailSectionContent }) {
  return <SimulationDetailSectionCard content={content} contextLabel="Defensa economica del escenario" />
}

function formatCurrencyValue(value: number | string | undefined) {
  return `$${Math.round(Number(value ?? 0)).toLocaleString('en-US')}`
}

function FinancialMiniChart({
  title,
  description,
  data,
}: {
  title: string
  description: string
  data: DetailChartDatum[]
}) {
  return (
    <div className="rounded-[0.75rem] border border-[#dde4dc] bg-[#fbfcfb] p-4 dark:border-white/10 dark:bg-white/[0.025]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">{title}</p>
      <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-content-dark/65">{description}</p>

      <div className="mt-4 h-[180px]" role="img" aria-label={title}>
        <ChartContainer className="h-[180px]">
          <BarChart width={520} height={180} data={data} layout="vertical" margin={{ top: 2, right: 8, left: 8, bottom: 2 }} accessibilityLayer>
            <CartesianGrid horizontal stroke="rgba(15,23,42,0.06)" vertical={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Manrope' }}
              tickFormatter={(value) => formatCurrencyValue(value)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={96}
              tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Manrope' }}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrencyValue(value)} />} />
            <Bar dataKey="value" radius={6} maxBarSize={18}>
              {data.map((item) => (
                <Cell key={item.label} fill={`var(--color-${item.tone})`} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}

export function SimulationFinancialSignalChart({ data }: { data: DetailChartDatum[] }) {
  const chartConfig = {
    capital: { label: 'CAPEX', color: 'var(--chart-5)' },
    budget: { label: 'Presupuesto', color: 'var(--chart-2)' },
    revenue: { label: 'Ingreso anual', color: 'var(--chart-3)' },
    net: { label: 'Flujo neto anual', color: 'var(--chart-4)' },
  }
  const capitalData = data.filter((item) => item.tone === 'capital' || item.tone === 'budget')
  const annualFlowData = data.filter((item) => item.tone === 'revenue' || item.tone === 'net')

  return (
    <SimulationCard className="border-[#d7dfd6] bg-white p-4 dark:border-white/10 dark:bg-[#16201d]">
      <div className="space-y-4">
        <div>
          <p className="inline-flex rounded-md border border-[#dde4dc] bg-[#f7f9f6] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/60">
            Financiero
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">
            Relacion entre capital y flujo
          </p>
          <h2 className="mt-2.5 text-[1.45rem] font-bold tracking-[-0.025em] text-[#1c2a22] dark:text-content-dark">
            Lectura visual del caso
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">
            Separamos capital y flujo anual para evitar una comparacion engañosa entre magnitudes que no juegan en la misma escala.
          </p>
        </div>

        {data.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartContainer config={chartConfig}>
              <FinancialMiniChart
                title="Capital comprometido"
                description="Compara inversion requerida contra capacidad presupuestaria disponible del caso."
                data={capitalData}
              />
            </ChartContainer>
            <ChartContainer config={chartConfig}>
              <FinancialMiniChart
                title="Flujo anual esperado"
                description="Cruza ingreso anual con flujo neto para leer capacidad de defensa operativa del escenario."
                data={annualFlowData}
              />
            </ChartContainer>
          </div>
        ) : (
          <div className="rounded-[0.75rem] border border-dashed border-[#d8dfd7] bg-[#fbfcfb] p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.025] dark:text-content-dark/65">
            Todavia no hay suficiente informacion consolidada para construir la comparacion visual del caso financiero.
          </div>
        )}
      </div>
    </SimulationCard>
  )
}

export function RealDataNoticeCard({ content }: { content: DetailPlaceholderContent }) {
  return <SimulationDetailPlaceholder content={content} />
}

export function FinancialPendingNoteCard({ content }: { content: DetailPlaceholderContent }) {
  return (
    <SimulationCard className="border-dashed border-[#dbe3db] bg-[#fafcf9] p-4 dark:border-white/10 dark:bg-white/[0.02]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">{content.sectionLabel}</p>
      <h3 className="mt-2 text-base font-semibold text-[#1c2a22] dark:text-content-dark">{content.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-content-dark/65">{content.description}</p>
    </SimulationCard>
  )
}

export function ClimateConditionsCard({ content }: { content: DetailSectionContent }) {
  return <SimulationDetailSectionCard content={content} contextLabel="Recurso y trazabilidad de entrada" />
}

export function EducationalConclusionsCard() {
  return (
    <SimulationCard className="border border-[#d8dfd7] bg-[#f8faf8] p-6 dark:border-white/10 dark:bg-[#17211e]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">Notas operativas</p>
      <h3 className="mb-2 mt-2 text-lg font-bold text-[#1c2a22] dark:text-content-dark">Lectura de contexto</h3>
      <p className="text-sm leading-6 text-slate-700 dark:text-content-dark/80">
        Esta vista resume los indicadores disponibles del escenario actual para facilitar una lectura clara de desempeño, viabilidad y contexto operativo.
      </p>
    </SimulationCard>
  )
}
