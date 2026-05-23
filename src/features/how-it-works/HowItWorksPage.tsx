import { StepsSection } from './components/StepsSection'
import { CtaSection } from './components/CtaSection'

export function HowItWorksPage() {
  return (
    <div className="flex flex-1 justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <div className="mb-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary dark:text-primary-inverse mb-3">
            Process
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface dark:text-content-dark">
            How RenewSim Works
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-on-surface-variant dark:text-content-dark/55">
            Our simulation process is designed to be simple,
            transparent, and powerful, guiding you at every step to make
            informed energy decisions.
          </p>
        </div>

        <StepsSection />
        <CtaSection />
      </div>
    </div>
  )
}
