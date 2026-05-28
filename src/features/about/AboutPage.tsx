import { MissionSection } from './components/MissionSection'
import { ImpactSection } from './components/ImpactSection'
import { ValuesSection } from './components/ValuesSection'
import { TeamSection } from './components/TeamSection'

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-semibold tracking-widest uppercase text-primary dark:text-primary-inverse mb-3">
          About Us
        </p>
        <header className="mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface dark:text-content-dark">
            Our Mission and Vision
          </h1>
        </header>

        <div className="space-y-14">
          <MissionSection />
          <ImpactSection />
          <ValuesSection />
          <TeamSection />
        </div>
      </div>
    </div>
  )
}
