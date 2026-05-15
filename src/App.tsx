import { Navbar, Footer } from './shared/components'
import { HomePage } from './features/home/HomePage'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  )
}

export default App
