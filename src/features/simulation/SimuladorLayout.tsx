import { Outlet } from 'react-router-dom'
import { SimuladorSidebar } from './SimuladorSidebar'

export function SimuladorLayout() {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-[#0f1a16]">
      <SimuladorSidebar />
      <main className="flex-1 overflow-y-auto p-8 dark:bg-[#122019]">
        <Outlet />
      </main>
    </div>
  )
}
