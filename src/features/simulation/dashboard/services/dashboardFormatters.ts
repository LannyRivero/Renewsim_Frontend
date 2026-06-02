const LOCALE = 'en-US'

export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE)
}

export function formatKg(value: number): string {
  return `${value.toLocaleString(LOCALE)} kg`
}

export function formatKwh(value: number): string {
  return `${formatNumber(value)} kWh`
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

export function formatCurrency(value: number, digits = 3): string {
  return `$${value.toFixed(digits)}`
}

export function formatKwhAxisTick(value: number): string {
  return `${value / 1000}k`
}

export function formatTargetPair(actual: number, target: number, unit: string): string {
  return `${formatNumber(actual)} / ${formatNumber(target)} ${unit}`
}
