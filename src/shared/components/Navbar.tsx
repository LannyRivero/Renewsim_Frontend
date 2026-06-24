import { useState, type ReactNode } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function renderLink(link: NavLink, onNavigate?: () => void) {
    const className = link.active
      ? 'text-sm font-semibold text-primary dark:text-primary-inverse'
      : 'text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface dark:text-content-dark/60 dark:hover:text-content-dark'

    return link.href.startsWith('/') ? (
      <Link key={link.label} to={link.href} className={className} onClick={onNavigate}>
        {link.label}
      </Link>
    ) : (
      <a key={link.label} href={link.href} className={className} onClick={onNavigate}>
        {link.label}
      </a>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-outline-variant dark:border-white/8">
      <nav className="container mx-auto px-4 py-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <Logo />
            <span className="truncate text-lg font-bold font-display text-on-surface dark:text-content-dark sm:text-xl">
              RenewSim
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => renderLink(link))}
          </div>

          <div className="hidden md:block">
            {cta}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant px-3 py-2 text-on-surface transition-colors hover:bg-surface-container-low dark:border-white/10 dark:text-content-dark dark:hover:bg-white/5 md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="public-mobile-menu"
            aria-label={isMobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div id="public-mobile-menu" className="mt-4 rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/[0.03] md:hidden">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {links.map((link) => renderLink(link, () => setIsMobileMenuOpen(false)))}
              </div>
              <div className="border-t border-outline-variant pt-4 dark:border-white/10">
                {cta}
              </div>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
