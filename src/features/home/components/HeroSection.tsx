import { Link } from 'react-router-dom'

const HERO_IMAGE_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBlfUlH7I09N_-5Y-O_oWlHRAaQNAGjelP5ZqmOxu46t8WSlHCty7bi602_7OuB2b2znbgzXcez66lLSxAeROzkW2Yd16Hbl6TMN9ledigYcMgRnrVLhFZM19REXz1eRgJCNyytigdXa2HBUbvGYd_zHDHcUCmo-ysuhdp25xqnKnP1Q1YJzl-1m31fUlfzmch3RNDppWCyFanl42GLSdYN-xUu2MEJyxayZs9Nmd8gfcBCQZ3DAdSLIB5VhZi6_Kg8dmmKhkda-tI'

export function HeroSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tighter text-content-light dark:text-content-dark">
            Simula. Compara.{' '}
            <br className="hidden md:inline" />
            <span className="text-primary">Optimiza</span> tus decisiones
            energéticas.
          </h1>

          <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-base md:text-lg text-subtle-light dark:text-subtle-dark">
            RenewSim es un simulador educativo, visual y accesible, que permite
            a cualquier persona comprender el impacto, costos y beneficios de
            diferentes fuentes de energía limpia mediante simulaciones
            interactivas y recomendaciones potenciadas por Inteligencia
            Artificial.
          </p>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              type="button"
              className="px-6 py-3 rounded-lg text-base font-bold bg-primary text-background-dark hover:opacity-90 transition-opacity shadow-lg cursor-pointer"
            >
              Iniciar Simulación
            </button>
            <Link
              to="/como-funciona"
              className="px-6 py-3 rounded-lg text-base font-bold bg-primary/20 dark:bg-primary/30 text-primary hover:bg-primary/30 dark:hover:bg-primary/40 transition-colors"
            >
              Más Información
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div
          className="w-full h-64 sm:h-80 lg:h-96 rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url("${HERO_IMAGE_URL}")` }}
          role="img"
          aria-label="Fuentes de energía renovable: paneles solares, turbinas eólicas y energía hidráulica"
        />
      </div>
    </section>
  )
}
