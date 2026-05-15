import { Navbar, type NavLink } from '../../shared/components/Navbar'
import { Footer } from '../../shared/components/Footer'
import { StepsSection } from './components/StepsSection'
import { CtaSection } from './components/CtaSection'

const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '#' },
  { label: 'Simulador', href: '#' },
  { label: 'Fuentes de Energía', href: '#' },
  { label: 'Cómo Funciona', href: '#', active: true },
  { label: 'Acerca de', href: '#' },
]

function NavCta() {
  return (
    <button
      type="button"
      className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary text-background-dark text-sm font-bold shadow-sm hover:brightness-110 transition-all"
    >
      Comenzar Simulación
    </button>
  )
}

export function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar links={NAV_LINKS} cta={<NavCta />} />

      <main className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          {/* Page heading */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-content-light dark:text-content-dark">
              Cómo Funciona RenewSim
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-subtle-light dark:text-subtle-dark">
              Nuestro proceso de simulación está diseñado para ser simple,
              transparente y poderoso, guiándote en cada paso para tomar
              decisiones energéticas informadas.
            </p>
          </div>

          <StepsSection />
          <CtaSection />
        </div>
      </main>

      <Footer />
    </div>
  )
}
