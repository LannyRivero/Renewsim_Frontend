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
      'Compara fácilmente el rendimiento, los costos y el impacto ambiental de diferentes fuentes de energía.',
  },
  {
    icon: 'psychology',
    title: 'IA predictiva',
    description:
      'Recibe recomendaciones inteligentes basadas en análisis predictivos para optimizar tus decisiones.',
  },
  {
    icon: 'eco',
    title: 'Educación ambiental',
    description:
      'Aprende sobre el impacto ambiental y los beneficios de las energías limpias de forma interactiva.',
  },
]

function FeatureCard({ icon, title, description }: Feature) {
  return (
    <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg border border-border-light dark:border-border-dark flex flex-col items-start text-left gap-4 transition-transform hover:-translate-y-1">
      <div className="p-3 rounded-full bg-primary/20 text-primary">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-content-light dark:text-content-dark">
        {title}
      </h3>
      <p className="text-sm text-subtle-light dark:text-subtle-dark">
        {description}
      </p>
    </div>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-24 bg-primary/5 dark:bg-primary/10">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-content-light dark:text-content-dark">
            ¿Por qué RenewSim es diferente?
          </h2>
          <p className="mt-4 text-base md:text-lg text-subtle-light dark:text-subtle-dark">
            Descubre las ventajas de nuestra plataforma. Ofrecemos una
            experiencia única para explorar el futuro de las energías renovables.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
