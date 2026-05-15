import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './shared/components/RootLayout'
import { HomePage } from './features/home/HomePage'
import { HowItWorksPage } from './features/how-it-works/HowItWorksPage'
import { AboutPage } from './features/about/AboutPage'
import { RegisterPage } from './features/auth/RegisterPage'
import { LoginPage } from './features/auth/LoginPage'

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
])
