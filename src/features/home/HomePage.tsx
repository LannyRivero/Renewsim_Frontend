import { HeroSection } from './components/HeroSection'
import { FeaturesSection } from './components/FeaturesSection'

export function HomePage() {
  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(50,102,77,0.12),transparent_34%),linear-gradient(180deg,#f6f8f4_0%,#eef3ec_42%,#f7f9f6_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(34,84,59,0.38),rgba(8,16,13,0)_30%),linear-gradient(180deg,#0d1612_0%,#0b130f_100%)]">
      <HeroSection />
      <FeaturesSection />
    </div>
  )
}
