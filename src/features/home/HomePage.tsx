import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'

export function HomePage() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
