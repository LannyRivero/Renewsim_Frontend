import type { ReactNode } from 'react'
import { SubSectionHeader } from '../section/SubSectionHeader'
import { SIMULATION_LOSS_FIELD_OPTIONS, SIMULATION_MONTH_LABELS } from './form-constants'

export function SimulationTechnicalSettingsFields({
  performanceRatioField,
  degradationField,
  availabilityField,
}: {
  performanceRatioField: ReactNode
  degradationField: ReactNode
  availabilityField: ReactNode
}) {
  return (
    <div>
      <SubSectionHeader>Rendimiento técnico</SubSectionHeader>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
        {performanceRatioField}
        {degradationField}
        {availabilityField}
      </div>
    </div>
  )
}

export function SimulationLossesFields({
  renderField,
}: {
  renderField: (field: (typeof SIMULATION_LOSS_FIELD_OPTIONS)[number][0], label: string) => ReactNode
}) {
  return (
    <div>
      <SubSectionHeader>Pérdidas (%)</SubSectionHeader>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-5">
        {SIMULATION_LOSS_FIELD_OPTIONS.map(([field, label]) => renderField(field, label))}
      </div>
    </div>
  )
}

export function SimulationMonthlyConsumptionFields({
  renderField,
}: {
  renderField: (month: (typeof SIMULATION_MONTH_LABELS)[number], index: number) => ReactNode
}) {
  return (
    <div>
      <SubSectionHeader>Consumo mensual (kWh)</SubSectionHeader>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        {SIMULATION_MONTH_LABELS.map((month, index) => renderField(month, index))}
      </div>
    </div>
  )
}

export function SimulationAdvancedEconomicsFields({
  currencyField,
  opexField,
  exportPriceField,
  discountRateField,
  projectLifetimeField,
}: {
  currencyField: ReactNode
  opexField: ReactNode
  exportPriceField: ReactNode
  discountRateField: ReactNode
  projectLifetimeField: ReactNode
}) {
  return (
    <div>
      <SubSectionHeader>Economía avanzada</SubSectionHeader>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {currencyField}
        {opexField}
        {exportPriceField}
        {discountRateField}
        {projectLifetimeField}
      </div>
    </div>
  )
}
