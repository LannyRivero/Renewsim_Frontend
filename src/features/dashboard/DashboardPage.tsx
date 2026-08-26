import { useQuery } from '@tanstack/react-query'
import { Activity, ArrowRight, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EnergyBarChart } from './components/EnergyBarChart'
import { DistributionDonut } from './components/DistributionDonut'
import { PerformanceSnapshot } from './components/PerformanceSnapshot'
import {
  SimulationCard,
  SimulationPageContent,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStatusBadge,
  SimulationTable,
  SimulationTableBodyRow,
  SimulationTableCell,
  SimulationTableContainer,
  SimulationTableHeadCell,
  SimulationTableHeaderRow,
} from '@/shared/components'
import { getDashboardData } from './services/dashboardService'
import type { DashboardData } from './services/dashboardTypes'

const EMPTY_DASHBOARD_DATA: DashboardData = {
  summary: {
    totalSimulations: 0,
    activeSimulations: null,
    averageRoiPercent: null,
    medianPaybackYears: null,
    totalEnergyGeneratedKwh: null,
    totalCo2SavedKg: null,
    atRiskCount: null,
  },
  stats: [
    { label: 'Simulaciones totales', value: '0', icon: 'insights' },
    { label: 'CO2 evitado', value: 'N/D', icon: 'eco' },
    { label: 'ROI promedio', value: 'N/D', icon: 'trending_up' },
    { label: 'Energía generada', value: 'N/D', icon: 'bolt' },
  ],
  energyBySource: [],
  distribution: [],
  statusDistribution: [],
  efficiencyMetrics: [],
  targetVsActual: [],
  recommendedScenario: null,
  prioritizedScenarios: [],
  riskAlerts: [],
}

function parseNumericValue(value: string) {
  const normalized = value.replace(/,/g, '').replace(/[^\d.-]/g, '')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : null
}

function readStat(stats: DashboardData['stats'], label: string) {
  return stats.find((item) => item.label === label)?.value ?? 'N/D'
}

function buildExecutiveDrivers(data: DashboardData) {
  if (data.recommendedScenario?.drivers?.length) {
    return data.recommendedScenario.drivers
  }

  const totalSimulations = parseNumericValue(readStat(data.stats, 'Simulaciones totales'))
  const averageRoi = parseNumericValue(readStat(data.stats, 'ROI promedio'))
  const topSource = [...(data.distribution ?? [])].sort((a, b) => b.kwh - a.kwh)[0]

  return [
    totalSimulations && totalSimulations > 0
      ? `${Math.trunc(totalSimulations)} simulaciones sostienen una lectura consolidada del portafolio.`
      : 'Todavía no hay suficiente volumen para una lectura consolidada del portafolio.',
    averageRoi !== null
      ? averageRoi >= 8
        ? `El retorno promedio (${readStat(data.stats, 'ROI promedio')}) se mantiene en una banda defendible.`
        : `El retorno promedio (${readStat(data.stats, 'ROI promedio')}) sigue por debajo de una señal fuerte.`
      : 'El backend todavía no entrega una lectura consolidada de retorno promedio.',
    topSource
      ? `${topSource.label} domina la mezcla operativa con ${Math.round((topSource.kwh / Math.max(1, data.distribution.reduce((sum, item) => sum + item.kwh, 0))) * 100)}% del volumen.`
      : 'La mezcla operativa todavía no tiene una fuente claramente dominante.',
  ]
}

function buildExecutiveHeadline(data: DashboardData) {
  if (data.recommendedScenario?.headline) {
    return data.recommendedScenario.headline
  }

  const averageRoi = parseNumericValue(readStat(data.stats, 'ROI promedio'))
  const totalSimulations = parseNumericValue(readStat(data.stats, 'Simulaciones totales'))

  if (!totalSimulations || totalSimulations <= 0) {
    return 'Todavía no hay base suficiente para una recomendación consolidada.'
  }

  if (averageRoi !== null && averageRoi >= 8) {
    return 'El portafolio mantiene una señal ejecutiva suficientemente defendible.'
  }

  return 'El portafolio necesita una lectura más cuidadosa antes de sostener priorización.'
}

function buildExecutiveNextStep(data: DashboardData) {
  if (data.recommendedScenario?.nextStep) {
    return data.recommendedScenario.nextStep
  }

  const efficiencyMetrics = data.efficiencyMetrics?.length ?? 0
  const targetVsActual = data.targetVsActual?.length ?? 0

  if (efficiencyMetrics > 0 && targetVsActual > 0) {
    return 'Contrastar eficiencia y objetivo vs actual antes de elevar una recomendación de priorización.'
  }

  return 'Completar señales operativas y financieras antes de usar el dashboard como soporte de decisión.'
}

function buildPortfolioRows(data: DashboardData) {
  const prioritizedScenarios = data.prioritizedScenarios ?? []
  if (prioritizedScenarios.length > 0) {
    return prioritizedScenarios.slice(0, 4).map((item) => ({
      id: item.id,
      name: item.name,
      volume: item.estimatedAnnualSavings ?? 0,
      share: item.score ?? 0,
      priority: item.priority,
      roiPercent: item.roiPercent,
      paybackYears: item.paybackYears,
      status: item.status,
    }))
  }

  return (data.energyBySource ?? [])
    .map((item, index) => ({
      id: `energy-${index}`,
      name: item.label,
      volume: item.kwh,
      share: (data.distribution ?? []).find((slice) => slice.label === item.label)?.kwh ?? item.kwh,
      priority: null,
      roiPercent: null,
      paybackYears: null,
      status: null,
    }))
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 4)
}

function buildPriorityRead(sharePercent: number) {
  if (sharePercent >= 45) return 'Alta'
  if (sharePercent >= 20) return 'Media'
  return 'Seguimiento'
}

export function DashboardPage() {
  const { data, isError, error } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: getDashboardData,
    staleTime: 60_000,
  })

  const efficiencyMetrics = data?.efficiencyMetrics ?? EMPTY_DASHBOARD_DATA.efficiencyMetrics
  const targetVsActual = data?.targetVsActual ?? EMPTY_DASHBOARD_DATA.targetVsActual
  const energyBySource = data?.energyBySource ?? EMPTY_DASHBOARD_DATA.energyBySource
  const distribution = data?.distribution ?? EMPTY_DASHBOARD_DATA.distribution
  const dashboardData = data ?? EMPTY_DASHBOARD_DATA
  const portfolioRows = buildPortfolioRows(dashboardData)
  const decisionDrivers = buildExecutiveDrivers(dashboardData)
  const decisionHeadline = buildExecutiveHeadline(dashboardData)
  const nextStep = buildExecutiveNextStep(dashboardData)
  const totalEnergy = readStat(dashboardData.stats, 'Energía generada')
  const averageRoi = readStat(dashboardData.stats, 'ROI promedio')
  const totalSimulations = readStat(dashboardData.stats, 'Simulaciones totales')
  const totalCo2 = readStat(dashboardData.stats, 'CO2 evitado')
  const hasExecutiveData = portfolioRows.length > 0 || efficiencyMetrics.length > 0 || targetVsActual.length > 0
  const hasOperationalData = energyBySource.length > 0 || distribution.length > 0 || efficiencyMetrics.length > 0 || targetVsActual.length > 0
  const totalSimulationCount = parseNumericValue(totalSimulations) ?? 0
  const hasDashboardData = totalSimulationCount > 0 || hasOperationalData
  const distributionTotal = Math.max(1, (distribution ?? []).reduce((sum, item) => sum + item.kwh, 0))
  const summaryCards = [
    { label: 'Simulaciones', value: totalSimulations, href: '/simulador/historial' },
    { label: 'ROI promedio', value: averageRoi, href: null },
    { label: 'Energía generada', value: totalEnergy, href: null },
    { label: 'CO2 evitado', value: totalCo2, href: null },
  ]

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="px-4 py-4 sm:px-5 sm:py-5 lg:h-auto lg:px-5 lg:py-5" bodyClassName="lg:h-auto">
      <SimulationPageContent spacing="compact" className="lg:h-auto">
        <SimulationSectionHeader
          eyebrow="Comando de Operaciones"
          eyebrowIcon={<Activity className="h-3.5 w-3.5" />}
          description="Salud de la generación, mezcla de fuentes y rendimiento objetivo en una vista operativa."
          className="gap-2 md:items-end"
        />

        {!hasDashboardData ? (
          <SimulationCard className="rounded-sm border-[#cfd8ce] bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,250,246,0.98)_100%)] p-6 shadow-[0_24px_52px_-40px_rgba(15,23,42,0.2)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(22,32,29,0.98)_0%,rgba(17,25,22,0.98)_100%)] lg:p-7">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#627468] dark:text-content-dark/72">
                Dashboard ejecutivo
              </p>
              <h2 className="mt-3 text-[2rem] font-black leading-[1] tracking-[-0.05em] text-[#122033] dark:text-content-dark lg:text-[2.35rem]">
                Todavía no hay suficiente señal para construir una lectura de portafolio.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-content-dark/66 sm:text-base">
                Cuando existan simulaciones con datos operativos y financieros consistentes, este panel va a resumir prioridad, retorno, mezcla y alertas. Hasta entonces, prefiero una entrada honesta antes que una pantalla llena de ruido.
              </p>
            </div>
          </SimulationCard>
        ) : null}

        {hasDashboardData ? (
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.7fr)_290px] xl:items-stretch">
          <div className="flex h-full flex-col gap-3">
            <SimulationCard className="rounded-sm">
              <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((item) => {
                  const card = (
                    <SimulationCard
                      density="compact"
                      className={`rounded-sm px-3 py-2.5 transition-all duration-200 ${item.href ? 'group border-[#cfd8ce] hover:-translate-y-[1px] hover:border-[#b9c7ba] hover:shadow-[0_14px_28px_-24px_rgba(15,23,42,0.2)]' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                            {item.label}
                          </p>
                          <p className="mt-2 text-[1.72rem] font-black tracking-[-0.045em] text-[#14261c] dark:text-content-dark">
                            {item.value}
                          </p>
                        </div>
                        {item.href ? <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" /> : null}
                      </div>
                    </SimulationCard>
                  )

                  return item.href ? (
                    <Link key={item.label} to={item.href} className="block">
                      {card}
                    </Link>
                  ) : (
                    <div key={item.label}>{card}</div>
                  )
                })}
              </div>
            </SimulationCard>

            <div className="grid flex-1 gap-2 xl:grid-cols-[minmax(0,1.42fr)_230px]">
              <div className="flex h-full flex-col gap-2">
                <SimulationCard density="compact" className="rounded-sm">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                    Priorización actual
                  </p>
                  {hasExecutiveData ? (
                    <SimulationTableContainer>
                      <SimulationTable>
                        <thead>
                          <SimulationTableHeaderRow>
                            <SimulationTableHeadCell>Fuente</SimulationTableHeadCell>
                            <SimulationTableHeadCell>Volumen</SimulationTableHeadCell>
                            <SimulationTableHeadCell>Prioridad</SimulationTableHeadCell>
                          </SimulationTableHeaderRow>
                        </thead>
                        <tbody>
                          {portfolioRows.length > 0 ? (
                            portfolioRows.map((row) => {
                              const sharePercent = row.priority ? null : Math.round((row.share / distributionTotal) * 100)

                              return (
                                <SimulationTableBodyRow key={row.id}>
                                  <SimulationTableCell className="font-semibold text-slate-900 dark:text-content-dark">
                                    <div>
                                      <p>{row.name}</p>
                                      {row.status ? <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/55">{row.status}</p> : null}
                                    </div>
                                  </SimulationTableCell>
                                  <SimulationTableCell className="font-semibold text-slate-800 dark:text-content-dark">
                                    {row.roiPercent !== null ? `${row.roiPercent.toFixed(1)}% ROI` : `${row.volume.toLocaleString('en-US')} kWh`}
                                  </SimulationTableCell>
                                  <SimulationTableCell>
                                    <span className="inline-flex rounded-sm border border-[#ccd6cb] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3f5548] dark:border-white/12 dark:bg-white/[0.04] dark:text-content-dark/70">
                                      {row.priority ?? buildPriorityRead(sharePercent ?? 0)}
                                    </span>
                                  </SimulationTableCell>
                                </SimulationTableBodyRow>
                              )
                            })
                          ) : (
                            <SimulationTableBodyRow>
                              <SimulationTableCell colSpan={3}>Todavía no hay mezcla suficiente para leer prioridades.</SimulationTableCell>
                            </SimulationTableBodyRow>
                          )}
                        </tbody>
                      </SimulationTable>
                    </SimulationTableContainer>
                  ) : (
                    <div className="rounded-sm border border-[#dde4dc] bg-[#f7faf7] p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-content-dark/68">
                      El panel todavía está esperando señales reales del backend para mostrar una priorización útil.
                    </div>
                  )}
                </SimulationCard>

                {dashboardData.recommendedScenario ? (
                  <Link to={`/simulador/detalles?id=${encodeURIComponent(dashboardData.recommendedScenario.id)}`} className="block">
                    <SimulationCard tone="soft" density="compact" className="rounded-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-[#c5d2c6] hover:shadow-[0_14px_28px_-24px_rgba(15,23,42,0.2)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                      Escenario recomendado
                    </p>
                    <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(180px,0.8fr)]">
                      <div>
                        <p className="text-base font-bold text-slate-900 dark:text-content-dark">
                          {dashboardData.recommendedScenario.name}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/55">
                          {dashboardData.recommendedScenario.technology} · {dashboardData.recommendedScenario.location}
                        </p>
                        <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-content-dark/68">
                          {dashboardData.recommendedScenario.headline}
                        </p>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                        <div className="rounded-sm border border-[#dde4dc] bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-content-dark/55">ROI</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-content-dark">
                            {dashboardData.recommendedScenario.roiPercent !== null ? `${dashboardData.recommendedScenario.roiPercent.toFixed(1)}%` : 'N/D'}
                          </p>
                        </div>
                        <div className="rounded-sm border border-[#dde4dc] bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-content-dark/55">Payback</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-content-dark">
                            {dashboardData.recommendedScenario.paybackYears !== null ? `${dashboardData.recommendedScenario.paybackYears.toFixed(1)} años` : 'N/D'}
                          </p>
                        </div>
                        <div className="rounded-sm border border-[#dde4dc] bg-white px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-content-dark/55">Prioridad</p>
                          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-content-dark">
                            {dashboardData.recommendedScenario.priority}
                          </p>
                        </div>
                      </div>
                    </div>
                    </SimulationCard>
                  </Link>
                ) : null}
              </div>

              <SimulationCard tone="soft" density="compact" className="flex h-full flex-col rounded-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                  Perfil de lectura
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-[#dde5dc] pb-3 dark:border-white/8">
                    <p className="text-sm text-slate-700 dark:text-content-dark/66">Fuentes activas</p>
                    <span className="text-sm font-semibold text-slate-900 dark:text-content-dark">{distribution.length}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#dde5dc] pb-3 dark:border-white/8">
                    <p className="text-sm text-slate-700 dark:text-content-dark/66">KPIs disponibles</p>
                    <span className="text-sm font-semibold text-slate-900 dark:text-content-dark">{efficiencyMetrics.length}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#dde5dc] pb-3 dark:border-white/8">
                    <p className="text-sm text-slate-700 dark:text-content-dark/66">Objetivos medidos</p>
                    <span className="text-sm font-semibold text-slate-900 dark:text-content-dark">{targetVsActual.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-700 dark:text-content-dark/66">Estado</p>
                    <span className="text-sm font-semibold text-slate-900 dark:text-content-dark">
                      {isError && !data ? 'Con reserva' : hasDashboardData ? 'Operativo' : 'En espera'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto border-t border-[#dde5dc] pt-4 dark:border-white/8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-content-dark/55">
                    Estado general
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-content-dark/68">
                    {dashboardData.riskAlerts.length > 0
                      ? `${dashboardData.riskAlerts.length} alertas activas requieren seguimiento antes de sostener una priorización más agresiva.`
                      : 'El panel mantiene una lectura estable y no muestra alertas activas en este momento.'}
                  </p>
                  {dashboardData.recommendedScenario?.priority ? (
                    <div className="mt-3 inline-flex rounded-sm border border-[#ccd6cb] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3f5548] dark:border-white/12 dark:bg-white/[0.04] dark:text-content-dark/70">
                      Prioridad recomendada: {dashboardData.recommendedScenario.priority}
                    </div>
                  ) : null}
                </div>
              </SimulationCard>
            </div>
          </div>

          {hasDashboardData ? (
            <SimulationCard tone="soft" className="h-full rounded-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                Decision brief
              </p>

              <div className="mt-3 space-y-3">
                <div className="border-b border-[#dde5dc] pb-3 dark:border-white/8">
                  <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Lectura ejecutiva</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-content-dark/64">
                    {decisionHeadline}
                  </p>
                </div>

                <div className="border-b border-[#dde5dc] pb-3 dark:border-white/8">
                  <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Drivers de la decisión</p>
                  <div className="mt-2 space-y-1.5">
                    {decisionDrivers.map((item) => (
                      <div key={item} className="rounded-sm border border-[#d8dfd7] bg-white px-3 py-2 text-sm text-slate-700 shadow-[0_8px_16px_-20px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-white/[0.03] dark:text-content-dark/66">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {dashboardData.recommendedScenario?.mainRisk ? (
                    <>
                      <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Riesgo principal</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-content-dark/64">
                        {dashboardData.recommendedScenario.mainRisk}
                      </p>
                    </>
                  ) : null}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Siguiente paso</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-content-dark/64">
                    {nextStep}
                  </p>
                </div>

                {dashboardData.riskAlerts.length > 0 ? (
                  <div className="border-t border-[#dde5dc] pt-3 dark:border-white/8">
                    <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Alertas activas</p>
                    <div className="mt-2 space-y-1.5">
                      {dashboardData.riskAlerts.map((alert) => (
                        <div key={`${alert.type}-${alert.severity}`} className="rounded-sm border border-[#d8dfd7] bg-white px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-content-dark/66">
                          {alert.message}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </SimulationCard>
          ) : null}
        </div>
        ) : null}

        {isError && !data ? (
          <div>
            <SimulationStatusBadge tone="neutral" className="gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium">
              <Info className="h-3.5 w-3.5" />
              {error instanceof Error ? 'No se pudo cargar el panel desde backend.' : 'No se pudo cargar el panel desde backend.'}
            </SimulationStatusBadge>
          </div>
        ) : null}

        {hasDashboardData && hasOperationalData ? (
          <div className="flex min-h-0 flex-col gap-3">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600 dark:text-content-dark/78">
                Resumen de Energía
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">
                Vista consolidada por fuente de generación y peso de distribución.
              </p>
            </div>

            <div className="grid grid-cols-1 items-stretch gap-3 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
              <div className="h-full">
                <EnergyBarChart data={energyBySource} />
              </div>
              <div className="h-full">
                <DistributionDonut data={dashboardData.statusDistribution} variant="status" />
              </div>
            </div>

            {efficiencyMetrics.length > 0 || targetVsActual.length > 0 ? (
              <PerformanceSnapshot
                metrics={efficiencyMetrics}
                targetVsActual={targetVsActual}
              />
            ) : null}
          </div>
        ) : null}
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
