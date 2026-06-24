import { Link } from 'react-router-dom'
import { useSimulatorNav } from '../../../shared/hooks'

const KPI_CARDS = [
  { value: '8.4 MWh', label: 'Energia proyectada anual', icon: 'bolt', delta: '+12%' },
  { value: '$1,240', label: 'Ahorro estimado anual', icon: 'savings', delta: '+8%' },
  { value: '3.2 t', label: 'CO2 evitado al ano', icon: 'eco', delta: '-18%' },
  { value: '4.2 anos', label: 'Retorno estimado', icon: 'trending_up', delta: null },
]

const PROOF_POINTS = [
  { value: '+10K', label: 'Escenarios evaluados' },
  { value: '98%', label: 'Trazabilidad operativa' },
  { value: '50+', label: 'Equipos analizando inversiones' },
]

const FOCUS_AREAS = ['Solar', 'Eolica', 'Biomasa', 'Escenarios hibridos']

export function HeroSection() {
  const goToSimulator = useSimulatorNav()

  return (
    <section className="relative py-20 sm:py-28 lg:py-32">
      <div className="absolute inset-x-0 top-8 -z-10 mx-auto h-72 w-72 rounded-full bg-[#2f6b4f]/12 blur-3xl dark:bg-emerald-500/12" />
      <div className="container mx-auto px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] lg:gap-10 xl:gap-16">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cfd9ce] bg-white/72 px-3 py-1.5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <span className="size-1.5 rounded-full bg-[#1a6a45] dark:bg-emerald-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/55">
                Plataforma de decision energetica
              </span>
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-[-0.05em] text-slate-950 dark:text-content-dark md:text-6xl xl:text-[4.8rem]">
              Inteligencia para decidir
              <br className="hidden sm:inline" />
              <span className="text-[#1a6a45] dark:text-emerald-400"> inversiones energeticas</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-content-dark/65 lg:mx-0 lg:max-w-xl">
              RenewSim convierte escenarios tecnicos en decisiones ejecutivas claras.
              Simula fuentes renovables, compara riesgo, costo y retorno, y presenta
              resultados con una lectura sobria lista para equipos enterprise.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              <button
                type="button"
                onClick={goToSimulator}
                className="rounded-xl bg-[#1a6a45] px-8 py-3.5 text-base font-bold text-white shadow-[0_16px_30px_-24px_rgba(26,106,69,0.65)] transition-all hover:brightness-95"
              >
                Ir al simulador
              </button>
              <Link
                to="/como-funciona"
                className="rounded-xl border border-[#d1dad0] bg-white/78 px-8 py-3.5 text-base font-semibold text-slate-900 transition-colors hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-content-dark dark:hover:bg-white/8"
              >
                Ver funcionamiento
              </Link>
            </div>

            <div className="mt-12 grid gap-3 rounded-[1.75rem] border border-[#d5ddd4] bg-white/70 p-4 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.35)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-3">
              {PROOF_POINTS.map(({ value, label }) => (
                <div key={label} className="rounded-2xl bg-[#f7faf6] px-4 py-4 text-left dark:bg-white/[0.03]">
                  <p className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-content-dark/52">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 top-8 hidden h-28 w-28 rounded-full border border-[#d7e0d6] bg-white/55 blur-2xl dark:border-white/10 dark:bg-emerald-400/10 lg:block" />
            <div className="rounded-[2rem] border border-[#d5ddd4] bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(245,248,243,0.92)_100%)] p-5 shadow-[0_28px_70px_-44px_rgba(15,23,42,0.42)] backdrop-blur-sm dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.025)_100%)]">
              <div className="flex items-start justify-between gap-4 border-b border-[#dbe2da] pb-4 dark:border-white/10">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/55">
                    Vista ejecutiva
                  </p>
                  <p className="mt-2 text-xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark">
                    Portafolio solar · Madrid
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/60">
                    Resumen operativo para analisis de inversion y aprobacion interna.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f1eb] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a6a45] dark:bg-emerald-400/10 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-[#1a6a45] dark:bg-emerald-400" />
                  Activo
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {KPI_CARDS.map(({ value, label, icon, delta }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-[#dce4db] bg-white/82 px-4 py-3.5 dark:border-white/8 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#eef4ef] p-2 dark:bg-emerald-400/10">
                        <span className="material-symbols-outlined text-lg text-[#1a6a45] dark:text-emerald-300">{icon}</span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-content-dark/62">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-950 dark:text-content-dark">{value}</span>
                      {delta ? (
                        <span className="rounded-md bg-[#eef4ef] px-1.5 py-0.5 text-[11px] font-bold text-[#1a6a45] dark:bg-emerald-400/10 dark:text-emerald-300">
                          {delta}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-[#dce4db] bg-[#f6f9f5] p-4 dark:border-white/8 dark:bg-white/[0.03]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                      Cobertura de analisis
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/62">
                      Unifica simulacion tecnica, lectura financiera y narrativa ejecutiva.
                    </p>
                  </div>
                  <p className="text-2xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark">87%</p>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#dbe4da] dark:bg-white/10">
                  <div className="h-full w-[87%] rounded-full bg-[#1a6a45] dark:bg-emerald-400" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {FOCUS_AREAS.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#d1dad0] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/8 dark:bg-white/[0.04] dark:text-content-dark/58"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
