import { SimulationCard, SimulationSectionHeader } from '@/shared/components/SimulationPrimitives'

const DECISION_FLOW = [
  {
    step: '01',
    title: 'Entrada estructurada',
    description: 'Tecnología, ubicación, capacidad, supuestos económicos y restricciones operativas se ordenan antes del análisis.',
  },
  {
    step: '02',
    title: 'Comparación consistente',
    description: 'Todos los escenarios se leen bajo la misma lógica para evitar comparaciones sesgadas o narrativas parciales.',
  },
  {
    step: '03',
    title: 'Salida defendible',
    description: 'El resultado final resume viabilidad, retorno y prioridad para sostener una decisión ante negocio y dirección.',
  },
]

const READING_MODES = [
  {
    title: 'Lectura tecnica',
    description: 'Producción, desempeño del sistema, sensibilidad y consistencia del escenario.',
  },
  {
    title: 'Lectura financiera',
    description: 'ROI, ahorro, payback y exposición económica explicados para negocio.',
  },
  {
    title: 'Lectura ejecutiva',
    description: 'Una conclusión útil para priorizar, presentar o descartar una inversión.',
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-[#d9e1d8] px-3 py-8 sm:px-4 lg:px-5 lg:py-10 dark:border-white/8">
      <div className="mx-auto grid w-full max-w-[1600px] gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        <SimulationCard className="rounded-sm shadow-[0_18px_34px_-32px_rgba(15,23,42,0.18)]">
          <SimulationSectionHeader
            eyebrow="Cómo funciona"
            title="Una simulación útil no termina en un número"
            description="La plataforma está pensada para pasar de datos dispersos a una recomendación que un equipo pueda usar de verdad."
          />

          <div className="mt-4 grid gap-3">
            {DECISION_FLOW.map((item) => (
              <div key={item.step} className="grid gap-3 border-b border-[#dde5dc] pb-3 last:border-b-0 last:pb-0 dark:border-white/8 sm:grid-cols-[48px_minmax(0,1fr)]">
                <p className="text-xl font-black tracking-[-0.045em] text-[#1a6a45] dark:text-emerald-300">{item.step}</p>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-content-dark">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-content-dark/64">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SimulationCard>

        <div className="grid gap-3">
          {READING_MODES.map((item) => (
            <SimulationCard key={item.title} tone="soft" className="rounded-sm shadow-[0_16px_30px_-30px_rgba(15,23,42,0.12)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#51665a] dark:text-content-dark/72">
                {item.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-content-dark/64">{item.description}</p>
            </SimulationCard>
          ))}
        </div>
      </div>
    </section>
  )
}
