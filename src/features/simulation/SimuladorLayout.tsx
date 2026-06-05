import { Outlet } from 'react-router-dom'
import { SimuladorSidebar } from './SimuladorSidebar'

export function SimuladorLayout() {
  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#dde6dc_0%,#d8e1d7_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(32,54,43,0.55),rgba(10,18,15,1)_42%)]">
      <SimuladorSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
