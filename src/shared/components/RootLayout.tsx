import { Outlet, useLocation } from 'react-router-dom'
import { Navbar, Footer, type NavLink } from './index'

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

export function RootLayout() {
  const { pathname } = useLocation()
  const links = NAV_LINKS_BY_ROUTE[pathname] ?? DEFAULT_LINKS

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar links={links} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
