interface Feature {
  icon: string
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: 'settings_suggest',
    title: 'Custom simulation',
    description:
      'Adapt simulations to your needs and specific scenarios to obtain accurate results.',
  },
  {
    icon: 'bar_chart',
    title: 'Visual comparison',
    description:
      'Compare performance, costs, and environmental impact across different energy sources.',
  },
  {
    icon: 'psychology',
    title: 'Predictive AI',
    description:
      'Smart recommendations based on predictive analysis to optimize your decisions.',
  },
  {
    icon: 'eco',
    title: 'Environmental education',
    description:
      'Learn about the environmental impact of clean energy in an interactive way.',
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
            Capabilities
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface dark:text-content-dark">
            Why is RenewSim different?
          </h2>
          <p className="mt-4 text-base text-on-surface-variant dark:text-content-dark/55">
            A platform designed so professionals and companies can make
            energy decisions with confidence and precision.
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
