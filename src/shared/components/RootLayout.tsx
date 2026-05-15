import { Outlet, useLocation } from 'react-router-dom'
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

export function RootLayout() {
  const { pathname } = useLocation()
  const { isDark, toggle } = useDarkMode()
  const links = NAV_LINKS_BY_ROUTE[pathname] ?? DEFAULT_LINKS

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar links={links} cta={<NavActions isDark={isDark} onToggle={toggle} />} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
