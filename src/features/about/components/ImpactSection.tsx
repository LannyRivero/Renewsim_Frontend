const IMPACT_SIGNALS = [
  {
    title: 'Menos intuicion aislada',
    description: 'La plataforma ordena entradas y comparativas para bajar decisiones tomadas solo por percepcion.',
  },
  {
    title: 'Mas contexto financiero',
    description: 'Los escenarios no se quedan en rendimiento tecnico: se conectan con ahorro, retorno y viabilidad.',
  },
  {
    title: 'Mejor narrativa interna',
    description: 'El resultado final esta pensado para explicarse mejor frente a stakeholders y responsables de aprobacion.',
  },
]

export function ImpactSection() {
  return (
    <section className="rounded-[2rem] border border-[#d5ddd4] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(246,249,245,0.96)_100%)] p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.025)_100%)] lg:p-8">
      <div className="max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/56">
          Impacto
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark md:text-4xl">
          El valor no esta en decorar datos. Esta en volverlos accionables.
        </h2>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {IMPACT_SIGNALS.map((item) => (
          <article key={item.title} className="rounded-[1.5rem] border border-[#dde5dc] bg-white/84 p-5 dark:border-white/8 dark:bg-white/[0.03]">
            <div className="mb-4 h-1.5 w-14 rounded-full bg-[#1a6a45] dark:bg-emerald-400" />
            <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950 dark:text-content-dark">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-content-dark/62">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
