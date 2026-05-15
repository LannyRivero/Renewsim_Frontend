import { MissionSection } from './components/MissionSection'
import { ImpactSection } from './components/ImpactSection'
import { ValuesSection } from './components/ValuesSection'
import { TeamSection } from './components/TeamSection'

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-content-light dark:text-content-dark">
            Nuestra Misión y Visión
          </h1>
        </header>

        <div className="space-y-12">
          <MissionSection />
          <ImpactSection />
          <ValuesSection />
          <TeamSection />
        </div>
      </div>
    </div>
  )
}
