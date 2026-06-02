/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './shared/components/RootLayout'
import { RequireAuth } from './shared/components/RequireAuth'
import { RequireRole } from './shared/components/RequireRole'
import { RouteSkeleton } from './shared/components'
import { HomePage } from './features/home/HomePage'
import { HowItWorksPage } from './features/how-it-works/HowItWorksPage'
import { AboutPage } from './features/about/AboutPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { LoginPage } from './features/auth/LoginPage'
import { SimuladorLayout } from './features/simulation/SimuladorLayout'

const DashboardPage = lazy(() => import('./features/simulation/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const NewSimulationPage = lazy(() => import('./features/simulation/new-simulation/NewSimulationPage').then((m) => ({ default: m.NewSimulationPage })))
const SimulationResultsPage = lazy(() => import('./features/simulation/results/SimulationResultsPage').then((m) => ({ default: m.SimulationResultsPage })))
const SimulationHistoryPage = lazy(() => import('./features/simulation/history/SimulationHistoryPage').then((m) => ({ default: m.SimulationHistoryPage })))
const EditSimulationPage = lazy(() => import('./features/simulation/edit/EditSimulationPage').then((m) => ({ default: m.EditSimulationPage })))
const SimulationDetailsPage = lazy(() => import('./features/simulation/details/SimulationDetailsPage').then((m) => ({ default: m.SimulationDetailsPage })))
const ProfileSettingsPage = lazy(() => import('./features/simulation/settings/ProfileSettingsPage').then((m) => ({ default: m.ProfileSettingsPage })))
const TecnologiasPage = lazy(() => import('./features/simulation/placeholders').then((m) => ({ default: m.TecnologiasPage })))
const AdminPage = lazy(() => import('./features/simulation/placeholders').then((m) => ({ default: m.AdminPage })))

function lazyElement(
  element: ReactNode,
  type: 'dashboard' | 'admin' | 'history' | 'new-simulation' | 'generic' = 'generic',
) {
  return <Suspense fallback={<RouteSkeleton type={type} />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'como-funciona', element: <HowItWorksPage /> },
      { path: 'acerca-de', element: <AboutPage /> },
      { path: 'registro', element: <RegisterPage /> },
      { path: 'iniciar-sesion', element: <LoginPage /> },
    ],
  },
  {
    path: '/simulador',
    element: (
      <RequireAuth>
        <SimuladorLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: lazyElement(<DashboardPage />, 'dashboard') },
      { path: 'historial', element: lazyElement(<SimulationHistoryPage />, 'history') },
      { path: 'detalles', element: lazyElement(<SimulationDetailsPage />) },
      { path: 'editar', element: lazyElement(<EditSimulationPage />) },
      { path: 'nueva', element: lazyElement(<NewSimulationPage />, 'new-simulation') },
      { path: 'resultados', element: lazyElement(<SimulationResultsPage />) },
      {
        path: 'tecnologias',
        element: (
          <RequireRole role="ADMIN">
            {lazyElement(<TecnologiasPage />, 'generic')}
          </RequireRole>
        ),
      },
      { path: 'configuracion', element: lazyElement(<ProfileSettingsPage />) },
      {
        path: 'admin',
        element: (
          <RequireRole role="ADMIN">
            {lazyElement(<AdminPage />, 'admin')}
          </RequireRole>
        ),
      },
    ],
  },
])
