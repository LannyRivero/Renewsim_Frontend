interface Step {
  number: string
  icon: string
  title: string
  description: string
  checkpoint: string
}

const STEPS: Step[] = [
  {
    number: '01',
    icon: 'database',
    title: 'Captura del contexto energetico',
    description:
      'Se organiza ubicacion, consumo, restricciones y preferencia tecnologica para partir de una base comparable y sin ambiguedad.',
    checkpoint: 'Entrada clara y trazable',
  },
  {
    number: '02',
    icon: 'model_training',
    title: 'Simulacion tecnica con lectura economica',
    description:
      'El motor cruza variables operativas con rendimiento esperado, costos y retorno para aterrizar escenarios viables.',
    checkpoint: 'Analisis con criterio tecnico-financiero',
  },
  {
    number: '03',
    icon: 'fact_check',
    title: 'Resultado listo para defender decisiones',
    description:
      'La salida resume comparativas, impacto y narrativa ejecutiva para que negocio, operaciones y direccion hablen el mismo idioma.',
    checkpoint: 'Conclusion accionable',
  },
]

function StepCard({ number, icon, title, description, checkpoint }: Step) {
  return (
    <article className="rounded-[1.8rem] border border-[#d5ddd4] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(246,249,245,0.96)_100%)] p-6 shadow-[0_24px_52px_-42px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.025)_100%)]">
      <div className="flex items-start justify-between gap-4">
        <span className="text-4xl font-black leading-none tracking-[-0.06em] text-[#cfdbd1] dark:text-white/10">
          {number}
        </span>
        <div className="rounded-2xl bg-[#eaf1eb] p-3 dark:bg-emerald-400/10">
          <span className="material-symbols-outlined text-xl text-[#1a6a45] dark:text-emerald-300">{icon}</span>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-content-dark/56">
          {checkpoint}
        </p>
        <h3 className="mt-3 text-xl font-black tracking-[-0.03em] text-slate-950 dark:text-content-dark">
          {title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-content-dark/62">
          {description}
        </p>
      </div>
    </article>
  )
}

export function StepsSection() {
  return (
    <section className="mt-14">
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/56">
          Flujo de simulacion
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark md:text-4xl">
          Tres pasos. Mucha mas profundidad que una landing comun.
        </h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {STEPS.map((step) => (
          <StepCard key={step.title} {...step} />
        ))}
      </div>
    </section>
  )
}
