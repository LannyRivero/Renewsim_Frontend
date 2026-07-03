import { ChevronDown, Sliders } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormField, SimulationReadonlyFormInput, SimulationTextInput, SubSectionHeader } from '@/shared/components'
import type { SimulationCreateFormInput, SimulationCreateFormValues } from '../../schemas/simulationSchema'

interface AdvancedSettingsSectionProps {
  form: UseFormReturn<SimulationCreateFormInput, undefined, SimulationCreateFormValues>
  isAdvancedOpen: boolean
  onToggle: () => void
}

export function AdvancedSettingsSection({ form, isAdvancedOpen, onToggle }: AdvancedSettingsSectionProps) {
  return (
    <div className="rounded-sm border border-[#d8dee8] bg-[#f6f8fb] p-4 dark:border-white/10 dark:bg-[#15191d]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isAdvancedOpen}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-content-dark">Ajustes avanzados</h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-content-dark/65">
            Ajustá supuestos técnicos, pérdidas, consumo mensual y economía avanzada solo si necesitás más control.
          </p>
        </div>
        <span className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#d2d8e2] bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-[0_10px_20px_-18px_rgba(15,23,42,0.18)] transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark">
          <Sliders className="h-4 w-4" />
          {isAdvancedOpen ? 'Ocultar ajustes' : 'Mostrar ajustes'}
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>

      {isAdvancedOpen ? (
        <div className="mt-4 space-y-5 border-t border-[#e1e6ee] pt-4 dark:border-white/8">
          <div>
            <SubSectionHeader>Rendimiento técnico</SubSectionHeader>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField label="Performance ratio" htmlFor="performanceRatio">
                <SimulationTextInput id="performanceRatio" type="number" min={0} max={1} step="0.01" placeholder="0.81" {...form.register('system.performanceRatio')} />
              </FormField>
              <FormField label="Degradación anual (%)" htmlFor="degradationRateAnnualPct">
                <SimulationTextInput id="degradationRateAnnualPct" type="number" min={0} max={5} step="0.1" placeholder="0.5" {...form.register('system.degradationRateAnnualPct')} />
              </FormField>
              <FormField label="Disponibilidad (%)" htmlFor="availabilityPct">
                <SimulationTextInput id="availabilityPct" type="number" min={0} max={100} step="0.1" placeholder="99" {...form.register('system.availabilityPct')} />
              </FormField>
            </div>
          </div>

          <div>
            <SubSectionHeader>Pérdidas (%)</SubSectionHeader>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-5">
              {([
                ['inverter', 'Inversor'],
                ['temperature', 'Temperatura'],
                ['wiring', 'Cableado'],
                ['soiling', 'Suciedad'],
                ['other', 'Otras'],
              ] as const).map(([field, label]) => (
                <FormField key={field} label={label} htmlFor={`loss-${field}`}>
                  <SimulationTextInput id={`loss-${field}`} type="number" min={0} step="0.1" placeholder="0" {...form.register(`system.lossesPct.${field}` as const)} />
                </FormField>
              ))}
            </div>
          </div>

          <div>
            <SubSectionHeader>Consumo mensual (kWh)</SubSectionHeader>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
              {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, index) => (
                <FormField key={month} label={month} htmlFor={`monthly-${index}`}>
                  <SimulationTextInput id={`monthly-${index}`} type="number" min={0} placeholder="0" {...form.register(`demand.monthlyConsumptionKwh.${index}` as const)} />
                </FormField>
              ))}
            </div>
          </div>

          <div>
            <SubSectionHeader>Economía avanzada</SubSectionHeader>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <FormField label="Moneda" htmlFor="currency">
                <SimulationReadonlyFormInput id="currency" value="EUR" />
                <input type="hidden" {...form.register('economics.currency')} />
              </FormField>
              <FormField label="OPEX anual" htmlFor="opexAnnual">
                <SimulationTextInput id="opexAnnual" type="number" min={0} placeholder="7200" {...form.register('economics.opexAnnual')} />
              </FormField>
              <FormField label="Export price" htmlFor="exportPricePerKwh">
                <SimulationTextInput id="exportPricePerKwh" type="number" min={0} step="0.01" placeholder="0.07" {...form.register('economics.exportPricePerKwh')} />
              </FormField>
              <FormField label="Discount rate (%)" htmlFor="discountRatePct">
                <SimulationTextInput id="discountRatePct" type="number" min={0} step="0.1" placeholder="8" {...form.register('economics.discountRatePct')} />
              </FormField>
              <FormField label="Vida útil (años)" htmlFor="projectLifetimeYears">
                <SimulationTextInput id="projectLifetimeYears" type="number" min={5} placeholder="20" {...form.register('economics.projectLifetimeYears')} />
              </FormField>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
