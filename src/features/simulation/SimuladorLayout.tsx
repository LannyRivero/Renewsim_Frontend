import { Outlet } from 'react-router-dom'
import { SimuladorSidebar } from './SimuladorSidebar'

export function SimuladorLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface dark:bg-[#0f1a16]">
      <SimuladorSidebar />
      <main className="scrollbar-hidden flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 dark:bg-[#122019]">
        <Outlet />
      </main>
    </div>
  )
}
