import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SimulationPageShellProps {
  children: ReactNode
  className?: string
  contentClassName?: string
}

export function SimulationPageShell({ children, className, contentClassName }: SimulationPageShellProps) {
  return (
    <div className={cn('w-full py-2 sm:py-3 lg:h-[calc(100vh-4.5rem)] lg:py-0', className)}>
      <section
        className={cn(
          'relative overflow-hidden rounded-xl border border-black/10 bg-white p-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[#0f1a16] lg:h-full',
          contentClassName,
        )}
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-slate-200/45 blur-3xl dark:bg-white/5" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-500/10" />
        <div className="relative h-full">{children}</div>
      </section>
    </div>
  )
}

interface SimulationCardProps extends ComponentPropsWithoutRef<'div'> {
  tone?: 'base' | 'soft'
  density?: 'comfortable' | 'compact'
}

export function SimulationCard({
  className,
  tone = 'base',
  density = 'comfortable',
  ...props
}: SimulationCardProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-black/10 dark:border-white/10',
        tone === 'base' ? 'bg-white dark:bg-[#15241e]' : 'bg-slate-50/70 dark:bg-white/5',
        density === 'comfortable' ? 'p-4' : 'p-3',
        className,
      )}
      {...props}
    />
  )
}

interface SimulationSectionHeaderProps {
  eyebrow?: string
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
  eyebrowIcon?: ReactNode
}

export function SimulationSectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
  eyebrowIcon,
}: SimulationSectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow ? (
          <p className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 dark:border-white/15 dark:bg-white/10 dark:text-content-dark/75">
            {eyebrowIcon}
            {eyebrow}
          </p>
        ) : null}
        {title ? <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-content-dark lg:text-3xl">{title}</h1> : null}
        {description ? <p className="mt-1 text-sm text-slate-600 dark:text-content-dark/65">{description}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  )
}

interface SimulationToolbarProps extends ComponentPropsWithoutRef<'div'> {
  columns?: 1 | 2
}

export function SimulationToolbar({ className, columns = 2, ...props }: SimulationToolbarProps) {
  return (
    <div
      className={cn(
        'grid gap-3',
        columns === 2 ? 'lg:grid-cols-[minmax(0,1fr)_260px]' : 'grid-cols-1',
        className,
      )}
      {...props}
    />
  )
}
