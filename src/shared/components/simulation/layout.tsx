import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SimulationPageShellProps {
  children: ReactNode
  className?: string
  contentClassName?: string
}

interface SimulationPageContentProps extends ComponentPropsWithoutRef<'div'> {
  spacing?: 'compact' | 'comfortable'
}

export function SimulationPageShell({ children, className, contentClassName }: SimulationPageShellProps) {
  return (
    <div className={cn('w-full py-2 sm:py-3 lg:h-[calc(100vh-4.5rem)] lg:py-0', className)}>
      <section
        className={cn(
          'relative overflow-hidden rounded-[1.25rem] border border-[#c2cdc1] bg-[linear-gradient(180deg,rgba(232,237,231,0.98)_0%,rgba(226,232,225,0.98)_100%)] p-5 shadow-[0_20px_46px_-38px_rgba(89,103,92,0.12)] ring-1 ring-white/8 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(15,26,22,0.98)_0%,rgba(12,22,18,0.98)_100%)] dark:ring-white/5 sm:p-6 lg:h-full lg:p-7',
          contentClassName,
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.18)_35%,rgba(255,255,255,0)_100%)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.04)_35%,rgba(255,255,255,0)_100%)]" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-[#d7e0d7]/26 blur-3xl dark:bg-white/5" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#dde8dc]/35 blur-3xl dark:bg-emerald-500/10" />
        <div className="relative h-full">{children}</div>
      </section>
    </div>
  )
}

export function SimulationPageContent({
  className,
  spacing = 'comfortable',
  ...props
}: SimulationPageContentProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-col lg:h-full',
        spacing === 'compact' ? 'gap-4' : 'gap-6',
        className,
      )}
      {...props}
    />
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
        'rounded-[1rem] border shadow-[0_16px_38px_-30px_rgba(15,23,42,0.4)]',
        tone === 'base'
          ? 'border-[#d1dad0] bg-[#fbfdf9]/98 dark:border-white/10 dark:bg-[#15241e]/92'
          : 'border-[#cfd8ce] bg-[#ecf1eb]/92 dark:border-white/10 dark:bg-white/[0.045]',
        density === 'comfortable' ? 'p-5' : 'p-4',
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
          <p className="inline-flex min-h-7 items-center gap-2 rounded-full border border-[#d2dbd1] bg-[#eef3ed] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500 shadow-sm dark:border-white/12 dark:bg-white/8 dark:text-content-dark/72">
            {eyebrowIcon}
            {eyebrow}
          </p>
        ) : null}
        {title ? <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-[#14261c] dark:text-content-dark lg:text-[2rem]">{title}</h1> : null}
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-content-dark/65">{description}</p> : null}
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
        'grid gap-4',
        columns === 2 ? 'lg:grid-cols-[minmax(0,1fr)_260px]' : 'grid-cols-1',
        className,
      )}
      {...props}
    />
  )
}
