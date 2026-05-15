import { Navbar, Footer, type NavLink } from '../../shared/components'
import { MissionSection } from './components/MissionSection'
import { ImpactSection } from './components/ImpactSection'
import { ValuesSection } from './components/ValuesSection'
import { TeamSection } from './components/TeamSection'

const NAV_LINKS: NavLink[] = [
  { label: 'Simulador', href: '#' },
  { label: 'Aprende', href: '#' },
  { label: 'Comunidad', href: '#' },
  { label: 'Acerca de', href: '#', active: true },
]

function NavCta() {
  return (
    <div className="hidden md:flex items-center gap-2">
      <button
        type="button"
        className="px-4 py-2 rounded-lg text-sm font-bold text-content-light dark:text-content-dark hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors cursor-pointer"
      >
        Iniciar sesión
      </button>
      <button
        type="button"
        className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-background-dark hover:opacity-80 transition-colors cursor-pointer"
      >
        Comenzar
      </button>
    </div>
  )
}

export function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar links={NAV_LINKS} cta={<NavCta />} />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            {/* Page title */}
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-content-light dark:text-content-dark">
                Nuestra Misión y Visión
              </h1>
            </header>

            {/* Content sections */}
            <div className="space-y-12">
              <MissionSection />
              <ImpactSection />
              <ValuesSection />
              <TeamSection />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
