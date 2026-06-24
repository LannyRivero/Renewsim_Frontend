interface Feature {
  icon: string
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: 'account_tree',
    title: 'Escenarios comparables',
    description: 'Contrasta alternativas tecnológicas bajo la misma lógica para decidir con menos ruido y más criterio.',
  },
  {
    icon: 'finance_mode',
    title: 'Lectura financiera clara',
    description: 'Resume retorno, ahorro y exposición económica con un lenguaje útil para negocio y dirección.',
  },
  {
    icon: 'monitoring',
    title: 'Analitica accionable',
    description: 'Convierte datos técnicos en señales entendibles para priorizar inversiones y planes energéticos.',
  },
  {
    icon: 'verified',
    title: 'Presentacion sobria',
    description: 'Interfaz limpia, consistente y preparada para mostrar resultados con confianza frente a stakeholders.',
  },
]

const OPERATING_PRINCIPLES = [
  'Menos adornos, más claridad ejecutiva',
  'Comparación técnica y financiera en una sola lectura',
  'Preparado para equipos que necesitan justificar decisiones',
]

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="rounded-[1.6rem] border border-[#d5ddd4] bg-[linear-gradient(180deg,rgba(255,255,255,0.86)_0%,rgba(246,249,245,0.95)_100%)] p-6 shadow-[0_20px_44px_-38px_rgba(15,23,42,0.38)] transition-all duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.025)_100%)]">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#e9f1eb] dark:bg-emerald-400/10">
        <span className="material-symbols-outlined text-2xl text-[#1a6a45] dark:text-emerald-300">{icon}</span>
      </div>
      <h3 className="mt-5 text-lg font-black tracking-[-0.03em] text-slate-950 dark:text-content-dark">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-content-dark/60">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="border-t border-[#d9e1d8] py-24 dark:border-white/8">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a6a45] dark:text-emerald-300">
              Capacidades clave
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark md:text-4xl">
              Una home con presencia enterprise necesita comunicar control, no gritar.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-content-dark/62">
              RenewSim tiene que verse como un producto serio: menos landing genérica,
              más estructura, jerarquía y confianza visual. Esta base ya empuja esa dirección.
            </p>

            <div className="mt-8 rounded-[1.7rem] border border-[#d5ddd4] bg-white/75 p-5 shadow-[0_24px_54px_-42px_rgba(15,23,42,0.34)] dark:border-white/10 dark:bg-white/[0.035]">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/55">
                Principios de producto
              </p>
              <div className="mt-4 space-y-3">
                {OPERATING_PRINCIPLES.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-[#f6f9f5] px-4 py-3 dark:bg-white/[0.03]">
                    <span className="material-symbols-outlined mt-0.5 text-[18px] text-[#1a6a45] dark:text-emerald-300">done</span>
                    <p className="text-sm leading-6 text-slate-700 dark:text-content-dark/65">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
