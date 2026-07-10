import type { TechnologyItem } from '@/shared/types'

export type ComparableTechnology = {
  id: string
  name: string
  score: number
  efficiency: number
  co2Reduction: number
  progressWidth: string
}

export type ComparisonHeight = {
  label: 'Generación' | 'Ahorro' | 'CO2'
  value: number
  displayValue: string
  height: string
}

export function normalizeEnergyType(value: string): 'SOLAR' | 'WIND' | 'HYDRO' {
  const normalized = value.trim().toUpperCase()
  if (normalized === 'WIND') return 'WIND'
  if (normalized === 'HYDRO') return 'HYDRO'
  return 'SOLAR'
}

function barHeight(value: number, max: number, min = 18) {
  if (max <= 0) return `${min}%`
  return `${Math.max(min, Math.round((value / max) * 100))}%`
}

export function buildComparableTechnologies(
  technologies: TechnologyItem[],
  energyType: string,
): ComparableTechnology[] {
  const targetType = normalizeEnergyType(energyType)

  const ranked = technologies
    .filter((item) => normalizeEnergyType(item.energyType) === targetType)
    .map((item) => {
      const score =
        item.efficiency * 0.45 +
        item.capacityFactor * 0.25 +
        item.co2Reduction * 0.2 +
        Math.max(0, 100 - item.environmentalImpact) * 0.1

      return {
        id: item.id,
        name: item.name,
        score: Number(score.toFixed(1)),
        efficiency: item.efficiency,
        co2Reduction: item.co2Reduction,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const bestScore = ranked[0]?.score ?? 0

  return ranked.map((item) => ({
    ...item,
    progressWidth: `${Math.max(8, bestScore > 0 ? (item.score / bestScore) * 100 : 0)}%`,
  }))
}

export function buildComparisonHeights(
  energyGeneratedValue: number,
  estimatedSavingsValue: number,
  co2AvoidedTons: number,
  energyValue: string,
  savingsDisplayValue: string,
  co2Value: string,
): ComparisonHeight[] {
  const rawComparisonHeights = [
    { label: 'Generación' as const, value: energyGeneratedValue, displayValue: energyValue },
    { label: 'Ahorro' as const, value: estimatedSavingsValue, displayValue: savingsDisplayValue },
    { label: 'CO2' as const, value: co2AvoidedTons * 1000, displayValue: co2Value },
  ]
  const comparisonMax = Math.max(...rawComparisonHeights.map((item) => item.value), 1)

  return rawComparisonHeights.map((item) => ({
    ...item,
    height: barHeight(item.value, comparisonMax),
  }))
}
