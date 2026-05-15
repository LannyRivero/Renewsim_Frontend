interface Step {
  icon: string
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    icon: 'database',
    title: '1. Ingresa tus Datos',
    description:
      'Proporciona información sobre tu ubicación, consumo de energía actual y tus preferencias energéticas.',
  },
  {
    icon: 'calculate',
    title: '2. Simulación Avanzada',
    description:
      'Nuestros algoritmos procesan tus datos para simular el rendimiento y costo de diversas fuentes de energía limpia.',
  },
  {
    icon: 'insights',
    title: '3. Obtén Resultados',
    description:
      'Recibe un informe detallado con visualizaciones interactivas y recomendaciones personalizadas para tu futuro energético.',
  },
]

function StepCard({ icon, title, description }: Step) {
  return (
    <div className="flex flex-col items-center gap-y-4 w-1/3 text-center">
      <div className="flex items-center justify-center size-16 rounded-full bg-primary-container/20 dark:bg-primary-container/30 border-2 border-primary-container z-10 bg-background-light dark:bg-background-dark">
        <span className="material-symbols-outlined text-primary dark:text-primary-inverse text-4xl">
          {icon}
        </span>
      </div>
      <h3 className="text-xl font-bold text-content-light dark:text-content-dark">
        {title}
      </h3>
      <p className="text-subtle-light dark:text-subtle-dark px-4">
        {description}
      </p>
    </div>
  )
}

export function StepsSection() {
  return (
    <section className="mt-16">
      <div className="relative">
        {/* Dashed connecting line */}
        <div aria-hidden="true" className="absolute inset-0 flex items-start justify-center pt-8">
          <div className="w-full h-0.5 border-t-2 border-dashed border-border-light dark:border-border-dark" />
        </div>

        {/* Step cards */}
        <div className="relative flex justify-between">
          {STEPS.map((step) => (
            <StepCard key={step.title} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
