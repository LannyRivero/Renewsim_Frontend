import { SimulationCard } from '@/shared/components'

export function SimulationOverviewCard({
  displayTitle,
  date,
  location,
  roi,
  efficiency,
  energyGenerated,
  decisionStatus,
  decisionHeadline,
  decisionSummary,
  decisionDrivers,
}: {
  displayTitle: string
  date: string
  location: string
  roi: string
  efficiency: string
  energyGenerated: string
  decisionStatus: string
  decisionHeadline: string
  decisionSummary: string
  decisionDrivers: string[]
}) {
  const toneClass =
    decisionStatus === 'Recomendado'
      ? 'border-emerald-200 bg-emerald-50/80 text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200'
      : decisionStatus === 'Viable con reservas'
        ? 'border-amber-200 bg-amber-50/80 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100'
        : 'border-rose-200 bg-rose-50/80 text-rose-800 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-100'

  return (
    <SimulationCard className="border-[#cad4c8] bg-[linear-gradient(180deg,rgba(252,253,250,0.98)_0%,rgba(244,248,243,0.98)_100%)] p-4 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,36,30,0.95)_0%,rgba(17,29,24,0.95)_100%)]">
      <div>
        <p className="inline-flex rounded-full border border-[#d4ddd2] bg-[#edf3ec] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-content-dark/60">
          Resumen de la simulación
        </p>
        <h2 className="mt-2.5 text-[1.85rem] font-black tracking-[-0.035em] text-[#14261c] dark:text-content-dark">{displayTitle}</h2>
        <div className={`mt-2.5 inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${toneClass}`}>
          {decisionStatus}
        </div>
        <p className="mt-2.5 max-w-3xl text-[1.05rem] font-bold tracking-[-0.025em] text-[#14261c] dark:text-content-dark">{decisionHeadline}</p>
        <p className="mt-1.5 max-w-3xl text-sm leading-5 text-slate-600 dark:text-content-dark/65">{decisionSummary}</p>

        <div className="mt-2.5 flex flex-wrap gap-2 text-sm text-slate-600 dark:text-content-dark/65">
          <span className="rounded-full border border-[#d8e0d6] bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
            {date}
          </span>
          <span className="rounded-full border border-[#d8e0d6] bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
            {location}
          </span>
        </div>

        <div className="mt-3.5 grid gap-2 sm:grid-cols-3">
          <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-white/75 px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">ROI</p>
            <p className="mt-1 text-[1.35rem] font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{roi}</p>
          </div>
          <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-white/75 px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Eficiencia</p>
            <p className="mt-1 text-[1.35rem] font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{efficiency}</p>
          </div>
          <div className="rounded-[0.9rem] border border-[#d8e0d6] bg-white/75 px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Generación</p>
            <p className="mt-1 text-[1.35rem] font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{energyGenerated}</p>
          </div>
        </div>

        <div className="mt-3.5 grid gap-2 lg:grid-cols-3">
          {decisionDrivers.slice(0, 3).map((driver) => (
            <div key={driver} className="rounded-[0.9rem] border border-[#d8e0d6] bg-white/70 px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.04]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Clave de decisión</p>
              <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-content-dark/75">{driver}</p>
            </div>
          ))}
        </div>
      </div>
    </SimulationCard>
  )
}

export function SimulationExecutiveSummaryGrid({
  revenue,
  capex,
  paybackYears,
  climateLabel,
  climateValue,
}: {
  revenue: string
  capex: string
  paybackYears: string
  climateLabel: string
  climateValue: string
}) {
  return (
    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
      <SimulationCard className="p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Finanzas</p>
        <h3 className="mt-1.5 text-[0.95rem] font-bold text-[#14261c] dark:text-content-dark">Ingreso estimado</h3>
        <p className="mt-1.5 text-[1.35rem] font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{revenue}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/65">Inversión inicial: {capex}</p>
      </SimulationCard>

      <SimulationCard className="p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Retorno</p>
        <h3 className="mt-1.5 text-[0.95rem] font-bold text-[#14261c] dark:text-content-dark">Tiempo de retorno</h3>
        <p className="mt-1.5 text-[1.35rem] font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{paybackYears}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/65">Tiempo estimado para recuperar la inversión inicial.</p>
      </SimulationCard>

      <SimulationCard className="p-3.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Clima</p>
        <h3 className="mt-1.5 text-[0.95rem] font-bold text-[#14261c] dark:text-content-dark">{climateLabel}</h3>
        <p className="mt-1.5 text-[1.35rem] font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{climateValue}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/65">Variable climática clave del escenario.</p>
      </SimulationCard>

    </div>
  )
}

export function SimulationFinancialSnapshot({
  capex,
  opex,
  revenue,
  paybackYears,
  npv,
  irr,
}: {
  capex: string
  opex: string
  revenue: string
  paybackYears: string
  npv: string
  irr: string
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      <SimulationCard className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Inversión</p>
        <h3 className="mt-3 text-lg font-bold text-[#14261c] dark:text-content-dark">Inversión inicial</h3>
        <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{capex}</p>
      </SimulationCard>
      <SimulationCard className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Operación</p>
        <h3 className="mt-3 text-lg font-bold text-[#14261c] dark:text-content-dark">Costo operativo</h3>
        <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{opex}</p>
      </SimulationCard>
      <SimulationCard className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Ingresos</p>
        <h3 className="mt-3 text-lg font-bold text-[#14261c] dark:text-content-dark">Ingreso estimado</h3>
        <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{revenue}</p>
      </SimulationCard>
      <SimulationCard className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Payback</p>
        <h3 className="mt-3 text-lg font-bold text-[#14261c] dark:text-content-dark">Retorno</h3>
        <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{paybackYears}</p>
      </SimulationCard>
      <SimulationCard className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Valor</p>
        <h3 className="mt-3 text-lg font-bold text-[#14261c] dark:text-content-dark">Valor presente neto</h3>
        <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{npv}</p>
      </SimulationCard>
      <SimulationCard className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Rentabilidad</p>
        <h3 className="mt-3 text-lg font-bold text-[#14261c] dark:text-content-dark">Tasa interna</h3>
        <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark">{irr}</p>
      </SimulationCard>
    </div>
  )
}

export function RealDataNoticeCard({ title, description }: { title: string; description: string }) {
  return (
    <SimulationCard className="border border-[#d8e0d6] bg-[#f7faf5] p-6 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Disponibilidad de datos</p>
      <h3 className="mt-2 text-xl font-bold text-[#14261c] dark:text-content-dark">{title}</h3>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">{description}</p>
    </SimulationCard>
  )
}

export function ClimateConditionsCard({
  irradiance,
  windSpeed,
  hydrology,
  averageTemperature,
  climateSource,
  climatePeriod,
}: {
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  averageTemperature: string
  climateSource: string
  climatePeriod: string
}) {
  return (
    <SimulationCard tone="soft" className="space-y-4 p-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Contexto climático</p>
        <h3 className="mt-2 text-xl font-bold text-[#14261c] dark:text-content-dark">Condiciones climáticas utilizadas</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-[1rem] border border-[#d8e0d6] bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Irradiancia</p>
          <p className="mt-2 text-base font-semibold text-[#14261c] dark:text-content-dark">{irradiance} kWh/m2/día</p>
        </div>
        <div className="rounded-[1rem] border border-[#d8e0d6] bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Viento</p>
          <p className="mt-2 text-base font-semibold text-[#14261c] dark:text-content-dark">{windSpeed} m/s</p>
        </div>
        <div className="rounded-[1rem] border border-[#d8e0d6] bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Hidrología</p>
          <p className="mt-2 text-base font-semibold text-[#14261c] dark:text-content-dark">{hydrology}</p>
        </div>
        <div className="rounded-[1rem] border border-[#d8e0d6] bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Temperatura</p>
          <p className="mt-2 text-base font-semibold text-[#14261c] dark:text-content-dark">{averageTemperature}</p>
        </div>
        <div className="rounded-[1rem] border border-[#d8e0d6] bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Fuente</p>
          <p className="mt-2 text-base font-semibold text-[#14261c] dark:text-content-dark">{climateSource}</p>
        </div>
        <div className="rounded-[1rem] border border-[#d8e0d6] bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Período</p>
          <p className="mt-2 text-base font-semibold text-[#14261c] dark:text-content-dark">{climatePeriod}</p>
        </div>
      </div>
    </SimulationCard>
  )
}

export function EducationalConclusionsCard() {
  return (
    <SimulationCard className="border border-[#cfe0cf] bg-[linear-gradient(180deg,rgba(235,244,234,0.92)_0%,rgba(225,237,225,0.92)_100%)] p-6 dark:border-emerald-500/20 dark:bg-[linear-gradient(180deg,rgba(22,54,38,0.34)_0%,rgba(17,38,29,0.28)_100%)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/60">Cierre ejecutivo</p>
      <h3 className="mb-2 mt-2 text-xl font-bold text-[#14261c] dark:text-content-dark">Lectura ejecutiva</h3>
      <p className="text-sm leading-6 text-slate-700 dark:text-content-dark/80">
        Esta vista resume los indicadores disponibles del escenario actual para facilitar una lectura clara de desempeño, viabilidad y contexto operativo.
      </p>
    </SimulationCard>
  )
}
