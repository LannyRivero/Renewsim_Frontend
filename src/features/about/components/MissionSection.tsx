export function MissionSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 dark:text-content-dark/56">
          Mision
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950 dark:text-content-dark md:text-4xl">
          Traducir complejidad técnica en claridad para decidir.
        </h2>
      </div>

      <div className="rounded-[1.8rem] border border-[#d5ddd4] bg-white/76 p-6 shadow-[0_22px_52px_-42px_rgba(15,23,42,0.36)] dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-base leading-8 text-slate-700 dark:text-content-dark/64">
          No buscamos solo mostrar simulaciones. Buscamos que una persona o un equipo
          pueda comparar fuentes renovables, entender implicaciones operativas y ver
          el impacto económico sin perderse en ruido visual ni en tecnicismos mal explicados.
        </p>
        <p className="mt-5 text-base leading-8 text-slate-700 dark:text-content-dark/64">
          La visión es simple: que la transición energética se apoye en herramientas
          más sobrias, más útiles y más defendibles frente a negocio, operaciones y dirección.
        </p>
      </div>
    </section>
  )
}
