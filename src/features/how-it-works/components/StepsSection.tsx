interface Step {
  number: string
  icon: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: 'database',
    title: 'Enter your data',
    description:
      'Provide your location, current consumption, and energy preferences for an accurate simulation.',
  },
  {
    number: '02',
    icon: 'calculate',
    title: 'Advanced simulation',
    description:
      'Our algorithms process your data to model the performance and costs of each energy source.',
  },
  {
    number: '03',
    icon: 'insights',
    title: 'Get results',
    description:
      'Receive a detailed report with interactive visualizations and personalized recommendations.',
  },
]

function StepCard({ number, icon, title, description }: Step) {
  return (
    <div className="card rounded-2xl p-8 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <span className="text-4xl font-extrabold text-outline-variant dark:text-white/10 leading-none select-none tabular-nums">
          {number}
        </span>
        <div className="p-2.5 rounded-xl bg-primary-container/12 dark:bg-primary-container/15">
          <span className="material-symbols-outlined text-primary dark:text-primary-inverse text-xl">{icon}</span>
        </div>
      </div>
      <div>
        <h3 className="text-base font-bold text-on-surface dark:text-content-dark">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-on-surface-variant dark:text-content-dark/55">{description}</p>
      </div>
    </div>
  )
}

export function StepsSection() {
  return (
    <section className="mt-16 grid md:grid-cols-3 gap-5">
      {STEPS.map((step) => (
        <StepCard key={step.title} {...step} />
      ))}
    </section>
  )
}
