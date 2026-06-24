import { StepsSection } from './components/StepsSection'
import { CtaSection } from './components/CtaSection'

const SUMMARY_ITEMS = [
  { value: '01', label: 'Captura estructurada del contexto' },
  { value: '02', label: 'Modelo técnico y financiero alineado' },
  { value: '03', label: 'Lectura ejecutiva lista para decidir' },
]

export function HowItWorksPage() {
  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(48,97,74,0.11),transparent_34%),linear-gradient(180deg,#f7f9f6_0%,#eef3ec_46%,#f8faf7_100%)] px-4 py-16 sm:px-6 lg:px-8 lg:py-20 dark:bg-[radial-gradient(circle_at_top,rgba(34,84,59,0.34),rgba(8,16,13,0)_30%),linear-gradient(180deg,#0d1612_0%,#0b130f_100%)]">
      <div className="mx-auto w-full max-w-6xl">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1a6a45] dark:text-emerald-300">
              Método de trabajo
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-slate-950 dark:text-content-dark md:text-5xl xl:text-6xl">
              Cómo RenewSim transforma
              <span className="text-[#1a6a45] dark:text-emerald-400"> datos dispersos</span>
              en decisiones defendibles.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-content-dark/64">
              El flujo no se queda en una simulación bonita. Organiza entradas técnicas,
              estima comportamiento operativo, resume impacto financiero y entrega una
              salida clara para equipos que tienen que justificar una inversión.
            </p>
          </div>

          <div className="rounded-[1.8rem] border border-[#d5ddd4] bg-white/72 p-5 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/56">
              Lectura rápida
            </p>
            <div className="mt-4 space-y-3">
              {SUMMARY_ITEMS.map(({ value, label }) => (
                <div key={value} className="flex items-start gap-4 rounded-2xl bg-[#f6f9f5] px-4 py-3 dark:bg-white/[0.03]">
                  <span className="text-lg font-black tracking-[-0.04em] text-[#1a6a45] dark:text-emerald-300">{value}</span>
                  <p className="text-sm leading-6 text-slate-700 dark:text-content-dark/64">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <StepsSection />
        <CtaSection />
      </div>
    </div>
  )
}
