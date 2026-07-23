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
    { label: 'Simulador', href: '/simulador' },
  ],
  '/how-it-works': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona', active: true },
    { label: 'Simulador', href: '/simulador' },
  ],
  '/como-funciona': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona', active: true },
    { label: 'Simulador', href: '/simulador' },
  ],
  '/simulador': [
    { label: 'Inicio', href: '/' },
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Simulador', href: '/simulador', active: true },
  ],
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Cómo funciona', href: '/como-funciona' },
  { label: 'Simulador', href: '/simulador' },
]

interface NavActionsProps {
  isDark: boolean
  isMobile: boolean
  onNavigate?: () => void
  onToggle: () => void
}

function NavActions({ isDark, isMobile, onNavigate, onToggle }: NavActionsProps) {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken) ?? localStorage.getItem('renewsim-token')
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const displayName = user?.username ?? readDisplayName(accessToken)

  function handleLogout() {
    useAuthStore.getState().clearAuth()
    localStorage.removeItem('renewsim-token')
    navigate('/iniciar-sesion')
  }

  return (
    <div className={`flex gap-2 ${isMobile ? 'flex-col items-stretch' : 'items-center'}`}>
      <LocaleSwitcher />
      <DarkModeToggle isDark={isDark} onToggle={onToggle} />
      {isAuthenticated ? (
        <>
          <Link
            to="/simulador/configuracion"
            onClick={onNavigate}
            className={`rounded-sm border border-[#c8d2c7] bg-[#f7faf6] px-4 py-2 text-sm font-semibold text-[#304439] transition-colors hover:border-[#b8c6b8] hover:bg-[#f1f5ef] dark:border-white/10 dark:bg-white/5 dark:text-content-dark dark:hover:bg-white/8 ${isMobile ? 'justify-center text-center' : ''}`}
          >
            {displayName ? `Hola, ${displayName}` : 'Perfil'}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className={`rounded-sm bg-[#0d5a37] px-4 py-2 text-sm font-bold text-white shadow-[0_12px_24px_-18px_rgba(13,90,55,0.34)] transition-all hover:brightness-95 dark:bg-emerald-400 dark:text-slate-950 ${isMobile ? 'text-center' : ''}`}
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <Link
            to="/iniciar-sesion"
            onClick={onNavigate}
            className={`rounded-sm border border-[#c8d2c7] bg-[#f7faf6] px-4 py-2 text-sm font-semibold text-[#304439] transition-colors hover:border-[#b8c6b8] hover:bg-[#f1f5ef] dark:border-white/10 dark:bg-white/5 dark:text-content-dark dark:hover:bg-white/8 ${isMobile ? 'text-center' : ''}`}
          >
            Iniciar sesión
          </Link>
          <Link
            to="/registro"
            onClick={onNavigate}
            className={`rounded-sm bg-[#0d5a37] px-4 py-2 text-sm font-bold text-white shadow-[0_12px_24px_-18px_rgba(13,90,55,0.34)] transition-all hover:brightness-95 dark:bg-emerald-400 dark:text-slate-950 ${isMobile ? 'text-center' : ''}`}
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
  const isConsolePublicRoute =
    pathname === '/' ||
    pathname === '/como-funciona' ||
    pathname === '/how-it-works' ||
    pathname === '/login' ||
    pathname === '/iniciar-sesion' ||
    pathname === '/register' ||
    pathname === '/registro'

  return (
    <div
      className={
        isConsolePublicRoute
          ? 'flex min-h-screen flex-col bg-[linear-gradient(180deg,#f5f8f3_0%,#eef3ec_44%,#f4f7f2_100%)] font-display text-on-surface dark:bg-[linear-gradient(180deg,#0c1511_0%,#0a120f_100%)] dark:text-content-dark'
          : 'flex flex-col min-h-screen bg-surface font-display text-on-surface dark:bg-background-dark dark:text-content-dark'
      }
    >
      <Navbar
        links={links}
        variant={isConsolePublicRoute ? 'home-console' : 'default'}
        renderActions={(isMobile, onNavigate) => <NavActions isDark={isDark} isMobile={isMobile} onNavigate={onNavigate} onToggle={toggle} />}
      />
      <main className={isConsolePublicRoute ? 'flex-grow overflow-hidden' : 'flex-grow'}>
        <Outlet />
      </main>
      <Footer variant={isConsolePublicRoute ? 'home-console' : 'default'} />
      <ChatWidget />
    </div>
  )
}
