import { HeroSection } from './components/HeroSection'

export function HomePage() {
  return (
    <div className="overflow-hidden bg-[radial-gradient(circle_at_top,rgba(52,88,69,0.08),transparent_30%),linear-gradient(180deg,#f4f7f2_0%,#edf2eb_48%,#f3f7f2_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(34,84,59,0.28),rgba(8,16,13,0)_30%),linear-gradient(180deg,#0c1511_0%,#0a120f_100%)]">
      <HeroSection />
    </div>
  )
}
