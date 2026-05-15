import { Outlet, useLocation, Link } from 'react-router-dom'
import { Navbar, Footer, DarkModeToggle, type NavLink } from './index'
import { useDarkMode } from '../hooks'

const NAV_LINKS_BY_ROUTE: Record<string, NavLink[]> = {
  '/': [
    { label: 'Inicio', href: '/', active: true },
    { label: 'Cómo Funciona', href: '/como-funciona' },
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Simulador', href: '#' },
  ],
  '/como-funciona': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo Funciona', href: '/como-funciona', active: true },
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Simulador', href: '#' },
  ],
  '/acerca-de': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo Funciona', href: '/como-funciona' },
    { label: 'Acerca de', href: '/acerca-de', active: true },
    { label: 'Simulador', href: '#' },
  ],
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Cómo Funciona', href: '/como-funciona' },
  { label: 'Acerca de', href: '/acerca-de' },
  { label: 'Simulador', href: '#' },
]

interface NavActionsProps {
  isDark: boolean
  onToggle: () => void
}

function NavActions({ isDark, onToggle }: NavActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <DarkModeToggle isDark={isDark} onToggle={onToggle} />
      <Link
        to="/iniciar-sesion"
        className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface dark:text-content-dark border border-outline-variant dark:border-white/10 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors"
      >
        Iniciar Sesión
      </Link>
      <Link
        to="/registro"
        className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container text-on-primary hover:brightness-95 transition-all"
      >
        Registrarse
      </Link>
    </div>
  )
}

export function RootLayout() {
  const { pathname } = useLocation()
  const { isDark, toggle } = useDarkMode()
  const links = NAV_LINKS_BY_ROUTE[pathname] ?? DEFAULT_LINKS

  return (
    <div className="flex flex-col min-h-screen bg-surface dark:bg-background-dark font-display text-on-surface dark:text-content-dark">
      <Navbar links={links} cta={<NavActions isDark={isDark} onToggle={toggle} />} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
