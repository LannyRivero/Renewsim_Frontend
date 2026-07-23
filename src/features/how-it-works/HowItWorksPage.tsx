import { SimulationCard, SimulationSectionHeader } from '@/shared/components/SimulationPrimitives'
import { StepsSection } from './components/StepsSection'
import { CtaSection } from './components/CtaSection'

const SUMMARY_ITEMS = [
  { label: 'Entrada', value: 'Contexto técnico y económico estructurado' },
  { label: 'Motor', value: 'Comparación consistente entre escenarios' },
  { label: 'Salida', value: 'Recomendación defendible para decidir' },
]

export function HowItWorksPage() {
  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(52,88,69,0.08),transparent_30%),linear-gradient(180deg,#f4f7f2_0%,#edf2eb_48%,#f3f7f2_100%)] px-3 py-2 sm:px-4 lg:h-[calc(100vh-138px)] lg:px-5 lg:py-2 dark:bg-[radial-gradient(circle_at_top,rgba(34,84,59,0.28),rgba(8,16,13,0)_30%),linear-gradient(180deg,#0c1511_0%,#0a120f_100%)]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-2 lg:h-full">
        <section className="grid gap-2 border-b border-[#d7dfd6] pb-2 dark:border-white/8 xl:grid-cols-[minmax(0,1.05fr)_380px] xl:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#627468] dark:text-content-dark/72">
              Metodología
            </p>
            <h1 className="mt-2 max-w-5xl text-[1.7rem] font-black leading-[0.98] tracking-[-0.05em] text-[#122033] dark:text-content-dark sm:text-[1.9rem] lg:text-[2.1rem] xl:text-[2.28rem]">
              Cómo RenewSim transforma datos dispersos en decisiones defendibles.
            </h1>
            <p className="mt-2.5 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/64 sm:text-[0.95rem]">
              El producto ordena entradas técnicas, aplica una lectura financiera consistente y entrega una salida clara para equipos que tienen que justificar una inversión.
            </p>
          </div>

          <SimulationCard tone="soft" className="rounded-sm">
            <SimulationSectionHeader
              eyebrow="Lectura rápida"
              title="Tres capas de decisión"
              description="La metodología está pensada para que negocio, operaciones y dirección hablen sobre la misma base."
            />

            <div className="mt-3 space-y-2">
              {SUMMARY_ITEMS.map((item) => (
                <div key={item.label} className="grid gap-1 border-b border-[#dde5dc] pb-2 last:border-b-0 last:pb-0 dark:border-white/8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#51665a] dark:text-content-dark/72">
                    {item.label}
                  </p>
                  <p className="text-sm leading-6 text-slate-700 dark:text-content-dark/64">{item.value}</p>
                </div>
              ))}
            </div>
          </SimulationCard>
        </section>

        <div className="grid gap-2 lg:flex-1 lg:grid-rows-[minmax(0,1fr)_auto]">
          <StepsSection />
          <CtaSection />
        </div>
      </div>
    </div>
  )
}
