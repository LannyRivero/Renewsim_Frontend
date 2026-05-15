export function CtaSection() {
  return (
    <section className="mt-20 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-content-light dark:text-content-dark">
        ¿Listo para empezar?
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-subtle-light dark:text-subtle-dark">
        Inicia el simulador y descubre el potencial de la energía limpia para ti.
      </p>
      <div className="mt-8">
        <button
          type="button"
          className="flex mx-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-primary-container text-on-primary text-lg font-bold shadow-lg hover:brightness-110 transition-all"
        >
          Comenzar Simulación
        </button>
      </div>
    </section>
  )
}
