import { useState } from 'react'
import { HomePage } from './features/home/HomePage'
import { HowItWorksPage } from './features/how-it-works/HowItWorksPage'
import { AboutPage } from './features/about/AboutPage'
import { Navbar, Footer } from './shared/components'

type Page = 'home' | 'how-it-works' | 'about'

const PAGES: { id: Page; label: string }[] = [
  { id: 'home', label: 'HomePage' },
  { id: 'how-it-works', label: 'HowItWorksPage' },
  { id: 'about', label: 'AboutPage' },
]

// TODO: replace with React Router when routing is added
function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <>
      {/* Temporary dev page switcher — will be replaced by React Router */}
      <div className="flex gap-4 justify-center py-2 bg-yellow-50 border-b border-yellow-200 text-xs text-yellow-800">
        <span className="font-bold">DEV:</span>
        {PAGES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPage(id)}
            className={`underline cursor-pointer ${page === id ? 'font-bold' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {page === 'home' && (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
          <Navbar />
          <HomePage />
          <Footer />
        </div>
      )}

      {page === 'how-it-works' && <HowItWorksPage />}
      {page === 'about' && <AboutPage />}
    </>
  )
}

export default App
