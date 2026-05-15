import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './shared/components/RootLayout'
import { RequireAuth } from './shared/components/RequireAuth'
import { HomePage } from './features/home/HomePage'
import { HowItWorksPage } from './features/how-it-works/HowItWorksPage'
import { AboutPage } from './features/about/AboutPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { LoginPage } from './features/auth/LoginPage'
import { SimuladorLayout } from './features/simulation/SimuladorLayout'
import { DashboardPage } from './features/simulation/dashboard/DashboardPage'
import { NewSimulationPage } from './features/simulation/new-simulation/NewSimulationPage'
import {
  TecnologiasPage,
  ConfiguracionPage,
  AdminPage,
} from './features/simulation/placeholders'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
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
      { path: 'nueva', element: <NewSimulationPage /> },
      { path: 'tecnologias', element: <TecnologiasPage /> },
      { path: 'configuracion', element: <ConfiguracionPage /> },
      { path: 'admin', element: <AdminPage /> },
    ],
  },
])
