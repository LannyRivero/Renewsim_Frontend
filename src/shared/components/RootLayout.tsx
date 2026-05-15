import { Outlet, useLocation } from 'react-router-dom'
import { Navbar, Footer, type NavLink } from './index'

const NAV_LINKS_BY_ROUTE: Record<string, NavLink[]> = {
  '/': [
    { label: 'Inicio', href: '/', active: true },
    { label: 'Simulador', href: '#' },
    { label: 'Comunidad', href: '#' },
    { label: 'Recursos', href: '#' },
  ],
  '/como-funciona': [
    { label: 'Inicio', href: '/' },
    { label: 'Simulador', href: '#' },
    { label: 'Fuentes de Energía', href: '#' },
    { label: 'Cómo Funciona', href: '/como-funciona', active: true },
    { label: 'Acerca de', href: '/acerca-de' },
  ],
  '/acerca-de': [
    { label: 'Simulador', href: '#' },
    { label: 'Aprende', href: '#' },
    { label: 'Comunidad', href: '#' },
    { label: 'Acerca de', href: '/acerca-de', active: true },
  ],
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Simulador', href: '#' },
  { label: 'Comunidad', href: '#' },
  { label: 'Recursos', href: '#' },
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
