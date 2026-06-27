import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { getSimulationById } from '../services/simulationService'
import { useSimulationStore } from '@/stores/simulationStore'
import {
  SimulationCard,
  SimulationActionButton,
  SimulationPageContent,
  SimulationPageShell,
  SimulationSectionHeader,
  SimulationStateMessage,
} from '@/shared/components'
import {
  ClimateConditionsCard,
  EducationalConclusionsCard,
  RealDataNoticeCard,
  SimulationExecutiveSummaryGrid,
  SimulationFinancialSnapshot,
  SimulationOverviewCard,
} from './SimulationDetailsSections'
import { buildSimulationDetailsViewModel } from './simulationDetailsViewModel'

const DETAIL_TABS = [
  { id: 'summary', label: 'Resumen' },
  { id: 'financial', label: 'Financiero' },
  { id: 'comparison', label: 'Comparativa' },
  { id: 'climate', label: 'Clima' },
] as const

type DetailTabId = (typeof DETAIL_TABS)[number]['id']

function getSummaryClimateMetric({
  energyType,
  irradiance,
  windSpeed,
  hydrology,
}: {
  energyType: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
}) {
  const normalized = energyType.trim().toUpperCase()

  if (normalized === 'WIND') {
    return {
      label: 'Velocidad del viento',
      value: `${windSpeed} m/s`,
    }
  }

  if (normalized === 'HYDRO') {
    return {
      label: 'Hidrología',
      value: String(hydrology),
    }
  }

  return {
    label: 'Irradiancia',
    value: `${irradiance} kWh/m2/día`,
  }
}

export function SimulationDetailsPage() {
  const [activeTab, setActiveTab] = useState<DetailTabId>('summary')
  const [searchParams] = useSearchParams()
  const resultFromStore = useSimulationStore((state) => state.lastResult)
  const requestedSimulationId = searchParams.get('id')
  const simulationId = requestedSimulationId ?? resultFromStore?.id ?? null

  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-details', simulationId],
    queryFn: async () => {
      if (!simulationId) return null
      return getSimulationById(simulationId)
    },
    enabled: Boolean(simulationId),
  })

  const viewModel = buildSimulationDetailsViewModel({
    data,
    requestedSimulationId,
    resultFromStore,
  })
  const summaryClimateMetric = getSummaryClimateMetric({
    energyType: viewModel.energyType,
    irradiance: viewModel.irradiance,
    windSpeed: viewModel.windSpeed,
    hydrology: viewModel.hydrology,
  })

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="lg:h-auto" bodyClassName="lg:h-auto">
      <SimulationPageContent className="lg:h-auto">
        <SimulationSectionHeader
          eyebrow="Inteligencia de simulación"
          eyebrowIcon={<BarChart3 className="h-3.5 w-3.5" />}
          title="Detalles de la simulación"
          description="Resumen ejecutivo del escenario para evaluar desempeño, viabilidad y contexto operativo."
          className="gap-1"
          actions={
            <Link to="/simulador/nueva">
              <SimulationActionButton type="button" variant="primary">
                Nueva simulación
              </SimulationActionButton>
            </Link>
          }
        />

        {requestedSimulationId && isLoading ? (
          <SimulationStateMessage>Cargando detalles de la simulación...</SimulationStateMessage>
        ) : null}
        {requestedSimulationId && isError ? (
          <SimulationStateMessage tone="error">
            No se pudieron cargar los detalles de la simulación. Intentá nuevamente.
          </SimulationStateMessage>
        ) : null}

        <div className="space-y-2.5">
          <SimulationCard className="px-2.5 py-2 sm:px-3 sm:py-2.5">
            <div className="flex flex-wrap gap-2">
              {DETAIL_TABS.map((tab) => {
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-[#4a7e63] text-white shadow-[0_12px_22px_-20px_rgba(74,126,99,0.28)] dark:bg-white/12 dark:text-content-dark'
                        : 'border border-[#d4ddd2] bg-[#f5f8f4] text-slate-600 hover:border-[#bfd0c1] hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-content-dark/65 dark:hover:bg-white/[0.05] dark:hover:text-content-dark',
                    ].join(' ')}
                    aria-pressed={isActive}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </SimulationCard>

          {activeTab === 'summary' ? (
            <div className="space-y-4">
              <SimulationOverviewCard
                displayTitle={viewModel.displayTitle}
                date={viewModel.date}
                location={viewModel.location}
                roi={viewModel.roi}
                efficiency={viewModel.efficiency}
                energyGenerated={viewModel.energyGenerated}
                decisionStatus={viewModel.decisionStatus}
                decisionHeadline={viewModel.decisionHeadline}
                decisionSummary={viewModel.decisionSummary}
                decisionDrivers={viewModel.decisionDrivers}
              />
              <SimulationExecutiveSummaryGrid
                revenue={viewModel.revenue}
                capex={viewModel.capex}
                paybackYears={viewModel.paybackYears}
                climateLabel={summaryClimateMetric.label}
                climateValue={summaryClimateMetric.value}
              />
            </div>
          ) : null}

          {activeTab === 'financial' ? (
            <div className="space-y-4">
              <SimulationFinancialSnapshot
                capex={viewModel.capex}
                opex={viewModel.opex}
                revenue={viewModel.revenue}
                paybackYears={viewModel.paybackYears}
                npv={viewModel.npv}
                irr={viewModel.irr}
              />
            </div>
          ) : null}

          {activeTab === 'comparison' ? (
            <div className="space-y-4">
              <RealDataNoticeCard
                title="Comparativa no disponible en esta etapa"
                description="Esta simulación no cuenta todavía con una comparativa detallada entre alternativas dentro de esta vista. Cuando esté disponible, se incorporará como parte del análisis ejecutivo del escenario."
              />
            </div>
          ) : null}

          {activeTab === 'climate' ? (
            <div className="space-y-4">
              <ClimateConditionsCard
                irradiance={viewModel.irradiance}
                windSpeed={viewModel.windSpeed}
                hydrology={viewModel.hydrology}
                averageTemperature={viewModel.averageTemperature}
                climateSource={viewModel.climateSource}
                climatePeriod={viewModel.climatePeriod}
              />
              <EducationalConclusionsCard />
            </div>
          ) : null}
        </div>
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
