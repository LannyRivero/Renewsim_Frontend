import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  SimulationActionButton,
  SimulationCard,
  SimulationSectionHeader,
  SimulationTable,
  SimulationTableBodyRow,
  SimulationTableCell,
  SimulationTableContainer,
  SimulationTableHeadCell,
  SimulationTableHeaderRow,
} from '@/shared/components/SimulationPrimitives'
import { useSimulatorNav } from '../../../shared/hooks'

const PRIMARY_METRICS = [
  { label: 'ROI esperado', value: '18.4%' },
  { label: 'NPV', value: '$486K' },
  { label: 'Payback', value: '4.2 anos' },
  { label: 'CO2 evitado', value: '32 t' },
]

const SCENARIOS = [
  { name: 'Solar utility scale', location: 'Madrid', roi: '18.4%', status: 'Prioridad alta' },
  { name: 'Hibrido industrial', location: 'Valencia', roi: '16.8%', status: 'Viable' },
  { name: 'Eolico regional', location: 'Galicia', roi: '12.1%', status: 'Revision' },
]

const DECISION_DRIVERS = [
  'Mayor retorno frente a escenarios comparados',
  'Menor tiempo de recuperacion del capital',
  'Riesgo operativo dentro del rango aceptable',
]

const RISK_ITEMS = [
  { label: 'Demanda', value: 'Media' },
  { label: 'CAPEX', value: 'Controlado' },
  { label: 'Sensibilidad', value: 'Baja' },
]

export function HeroSection() {
  const goToSimulator = useSimulatorNav()
  const navigate = useNavigate()

  return (
    <section className="px-3 py-2 sm:px-4 lg:h-[calc(100vh-138px)] lg:px-5 lg:py-2">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 lg:h-full">
        <div className="flex flex-col gap-2 border-b border-[#d7dfd6] pb-2 dark:border-white/8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#627468] dark:text-content-dark/72">
              Consola de decisión para inversión renovable
            </p>
            <h1 className="mt-2 max-w-5xl text-[1.82rem] font-black leading-[0.98] tracking-[-0.05em] text-[#122033] dark:text-content-dark sm:text-[2.08rem] lg:text-[2.38rem] xl:text-[2.58rem]">
              Decisiones renovables con contexto técnico y financiero.
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <SimulationActionButton variant="primary" onClick={goToSimulator}>
              Abrir simulador
            </SimulationActionButton>
            <Button
              variant="outline"
              size="lg"
              className="rounded-sm border-[#c8d2c7] bg-[#f7faf6] px-4 font-semibold text-[#3d5144] hover:border-[#b8c6b8] hover:bg-[#f1f5ef] dark:border-white/15 dark:bg-white/10 dark:text-content-dark dark:hover:bg-white/16"
              onClick={() => navigate('/como-funciona')}
            >
              Ver metodologia
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-[#cfd8ce] bg-[#e9efe8] shadow-[0_22px_46px_-30px_rgba(15,23,42,0.24)] dark:border-white/8 dark:bg-[#0f1814] lg:min-h-0 lg:flex-1">
          <div className="grid min-h-[560px] lg:h-full lg:min-h-0 lg:grid-cols-[190px_minmax(0,1fr)] xl:min-h-0">
            <aside className="border-b border-[#d4ddd3] bg-[linear-gradient(180deg,#e6ece6_0%,#e0e7e0_100%)] px-3 py-3 dark:border-white/8 dark:bg-[linear-gradient(180deg,#14211b_0%,#101a15_100%)] lg:border-b-0 lg:border-r">
              <div className="border-b border-[#d6dfd5] pb-4 dark:border-white/8">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-content-dark/56">
                  RenewSim console
                </p>
                <p className="mt-2 text-lg font-bold tracking-[-0.03em] text-[#1c2a22] dark:text-content-dark">
                  Inversión renovable
                </p>
              </div>

              <div className="mt-3 space-y-1">
                <div className="rounded-sm bg-[#4a7e63] px-3 py-2.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-white/12 dark:text-content-dark">
                  Resumen ejecutivo
                </div>
                <div className="rounded-sm px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-content-dark/64">Portafolio</div>
                <div className="rounded-sm px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-content-dark/64">Comparación</div>
                <div className="rounded-sm px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-content-dark/64">Riesgos</div>
                <div className="rounded-sm px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-content-dark/64">Comite</div>
              </div>

              <SimulationCard tone="soft" density="compact" className="mt-4 rounded-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/55">
                  Estado de lectura
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-content-dark">
                  Caso listo para revision ejecutiva.
                </p>
              </SimulationCard>
            </aside>

            <div className="bg-[linear-gradient(180deg,#f9fbf8_0%,#f4f8f3_100%)] p-3 dark:bg-[linear-gradient(180deg,#131d18_0%,#0f1714_100%)] sm:p-4 lg:h-full lg:p-3">
              <div className="grid gap-2.5 lg:h-full xl:grid-cols-[minmax(0,1.7fr)_290px]">
                <div className="grid gap-3">
                  <SimulationCard className="rounded-sm">
                    <SimulationSectionHeader
                      eyebrow="Resumen ejecutivo"
                      title="Portafolio de simulación"
                      description="Lectura consolidada para comparar escenarios, entender retorno y sostener una recomendación ante dirección."
                      actions={
                        <div className="rounded-sm border border-[#ccd5cc] bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#4a6154] dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark/72">
                          Actualizado hace 2 min
                        </div>
                      }
                    />

                    <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                      {PRIMARY_METRICS.map((item) => (
                        <SimulationCard key={item.label} density="compact" className="rounded-sm">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                            {item.label}
                          </p>
                          <p className="mt-2 text-[1.58rem] font-black tracking-[-0.045em] text-[#14261c] dark:text-content-dark">
                            {item.value}
                          </p>
                        </SimulationCard>
                      ))}
                    </div>

                    <div className="mt-2.5 grid gap-2 xl:grid-cols-[minmax(0,1.42fr)_230px]">
                      <SimulationCard density="compact" className="rounded-sm">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                          Escenarios priorizados
                        </p>
                        <SimulationTableContainer>
                          <SimulationTable>
                            <thead>
                              <SimulationTableHeaderRow>
                                <SimulationTableHeadCell>Escenario</SimulationTableHeadCell>
                                <SimulationTableHeadCell>ROI</SimulationTableHeadCell>
                                <SimulationTableHeadCell>Estado</SimulationTableHeadCell>
                              </SimulationTableHeaderRow>
                            </thead>
                            <tbody>
                              {SCENARIOS.map((row) => (
                                <SimulationTableBodyRow key={row.name}>
                                  <SimulationTableCell>
                                    <div>
                                      <p className="font-semibold text-slate-900 dark:text-content-dark">{row.name}</p>
                                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-content-dark/55">
                                        {row.location}
                                      </p>
                                    </div>
                                  </SimulationTableCell>
                                  <SimulationTableCell className="font-semibold text-slate-800 dark:text-content-dark">{row.roi}</SimulationTableCell>
                                  <SimulationTableCell>
                                    <span className="inline-flex rounded-sm border border-[#ccd6cb] bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#3f5548] dark:border-white/12 dark:bg-white/[0.04] dark:text-content-dark/70">
                                      {row.status}
                                    </span>
                                  </SimulationTableCell>
                                </SimulationTableBodyRow>
                              ))}
                            </tbody>
                          </SimulationTable>
                        </SimulationTableContainer>
                      </SimulationCard>

                      <SimulationCard tone="soft" density="compact" className="rounded-sm">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                          Perfil de riesgo
                        </p>
                        <div className="mt-3 space-y-2">
                          {RISK_ITEMS.map((item) => (
                            <div key={item.label} className="flex items-center justify-between border-b border-[#dde5dc] pb-3 last:border-b-0 last:pb-0 dark:border-white/8">
                              <p className="text-sm text-slate-700 dark:text-content-dark/66">{item.label}</p>
                              <span className="text-sm font-semibold text-slate-900 dark:text-content-dark">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </SimulationCard>
                    </div>
                  </SimulationCard>

                </div>

                <SimulationCard tone="soft" className="rounded-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                    Decision brief
                  </p>

                  <div className="mt-3 space-y-3">
                    <div className="border-b border-[#dde5dc] pb-3 dark:border-white/8">
                      <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Escenario recomendado</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-content-dark/64">
                        Solar utility scale muestra el mejor equilibrio entre retorno, ahorro anual y recuperación del capital.
                      </p>
                    </div>

                    <div className="border-b border-[#dde5dc] pb-3 dark:border-white/8">
                      <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Drivers de la decisión</p>
                      <div className="mt-2 space-y-1.5">
                        {DECISION_DRIVERS.map((item) => (
                          <div key={item} className="rounded-sm border border-[#d8dfd7] bg-white px-3 py-2 text-sm text-slate-700 shadow-[0_8px_16px_-20px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-white/[0.03] dark:text-content-dark/66">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-content-dark">Siguiente paso</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-content-dark/64">
                        Validar supuestos de demanda y elevar la recomendación al comité.
                      </p>
                    </div>
                  </div>
                </SimulationCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
