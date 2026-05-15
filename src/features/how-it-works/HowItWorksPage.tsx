import { StepsSection } from './components/StepsSection'
import { CtaSection } from './components/CtaSection'

export function HowItWorksPage() {
  return (
    <div className="flex flex-1 justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-content-light dark:text-content-dark">
            Cómo Funciona RenewSim
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-subtle-light dark:text-subtle-dark">
            Nuestro proceso de simulación está diseñado para ser simple,
            transparente y poderoso, guiándote en cada paso para tomar
            decisiones energéticas informadas.
          </p>
        </div>

        <StepsSection />
        <CtaSection />
      </div>
    </div>
  )
}
