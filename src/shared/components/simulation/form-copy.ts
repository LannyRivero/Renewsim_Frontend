export const SIMULATION_FORM_LABELS = {
  location: 'Ubicación',
  projectName: 'Nombre del proyecto',
  technology: 'Tecnología',
  installedCapacityKw: 'Potencia instalada (kW)',
  annualConsumptionKwh: 'Consumo anual (kWh)',
  electricityPurchasePricePerKwh: 'Precio de electricidad',
  capexTotal: 'Inversión estimada',
  advancedSettings: 'Ajustes avanzados',
  performanceRatio: 'Factor de rendimiento',
  degradationRateAnnualPct: 'Degradación anual (%)',
  availabilityPct: 'Disponibilidad (%)',
  lossesPct: 'Pérdidas (%)',
  monthlyConsumptionKwh: 'Consumo mensual (kWh)',
  advancedEconomics: 'Economía avanzada',
  currency: 'Moneda',
  opexAnnual: 'OPEX anual',
  exportPricePerKwh: 'Precio de exportación',
  discountRatePct: 'Tasa de descuento (%)',
  projectLifetimeYears: 'Vida útil (años)',
} as const

export const SIMULATION_FORM_DESCRIPTIONS = {
  advancedSettings:
    'Ajustes para técnicos, pérdidas, consumo mensual y economía avanzada solo si necesitás más control.',
} as const

export const SIMULATION_FORM_PLACEHOLDERS = {
  location: 'Ingresá ciudad o región',
  projectName: 'Ej: Planta solar nave Sevilla',
  installedCapacityKw: '300',
  annualConsumptionKwh: '120000',
  electricityPurchasePricePerKwh: '0.18',
  capexTotal: '315000',
  performanceRatio: '0.81',
  degradationRateAnnualPct: '0.5',
  availabilityPct: '99',
  lossesPct: '0',
  opexAnnual: '7200',
  exportPricePerKwh: '0.07',
  discountRatePct: '8',
  projectLifetimeYears: '20',
} as const
