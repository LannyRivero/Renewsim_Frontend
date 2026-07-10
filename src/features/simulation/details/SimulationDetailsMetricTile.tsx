import type { DetailMetric } from './simulationDetailsViewModel'

export function MetricTile({ metric, variant }: { metric: DetailMetric; variant?: 'default' | 'compact' | 'hero-subtle' | 'financial-primary' | 'financial-secondary' }) {
  const isCompact = variant === 'compact'
  const isHeroSubtle = variant === 'hero-subtle'
  const isFinancialPrimary = variant === 'financial-primary'
  const isFinancialSecondary = variant === 'financial-secondary'
  const isDecisionMetric = metric.label === 'Recomendación'
  const decisionValue = metric.value.trim().toLowerCase()
  const decisionAccent = !isDecisionMetric
    ? null
    : decisionValue === 'no recomendado'
      ? {
          shell: 'border-rose-200 bg-rose-50/90 shadow-[0_18px_40px_-32px_rgba(225,29,72,0.45)] hover:border-rose-300 hover:shadow-[0_20px_46px_-30px_rgba(225,29,72,0.55)] dark:border-rose-400/20 dark:bg-rose-500/10 dark:hover:border-rose-300/35',
          value: 'text-rose-700 dark:text-rose-300',
          helper: 'text-rose-700/80 dark:text-rose-200/80',
        }
      : decisionValue === 'recomendado'
        ? {
            shell: 'border-emerald-200 bg-emerald-50/90 shadow-[0_18px_40px_-32px_rgba(16,185,129,0.35)] hover:border-emerald-300 hover:shadow-[0_20px_46px_-30px_rgba(16,185,129,0.45)] dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:hover:border-emerald-300/35',
            value: 'text-emerald-700 dark:text-emerald-300',
            helper: 'text-emerald-700/80 dark:text-emerald-200/80',
          }
        : {
            shell: 'border-amber-200 bg-amber-50/90 shadow-[0_18px_40px_-32px_rgba(217,119,6,0.35)] hover:border-amber-300 hover:shadow-[0_20px_46px_-30px_rgba(217,119,6,0.45)] dark:border-amber-300/20 dark:bg-amber-500/10 dark:hover:border-amber-300/35',
            value: 'text-amber-700 dark:text-amber-300',
            helper: 'text-amber-700/80 dark:text-amber-200/80',
          }

  return (
    <div
      className={[
        'rounded-md border text-[#1c2a22] transition-[border-color,box-shadow,transform,background-color] duration-200 dark:text-content-dark',
        decisionAccent?.shell,
        isHeroSubtle
          ? 'border-[#e6ece8] bg-white/58 px-4 py-3 shadow-none backdrop-blur-sm dark:border-white/8 dark:bg-white/[0.02]'
          : isFinancialPrimary
            ? 'border-[#dbe4df] bg-white px-4 py-3 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 hover:border-[#c9d7cf] hover:shadow-[0_22px_44px_-30px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-[#18211e] dark:hover:border-white/16'
            : isFinancialSecondary
              ? 'border-[#dde4dc] bg-[#fbfcfb] px-3 py-2 hover:border-[#d2ddd5] hover:bg-white dark:border-white/10 dark:bg-white/[0.025] dark:hover:border-white/14 dark:hover:bg-white/[0.035]'
              : isCompact
                ? 'border-[#dde4dc] bg-[#fbfcfb] px-3 py-2 dark:border-white/10 dark:bg-white/[0.025]'
                : 'border-[#dbe4df] bg-white px-4 py-3 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[#18211e]',
      ].join(' ')}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">{metric.label}</p>
      <p className={[
        isCompact
          ? 'mt-0.5 text-sm font-bold tracking-[-0.01em] text-[#1c2a22] dark:text-content-dark'
          : isHeroSubtle
            ? 'mt-1.5 text-[1.05rem] font-semibold tracking-[-0.02em] text-[#1c2a22] dark:text-content-dark'
            : 'mt-1 text-[1.35rem] font-bold tracking-[-0.03em] text-[#1c2a22] dark:text-content-dark',
        decisionAccent?.value,
      ].filter(Boolean).join(' ')}>{metric.value}</p>
      {metric.helper ? <p className={[
        isCompact
          ? 'mt-0.5 text-[11px] leading-4 text-slate-500 dark:text-content-dark/55'
          : isHeroSubtle
            ? 'mt-2 text-[11px] leading-5 text-slate-500 dark:text-content-dark/55'
            : 'mt-2 text-[12px] leading-5 text-slate-600 dark:text-content-dark/60',
        decisionAccent?.helper,
      ].filter(Boolean).join(' ')}>{metric.helper}</p> : null}
    </div>
  )
}
