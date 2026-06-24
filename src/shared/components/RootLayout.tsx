import { Outlet, useLocation, Link } from 'react-router-dom'
import { Navbar, Footer, DarkModeToggle, type NavLink } from './index'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ChatWidget } from './ChatWidget'
import { useDarkMode } from '../hooks'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { readDisplayName } from '@/shared/utils/authToken'

const NAV_LINKS_BY_ROUTE: Record<string, NavLink[]> = {
  '/': [
    { label: 'Inicio', href: '/', active: true },
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Simulador', href: '/simulador' },
  ],
  '/how-it-works': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona', active: true },
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Simulador', href: '/simulador' },
  ],
  '/como-funciona': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona', active: true },
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Simulador', href: '/simulador' },
  ],
  '/about': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Acerca de', href: '/acerca-de', active: true },
    { label: 'Simulador', href: '/simulador' },
  ],
  '/acerca-de': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Acerca de', href: '/acerca-de', active: true },
    { label: 'Simulador', href: '/simulador' },
  ],
  '/simulador': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Simulador', href: '/simulador', active: true },
  ],
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Cómo funciona', href: '/como-funciona' },
  { label: 'Acerca de', href: '/acerca-de' },
  { label: 'Simulador', href: '/simulador' },
]

interface NavActionsProps {
  isDark: boolean
  onToggle: () => void
}

function NavActions({ isDark, onToggle }: NavActionsProps) {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken) ?? localStorage.getItem('renewsim-token')
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const displayName = user?.username ?? readDisplayName(accessToken)

  function handleLogout() {
    useAuthStore.getState().clearAuth()
    localStorage.removeItem('renewsim-token')
    navigate('/login')
  }

  return (
    <div className="flex items-center gap-2">
      <LocaleSwitcher />
      <DarkModeToggle isDark={isDark} onToggle={onToggle} />
      {isAuthenticated ? (
        <>
          <Link
            to="/simulador/configuracion"
            className="hidden rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low dark:border-white/10 dark:text-content-dark dark:hover:bg-white/5 sm:inline-flex"
          >
            {displayName ? `Hola, ${displayName}` : 'Perfil'}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-primary-container px-4 py-2 text-sm font-bold text-on-primary transition-all hover:brightness-95"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="hidden rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container-low dark:border-white/10 dark:text-content-dark dark:hover:bg-white/5 sm:inline-flex"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-primary-container px-4 py-2 text-sm font-bold text-on-primary transition-all hover:brightness-95"
          >
            Crear cuenta
          </Link>
        </>
      )}
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
      <ChatWidget />
    </div>
  )
}
