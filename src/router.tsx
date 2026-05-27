import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './shared/components/RootLayout'
import { RequireAuth } from './shared/components/RequireAuth'
import { RequireRole } from './shared/components/RequireRole'
import { HomePage } from './features/home/HomePage'
import { HowItWorksPage } from './features/how-it-works/HowItWorksPage'
import { AboutPage } from './features/about/AboutPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { LoginPage } from './features/auth/LoginPage'
import { SimuladorLayout } from './features/simulation/SimuladorLayout'
import { DashboardPage } from './features/simulation/dashboard/DashboardPage'
import { NewSimulationPage } from './features/simulation/new-simulation/NewSimulationPage'
import { SimulationResultsPage } from './features/simulation/results/SimulationResultsPage'
import { SimulationHistoryPage } from './features/simulation/history/SimulationHistoryPage'
import { EditSimulationPage } from './features/simulation/edit/EditSimulationPage'
import { SimulationDetailsPage } from './features/simulation/details/SimulationDetailsPage'
import { ProfileSettingsPage } from './features/simulation/settings/ProfileSettingsPage'
import {
  TecnologiasPage,
  AdminPage,
} from './features/simulation/placeholders'

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
      { index: true, element: <DashboardPage /> },
      { path: 'historial', element: <SimulationHistoryPage /> },
      { path: 'detalles', element: <SimulationDetailsPage /> },
      { path: 'editar', element: <EditSimulationPage /> },
      { path: 'nueva', element: <NewSimulationPage /> },
      { path: 'resultados', element: <SimulationResultsPage /> },
      { path: 'tecnologias', element: <TecnologiasPage /> },
      { path: 'configuracion', element: <ProfileSettingsPage /> },
      {
        path: 'admin',
        element: (
          <RequireRole role="ADMIN">
            <AdminPage />
          </RequireRole>
        ),
      },
    ],
  },
])
