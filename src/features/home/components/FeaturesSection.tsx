interface Feature {
  icon: string
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: 'settings_suggest',
    title: 'Simulación personalizada',
    description:
      'Adapta las simulaciones a tus necesidades y escenarios específicos para obtener resultados precisos.',
  },
  {
    icon: 'bar_chart',
    title: 'Comparación visual',
    description:
      'Compara el rendimiento, los costos y el impacto ambiental de diferentes fuentes de energía.',
  },
  {
    icon: 'psychology',
    title: 'IA predictiva',
    description:
      'Recomendaciones inteligentes basadas en análisis predictivos para optimizar tus decisiones.',
  },
  {
    icon: 'eco',
    title: 'Educación ambiental',
    description:
      'Aprende sobre el impacto ambiental de las energías limpias de forma interactiva.',
  },
]

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="card rounded-2xl p-7 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className="p-3 w-fit rounded-xl bg-primary-container/12 dark:bg-primary-container/15">
        <span className="material-symbols-outlined text-primary dark:text-primary-inverse text-2xl">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-on-surface dark:text-content-dark">{title}</h3>
      <p className="text-sm leading-relaxed text-on-surface-variant dark:text-content-dark/55">{description}</p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-24 bg-surface-container-low dark:bg-white/2 border-y border-outline-variant dark:border-white/6">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary dark:text-primary-inverse mb-3">
            Capacidades
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface dark:text-content-dark">
            ¿Por qué RenewSim es diferente?
          </h2>
          <p className="mt-4 text-base text-on-surface-variant dark:text-content-dark/55">
            Una plataforma diseñada para que profesionales y empresas tomen
            decisiones energéticas con confianza y precisión.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
