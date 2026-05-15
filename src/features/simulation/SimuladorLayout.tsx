import { Outlet } from 'react-router-dom'
import { SimuladorSidebar } from './SimuladorSidebar'

export function SimuladorLayout() {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-background-dark">
      <SimuladorSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
