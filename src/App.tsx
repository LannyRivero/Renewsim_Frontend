import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastViewport } from './shared/components/ToastViewport'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastViewport />
    </>
  )
}
