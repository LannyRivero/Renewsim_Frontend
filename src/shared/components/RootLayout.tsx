import { Outlet, useLocation, Link } from 'react-router-dom'
import { Navbar, Footer, DarkModeToggle, type NavLink } from './index'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ChatWidget } from './ChatWidget'
import { useDarkMode } from '../hooks'

const NAV_LINKS_BY_ROUTE: Record<string, NavLink[]> = {
  '/': [
    { label: 'Home', href: '/', active: true },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'Simulator', href: '/simulador' },
  ],
  '/how-it-works': [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works', active: true },
    { label: 'About', href: '/about' },
    { label: 'Simulator', href: '/simulador' },
  ],
  '/about': [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about', active: true },
    { label: 'Simulator', href: '/simulador' },
  ],
  '/simulador': [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'Simulator', href: '/simulador', active: true },
  ],
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Simulator', href: '/simulador' },
]

interface NavActionsProps {
  isDark: boolean
  onToggle: () => void
}

function NavActions({ isDark, onToggle }: NavActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <LocaleSwitcher />
      <DarkModeToggle isDark={isDark} onToggle={onToggle} />
      <Link
        to="/login"
        className="px-4 py-2 rounded-lg text-sm font-semibold text-on-surface dark:text-content-dark border border-outline-variant dark:border-white/10 hover:bg-surface-container-low dark:hover:bg-white/5 transition-colors"
      >
        Sign In
      </Link>
      <Link
        to="/register"
        className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-container text-on-primary hover:brightness-95 transition-all"
      >
        Sign Up
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
      <ChatWidget />
    </div>
  )
}
