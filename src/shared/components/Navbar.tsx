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
  { label: 'Como funciona', href: '/como-funciona' },
  { label: 'Acerca de', href: '/acerca-de' },
  { label: 'Simulador', href: '#' },
]

function DefaultCta() {
  return (
    <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface dark:text-content-dark border border-outline-variant dark:border-white/10 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          Iniciar sesion
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container text-on-primary hover:brightness-95 transition-all cursor-pointer"
        >
          Crear cuenta
        </button>
      </div>
  )
}

export function Navbar({ links = DEFAULT_LINKS, cta = <DefaultCta /> }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-outline-variant dark:border-white/8">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-bold font-display text-on-surface dark:text-content-dark">
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
                    ? 'text-sm font-semibold text-primary dark:text-primary-inverse'
                    : 'text-sm font-medium text-on-surface-variant dark:text-content-dark/60 hover:text-on-surface dark:hover:text-content-dark transition-colors'
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
                    ? 'text-sm font-semibold text-primary dark:text-primary-inverse'
                    : 'text-sm font-medium text-on-surface-variant dark:text-content-dark/60 hover:text-on-surface dark:hover:text-content-dark transition-colors'
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
