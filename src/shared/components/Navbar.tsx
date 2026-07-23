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
  renderActions?: (isMobile: boolean, onNavigate?: () => void) => ReactNode
  variant?: 'default' | 'home-console'
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Cómo funciona', href: '/como-funciona' },
  { label: 'Simulador', href: '#' },
]

function DefaultActions(isMobile: boolean, onNavigate?: () => void) {
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
      <Link
        to="/iniciar-sesion"
        onClick={onNavigate}
        className={`rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low dark:border-white/10 dark:text-content-dark dark:hover:bg-white/5 ${isMobile ? 'text-center' : ''}`}
      >
        Iniciar sesión
      </Link>
      <Link
        to="/registro"
        onClick={onNavigate}
        className={`rounded-lg bg-primary-container px-4 py-2 text-sm font-bold text-on-primary transition-all hover:brightness-95 ${isMobile ? 'text-center' : ''}`}
      >
        Crear cuenta
      </Link>
    </div>
  )
}

export function Navbar({ links = DEFAULT_LINKS, renderActions = DefaultActions, variant = 'default' }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function renderLink(link: NavLink, onNavigate?: () => void) {
    const className = link.active
      ? variant === 'home-console'
        ? 'text-sm font-semibold text-[#183626] dark:text-emerald-300'
        : 'text-sm font-semibold text-primary dark:text-primary-inverse'
      : variant === 'home-console'
        ? 'text-sm font-medium text-[#5f6f64] transition-colors hover:text-[#18261f] dark:text-content-dark/60 dark:hover:text-content-dark'
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
    <header
      className={
        variant === 'home-console'
          ? 'sticky top-0 z-50 border-b border-[#d7dfd6] bg-[#f4f7f2]/88 backdrop-blur-md dark:border-white/8 dark:bg-[#0c1511]/88'
          : 'sticky top-0 z-50 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant dark:border-white/8 dark:bg-background-dark/95'
      }
    >
      <nav className={variant === 'home-console' ? 'mx-auto max-w-[1600px] px-3 py-3 sm:px-4 lg:px-5' : 'container mx-auto px-4 py-4 sm:px-6'}>
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <Logo />
            <span
              className={
                variant === 'home-console'
                  ? 'truncate text-lg font-bold font-display text-[#17251e] dark:text-content-dark sm:text-xl'
                  : 'truncate text-lg font-bold font-display text-on-surface dark:text-content-dark sm:text-xl'
              }
            >
              RenewSim
            </span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((link) => renderLink(link))}
          </div>

          <div className="hidden md:block">
            {renderActions(false)}
          </div>

          <button
            type="button"
            className={
              variant === 'home-console'
                ? 'inline-flex items-center justify-center rounded-sm border border-[#cfd8ce] px-3 py-2 text-[#1d2d24] transition-colors hover:bg-[#edf2eb] dark:border-white/10 dark:text-content-dark dark:hover:bg-white/5 md:hidden'
                : 'inline-flex items-center justify-center rounded-xl border border-outline-variant px-3 py-2 text-on-surface transition-colors hover:bg-surface-container-low dark:border-white/10 dark:text-content-dark dark:hover:bg-white/5 md:hidden'
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="public-mobile-menu"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div
            id="public-mobile-menu"
            className={
              variant === 'home-console'
                ? 'mt-4 rounded-sm border border-[#cfd8ce] bg-[#f8faf7] p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.25)] dark:border-white/10 dark:bg-white/[0.03] md:hidden'
                : 'mt-4 rounded-[1.5rem] border border-outline-variant bg-surface-container-low p-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-white/[0.03] md:hidden'
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                {links.map((link) => renderLink(link, () => setIsMobileMenuOpen(false)))}
              </div>
              <div className={variant === 'home-console' ? 'border-t border-[#d7dfd6] pt-4 dark:border-white/10' : 'border-t border-outline-variant pt-4 dark:border-white/10'}>
                {renderActions(true, () => setIsMobileMenuOpen(false))}
              </div>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  )
}
