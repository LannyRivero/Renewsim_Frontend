import { SimulationCard, SimulationStateMessage } from '@/shared/components'
import type {
  ComparableTechnology,
  ComparisonHeight,
  SimulationResultsMetric,
} from './simulationResultsViewModel'

function MetricCard({
  label,
  value,
  delta,
  positive = true,
}: SimulationResultsMetric) {
  return (
    <article className="rounded-[1rem] border border-[#d7dfd5] bg-[#fbfdf9]/98 p-5 shadow-[0_16px_32px_-28px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-[#15241e]/92">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{value}</p>
      <p className={`mt-2 text-sm font-semibold ${positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {positive ? '▲' : '▼'} {delta}
      </p>
    </article>
  )
}

export function ResultsHeroSection({
  recommendedTechnology,
  simulationName,
  resultLocation,
  normalizedEnergyType,
  simulationId,
  roiValue,
  savingsValue,
  energyValue,
}: {
  recommendedTechnology: string
  simulationName?: string
  resultLocation: string
  normalizedEnergyType: string
  simulationId?: string
  roiValue: string
  savingsValue: string
  energyValue: string
}) {
  return (
    <SimulationCard className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] xl:items-stretch" density="comfortable">
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Escenario activo</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{recommendedTechnology}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">
            La simulación sugiere esta línea base para avanzar al análisis comparativo con foco en retorno, ahorro y volumen energético.
          </p>
          {simulationName ? <p className="mt-3 text-sm font-medium text-slate-700 dark:text-content-dark/75">{simulationName}</p> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-[#f5f8f4] px-4 py-3 dark:border-white/10 dark:bg-white/[0.035]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/60">Ubicación</p>
            <p className="mt-1 text-sm font-semibold text-[#14261c] dark:text-content-dark">{resultLocation}</p>
          </div>
          <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-[#f5f8f4] px-4 py-3 dark:border-white/10 dark:bg-white/[0.035]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/60">Fuente</p>
            <p className="mt-1 text-sm font-semibold text-[#14261c] dark:text-content-dark">{normalizedEnergyType}</p>
          </div>
          <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-[#f5f8f4] px-4 py-3 dark:border-white/10 dark:bg-white/[0.035]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/60">Simulación</p>
            <p className="mt-1 text-sm font-semibold text-[#14261c] dark:text-content-dark">#{simulationId ?? 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1rem] border border-[#d8e0d6] bg-[#f7faf5] p-5 dark:border-white/10 dark:bg-white/[0.03]">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Síntesis ejecutiva</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-[0.9rem] border border-[#d8e0d6] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
            <span className="text-sm text-slate-600 dark:text-content-dark/65">ROI real</span>
            <strong className="text-base text-[#14261c] dark:text-content-dark">{roiValue}</strong>
          </div>
          <div className="flex items-center justify-between rounded-[0.9rem] border border-[#d8e0d6] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
            <span className="text-sm text-slate-600 dark:text-content-dark/65">Ahorro estimado</span>
            <strong className="text-base text-[#14261c] dark:text-content-dark">{savingsValue}</strong>
          </div>
          <div className="flex items-center justify-between rounded-[0.9rem] border border-[#d8e0d6] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]">
            <span className="text-sm text-slate-600 dark:text-content-dark/65">Energía anual</span>
            <strong className="text-base text-[#14261c] dark:text-content-dark">{energyValue}</strong>
          </div>
        </div>
      </div>
    </SimulationCard>
  )
}

export function ClimateConditionsSection({
  irradiance,
  windSpeed,
  hydrology,
  averageTemperature,
  climateSource,
  climatePeriod,
}: {
  irradiance?: number
  windSpeed?: number
  hydrology?: number
  averageTemperature: string
  climateSource: string
  climatePeriod: string
}) {
  return (
    <SimulationCard tone="soft" className="p-6">
      <h3 className="font-semibold">Climate Conditions Used</h3>
      <p className="mt-3 text-sm text-on-surface-variant dark:text-content-dark/70">Irradiance: {irradiance ?? 'N/A'} kWh/m2/day</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Wind speed: {windSpeed ?? 'N/A'} m/s</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Hydrology: {hydrology ?? 'N/A'}</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Temperature: {averageTemperature}</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Source: {climateSource}</p>
      <p className="text-sm text-on-surface-variant dark:text-content-dark/70">Period: {climatePeriod}</p>
    </SimulationCard>
  )
}

export function MetricsSection({ metrics }: { metrics: SimulationResultsMetric[] }) {
  return (
    <section>
      <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/70">Métricas clave</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>
    </section>
  )
}

export function TechnologyComparisonSection({
  normalizedEnergyType,
  comparableTechnologies,
  isLoading,
}: {
  normalizedEnergyType: string
  comparableTechnologies: ComparableTechnology[]
  isLoading: boolean
}) {
  return (
    <SimulationCard className="space-y-4" density="comfortable">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#14261c] dark:text-content-dark">Comparativa tecnológica</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/65">Ranking de tecnologías compatibles con la fuente seleccionada.</p>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">{normalizedEnergyType}</p>
      </div>

      {isLoading ? <SimulationStateMessage>Cargando tecnologías...</SimulationStateMessage> : null}
      {!isLoading && comparableTechnologies.length === 0 ? (
        <SimulationStateMessage>No hay tecnologías disponibles para esta fuente todavía.</SimulationStateMessage>
      ) : null}

      <div className="space-y-3">
        {comparableTechnologies.map((item, index) => (
          <div key={item.id} className="rounded-[0.9rem] border border-[#d8e0d6] bg-[#f7faf5] px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/60">Opción {index + 1}</p>
                <p className="mt-1 text-base font-semibold text-[#14261c] dark:text-content-dark">{item.name}</p>
              </div>
              <div className="text-right text-sm text-slate-600 dark:text-content-dark/65">
                <p>Score {item.score}</p>
                <p>Eficiencia {item.efficiency}% | CO2 {item.co2Reduction}</p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#dfe7de] dark:bg-white/10">
              <div className="h-full rounded-full bg-[#17633c]" style={{ width: item.progressWidth }} />
            </div>
          </div>
        ))}
      </div>
    </SimulationCard>
  )
}

export function QuickReadingSection({ comparisonHeights, conclusion }: { comparisonHeights: ComparisonHeight[]; conclusion: string }) {
  return (
    <SimulationCard className="space-y-4" density="comfortable">
      <div>
        <h2 className="text-xl font-bold text-[#14261c] dark:text-content-dark">Lectura rápida</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/65">Vista compacta del peso relativo de energía, ahorro y reducción de emisiones.</p>
      </div>

      <div className="grid h-[260px] grid-cols-3 items-end gap-4 rounded-[1rem] border border-[#d8e0d6] bg-[#f7faf5] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        {comparisonHeights.map((item) => (
          <div key={item.label} className="flex h-full flex-col justify-end gap-3">
            <div className="flex-1 rounded-full bg-[#e4ebe3] p-1 dark:bg-white/8">
              <div className="w-full rounded-full bg-[linear-gradient(180deg,rgba(23,99,60,0.95)_0%,rgba(31,146,88,0.72)_100%)]" style={{ height: item.height }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-[#14261c] dark:text-content-dark">{item.displayValue}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[1rem] border border-[#d8e0d6] bg-[#f7faf5] p-4 dark:border-white/10 dark:bg-white/[0.03]">
        <h3 className="text-sm font-semibold text-[#14261c] dark:text-content-dark">Conclusión</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-content-dark/65">{conclusion}</p>
      </div>
    </SimulationCard>
  )
}
