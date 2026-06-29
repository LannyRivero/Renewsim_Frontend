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
  FinancialPendingNoteCard,
  RealDataNoticeCard,
  SimulationComparisonPositionCard,
  SimulationExecutiveSummaryGrid,
  SimulationFinancialSnapshot,
  SimulationFinancialSignalChart,
  SimulationOverviewCard,
} from './SimulationDetailsSections'
import { buildSimulationDetailsViewModel } from './simulationDetailsViewModel'

const DETAIL_TABS = [
  { id: 'summary', label: 'Decisión' },
  { id: 'financial', label: 'Financiero' },
  { id: 'comparison', label: 'Comparativa' },
  { id: 'climate', label: 'Clima' },
] as const

type DetailTabId = (typeof DETAIL_TABS)[number]['id']

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

  const tabPanelId = `simulation-details-panel-${activeTab}`

  return (
    <SimulationPageShell className="lg:h-auto" contentClassName="lg:h-auto" bodyClassName="lg:h-auto">
      <SimulationPageContent className="lg:h-auto">
        <SimulationSectionHeader
          eyebrow="Detalle de simulación"
          eyebrowIcon={<BarChart3 className="h-3.5 w-3.5" />}
          title="Detalles de la simulación"
          meta={
            viewModel.date !== 'N/A' ? (
              <span className="inline-flex items-center rounded-md border border-[#d8dfd7] bg-[#f7f9f6] px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/70">
                Fecha: {viewModel.date}
              </span>
            ) : null
          }
          description="Vista consolidada del escenario para revisar desempeño, viabilidad financiera y condiciones operativas."
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
            <div className="scrollbar-hidden overflow-x-auto">
              <div className="flex min-w-max gap-2" role="tablist" aria-label="Secciones de detalle">
              {DETAIL_TABS.map((tab) => {
                const isActive = activeTab === tab.id
                const tabId = `simulation-details-tab-${tab.id}`
                const panelId = `simulation-details-panel-${tab.id}`

                return (
                  <button
                    key={tab.id}
                    id={tabId}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'border border-[#c6d1c5] bg-white text-slate-900 dark:border-white/12 dark:bg-white/[0.08] dark:text-content-dark'
                        : 'border border-transparent bg-transparent text-slate-600 hover:border-[#d5ddd4] hover:bg-[#f7f9f6] hover:text-slate-900 dark:text-content-dark/65 dark:hover:border-white/10 dark:hover:bg-white/[0.04] dark:hover:text-content-dark',
                    ].join(' ')}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {tab.label}
                  </button>
                )
              })}
              </div>
            </div>
          </SimulationCard>

          {activeTab === 'summary' ? (
            <div className="space-y-4" role="tabpanel" id={tabPanelId} aria-labelledby="simulation-details-tab-summary">
              <SimulationOverviewCard
                content={viewModel.summarySection}
              />
              <SimulationExecutiveSummaryGrid content={viewModel.summarySnapshotSection} />
            </div>
          ) : null}

          {activeTab === 'financial' ? (
            <div className="space-y-4" role="tabpanel" id={tabPanelId} aria-labelledby="simulation-details-tab-financial">
              <SimulationFinancialSnapshot content={viewModel.financialSection} />
              <SimulationFinancialSignalChart data={viewModel.financialChart} />
              <FinancialPendingNoteCard content={viewModel.financialPendingPlaceholder} />
            </div>
          ) : null}

          {activeTab === 'comparison' ? (
            <div className="space-y-4" role="tabpanel" id={tabPanelId} aria-labelledby="simulation-details-tab-comparison">
              <SimulationComparisonPositionCard content={viewModel.comparisonSection} />
              <RealDataNoticeCard content={viewModel.comparisonPlaceholder} />
            </div>
          ) : null}

          {activeTab === 'climate' ? (
            <div className="space-y-4" role="tabpanel" id={tabPanelId} aria-labelledby="simulation-details-tab-climate">
              <ClimateConditionsCard content={viewModel.climateSection} />
              <EducationalConclusionsCard />
            </div>
          ) : null}
        </div>
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
