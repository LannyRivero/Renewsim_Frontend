const IMPACT_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAzuqmOc6XhcAZ7hP6-_3UEbov3o3kqHegZ0n4BDg3Gisa0mAdK3ELROuuXuq6dLYleNaahTwLkNUmNZMFoI9h8atmAvX_NcvGHGrjtfTeIsvNbBjNdYmqxmTpQIP66tp6MRrKXJEefXzMzv9ufJYUJRHWE1szFzdfLvhyMTfdlShvFhLI341xOYL8HimcIrHAmTX0In0Y1_WOd7BpLN0DKeQxuJCtTaW8oELGMgdB5nEyCBeSS2fcUrAgKchYK1p9-Lc0-DzpUNAY'

export function ImpactSection() {
  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold text-on-surface dark:text-content-dark mb-4">
        Infografía de Impacto
      </h2>
      <div className="h-1 w-10 rounded-full accent-bar mb-6" />
      <div className="w-full aspect-[3/2] rounded-xl overflow-hidden border border-outline-variant dark:border-white/8 shadow-sm">
        <div
          className="w-full h-full bg-center bg-no-repeat bg-cover"
          style={{ backgroundImage: `url("${IMPACT_IMAGE_URL}")` }}
          role="img"
          aria-label="Infografía de impacto de energías renovables en el hogar y la comunidad"
        />
      </div>
    </section>
  )
}
