import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export interface NavLink {
  label: string
  href: string
  active?: boolean
}

interface NavbarProps {
  links?: NavLink[]
  cta?: ReactNode
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Simulador', href: '#' },
  { label: 'Comunidad', href: '#' },
  { label: 'Recursos', href: '#' },
]

function DefaultCta() {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container/20 dark:bg-primary-container/30 text-primary dark:text-primary-inverse hover:bg-primary-container/30 dark:hover:bg-primary-container/40 transition-colors cursor-pointer"
      >
        Iniciar Sesión
      </button>
      <button
        type="button"
        className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container text-on-primary hover:opacity-90 transition-opacity cursor-pointer"
      >
        Registrarse
      </button>
    </div>
  )
}

export function Navbar({ links = DEFAULT_LINKS, cta = <DefaultCta /> }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-border-light dark:border-border-dark">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold font-display text-content-light dark:text-content-dark">
            RenewSim
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) =>
            link.href.startsWith('/') ? (
              <Link
                key={link.label}
                to={link.href}
                className={
                  link.active
                    ? 'text-sm font-bold text-primary dark:text-primary-inverse'
                    : 'text-sm font-medium text-content-light dark:text-content-dark hover:text-primary dark:hover:text-primary-inverse transition-colors'
                }
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? 'text-sm font-bold text-primary dark:text-primary-inverse'
                    : 'text-sm font-medium text-content-light dark:text-content-dark hover:text-primary dark:hover:text-primary-inverse transition-colors'
                }
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* CTA */}
        {cta}
      </nav>
    </header>
  )
}
