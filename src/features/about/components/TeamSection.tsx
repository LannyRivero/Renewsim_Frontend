export function TeamSection() {
  return (
    <section className="rounded-[2rem] border border-[#d5ddd4] bg-[linear-gradient(135deg,rgba(26,106,69,0.98)_0%,rgba(43,88,68,0.98)_100%)] px-6 py-8 text-white shadow-[0_28px_70px_-44px_rgba(26,106,69,0.55)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(18,71,49,1)_0%,rgba(25,52,40,1)_100%)] lg:px-8 lg:py-9">
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/68">
        Equipo y creditos
      </p>
      <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] md:text-4xl">
        RenewSim existe por una convicción compartida, no por una página de marketing.
      </h2>
      <p className="mt-5 max-w-3xl text-base leading-8 text-white/80">
        Detrás del producto hay colaboración entre personas interesadas en energía,
        educación y tecnología aplicada. Valoramos a quienes aportan criterio técnico,
        validación, contexto y empuje para que la herramienta sirva de verdad.
      </p>
      <p className="mt-4 max-w-3xl text-base leading-8 text-white/74">
        El objetivo no es solo construir una app correcta. Es construir una herramienta
        que ayude a tomar mejores decisiones en la transición energética.
      </p>
    </section>
  )
}
