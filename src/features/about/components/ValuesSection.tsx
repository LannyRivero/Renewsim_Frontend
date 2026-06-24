const VALUES = [
  {
    title: 'Claridad antes que ornamento',
    description: 'Cada pantalla tiene que ayudar a entender una decision, no distraerla.',
  },
  {
    title: 'Rigor sin fricción innecesaria',
    description: 'La base técnica importa, pero tiene que presentarse con una experiencia entendible y útil.',
  },
  {
    title: 'Sostenibilidad con criterio de negocio',
    description: 'El discurso ambiental solo es serio cuando también conversa con viabilidad económica y operativa.',
  },
]

export function ValuesSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/56">
          Principios
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark md:text-4xl">
          La identidad del producto se sostiene en decisiones de fondo.
        </h2>
      </div>

      <div className="space-y-4">
        {VALUES.map((value) => (
          <article key={value.title} className="rounded-[1.6rem] border border-[#d5ddd4] bg-white/76 p-5 shadow-[0_22px_52px_-42px_rgba(15,23,42,0.36)] dark:border-white/10 dark:bg-white/[0.04]">
            <h3 className="text-lg font-black tracking-[-0.03em] text-slate-950 dark:text-content-dark">{value.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-content-dark/62">{value.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
