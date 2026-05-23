import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/simulador', label: 'Simulations', icon: 'insights', end: true },
  { to: '/simulador/historial', label: 'History', icon: 'history' },
  { to: '/simulador/nueva', label: 'New Simulation', icon: 'add_chart' },
  { to: '/simulador/resultados', label: 'Results', icon: 'monitoring' },
  { to: '/simulador/tecnologias', label: 'Technologies', icon: 'hub' },
  { to: '/simulador/configuracion', label: 'Settings', icon: 'settings' },
  { to: '/simulador/admin', label: 'Admin Panel', icon: 'admin_panel_settings' },
]

export function SimuladorSidebar() {
  return (
    <aside className="w-64 shrink-0 bg-surface-container-lowest dark:bg-[#1A2E22] flex flex-col p-6 border-r border-outline-variant dark:border-white/8 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="size-9 rounded-full bg-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-lg">bolt</span>
        </div>
        <span className="text-lg font-extrabold text-on-surface dark:text-content-dark">
          RenewSim
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-container/15 dark:bg-primary-container/20 text-primary dark:text-primary-inverse font-bold'
                      : 'text-on-surface-variant dark:text-content-dark/60 hover:bg-surface-container dark:hover:bg-white/5'
                  }`
                }
              >
                <span className="material-symbols-outlined text-xl">{icon}</span>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t border-outline-variant dark:border-white/8">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant dark:text-content-dark/60 hover:bg-surface-container dark:hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">help_outline</span>
          Help
        </a>
      </div>
    </aside>
  )
}
