import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import { hasRole, readDisplayName, readRoles } from '@/shared/utils/authToken'
import { useDarkMode } from '@/shared/hooks'

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
  const navigate = useNavigate()
  const { mode, setTheme } = useDarkMode()
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken) ?? localStorage.getItem('renewsim-token')
  const user = useAuthStore((state) => state.user)
  const tokenRoles = readRoles(accessToken)
  const displayName = user?.username ?? readDisplayName(accessToken) ?? 'User'
  const isAdmin = hasRole(user?.roles, 'ADMIN') || hasRole(tokenRoles, 'ADMIN')
  const navItems = isAdmin
    ? NAV_ITEMS
    : NAV_ITEMS.filter((item) => item.to !== '/simulador/admin' && item.to !== '/simulador/tecnologias')

  function handleLogout() {
    useAuthStore.getState().clearAuth()
    localStorage.removeItem('renewsim-token')
    navigate('/login')
  }

  return (
    <aside className="hidden w-[276px] shrink-0 border-r border-[#ced7ce] bg-[linear-gradient(180deg,rgba(239,243,238,0.98)_0%,rgba(232,237,231,0.98)_100%)] px-6 py-7 shadow-[10px_0_28px_-30px_rgba(89,103,92,0.14)] dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(20,33,27,0.98)_0%,rgba(14,24,20,0.98)_100%)] lg:flex lg:min-h-screen lg:flex-col">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-[#1a6a45] shadow-[0_12px_20px_-18px_rgba(26,106,69,0.22)] dark:bg-emerald-400">
          <span className="material-symbols-outlined text-on-primary text-lg">bolt</span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-content-dark/45">Control Center</p>
          <span className="text-lg font-extrabold tracking-[-0.03em] text-slate-950 dark:text-content-dark">RenewSim</span>
        </div>
      </div>

      <nav className="flex-1">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-content-dark/45">Workspace</p>
        <ul className="flex flex-col gap-1.5">
          {navItems.map(({ to, label, icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#4a7e63] text-white shadow-[0_12px_22px_-20px_rgba(74,126,99,0.14)] dark:bg-white/12 dark:text-content-dark'
                      : 'text-slate-600 dark:text-content-dark/62 hover:bg-[#f1f5ef] hover:text-slate-900 dark:hover:bg-white/6'
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

      <div className="mt-6 border-t border-[#d1dad0] pt-4 dark:border-white/8">
        <div className="divide-y divide-[#d4ddd3] dark:divide-white/10">
          <p className="px-2 py-2 text-sm font-medium text-slate-600 dark:text-content-dark/70">
            Logged in as: <span className="font-semibold text-slate-900 dark:text-content-dark">{displayName}</span>
          </p>
          <div className="px-1 py-1.5">
          <button
            type="button"
            onClick={() => setIsAppearanceOpen((prev) => !prev)}
          className="group flex w-full items-center justify-between rounded-sm px-2 py-2 text-left transition-colors hover:bg-[#edf2eb] dark:hover:bg-white/5"
          aria-expanded={isAppearanceOpen}
          aria-controls="sidebar-appearance-panel"
        >
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">
              Appearance
            </span>
            <span className="material-symbols-outlined text-[16px] text-slate-500 transition-transform group-hover:translate-y-[1px] dark:text-content-dark/60">
              {isAppearanceOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            </span>
          </button>

          {isAppearanceOpen ? (
            <div id="sidebar-appearance-panel" className="mt-1 grid grid-cols-3 gap-1 rounded-sm bg-[#e9eee8] p-1 dark:bg-black/20">
              {['light', 'dark', 'system'].map((themeMode) => {
                const isActive = mode === themeMode

                return (
                  <button
                    key={themeMode}
                    type="button"
                    onClick={() => setTheme(themeMode as 'light' | 'dark' | 'system')}
                    className={`rounded-sm px-2 py-1.5 text-[11px] font-semibold capitalize transition-all ${
                      isActive
                        ? 'bg-[#f3f7f2] text-slate-800 shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-white/10 dark:text-content-dark'
                        : 'text-slate-500 hover:text-slate-700 dark:text-content-dark/65 dark:hover:bg-white/5'
                    }`}
                  >
                    {themeMode}
                  </button>
                )
              })}
            </div>
          ) : null}
          </div>
          <button
            type="button"
            aria-label="Logout"
            onClick={handleLogout}
            className="group w-full flex items-center justify-between rounded-sm px-2 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-[#edf2eb] hover:text-slate-900 dark:text-content-dark/80 dark:hover:bg-white/5 dark:hover:text-content-dark"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-500 dark:text-content-dark/65">logout</span>
              Logout
            </span>
            <span className="material-symbols-outlined text-[16px] text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-content-dark/45">chevron_right</span>
          </button>
          <a
            href="#"
            className="group w-full flex items-center justify-between rounded-sm px-2 py-2 text-sm font-medium text-slate-700/90 transition-colors hover:bg-[#edf2eb] hover:text-slate-900 dark:text-content-dark/75 dark:hover:bg-white/5 dark:hover:text-content-dark"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-500 dark:text-content-dark/60">help_outline</span>
              Help
            </span>
            <span className="material-symbols-outlined text-[16px] text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-content-dark/45">chevron_right</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
