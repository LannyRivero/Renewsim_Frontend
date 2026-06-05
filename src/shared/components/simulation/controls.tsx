import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

interface SimulationActionButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'outline' | 'soft'
}

export function SimulationActionButton({ className, variant = 'outline', ...props }: SimulationActionButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:shadow-none',
        variant === 'primary'
          ? 'border border-transparent bg-[#0d5a37] text-white shadow-[0_14px_28px_-18px_rgba(13,90,55,0.38)] hover:-translate-y-px hover:bg-[#0b4d2f] dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300'
          : variant === 'outline'
          ? 'border border-[#c8d2c7] bg-[#f7faf6] text-[#3d5144] shadow-[0_8px_18px_-18px_rgba(89,103,92,0.18)] hover:-translate-y-px hover:border-[#bcc9bb] hover:bg-[#f1f5ef] dark:border-white/15 dark:bg-white/10 dark:text-content-dark dark:hover:bg-white/16'
          : 'border border-[#ced7cd] bg-[#e8eee8] text-[#486053] hover:-translate-y-px hover:bg-[#e1e9e1] dark:border-white/12 dark:bg-white/8 dark:text-content-dark dark:hover:bg-white/14',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationTextInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-[#cfd8ce] bg-[#fafcf9] px-3.5 py-2.5 text-sm text-[#415447] shadow-[0_8px_20px_-20px_rgba(89,103,92,0.14)] outline-none placeholder:text-[#8c9e92] focus:border-[#9fb49f] focus:ring-4 focus:ring-[#dfe8de] dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:placeholder:text-content-dark/45 dark:focus:border-white/20 dark:focus:ring-white/10',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationSelect({ className, ...props }: ComponentPropsWithoutRef<'select'>) {
  return (
    <select
      className={cn(
        'w-full rounded-xl border border-[#cfd8ce] bg-[#fafcf9] px-3.5 py-2.5 text-sm text-[#415447] shadow-[0_8px_20px_-20px_rgba(89,103,92,0.14)] outline-none focus:border-[#9fb49f] focus:ring-4 focus:ring-[#dfe8de] dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationReadonlyInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      readOnly
      className={cn(
        'w-full h-12 rounded-md border border-[#cfd8ce] bg-[#e7ede7] px-3 text-sm text-[#587063] cursor-not-allowed dark:border-white/10 dark:bg-white/5 dark:text-content-dark/70',
        className,
      )}
      {...props}
    />
  )
}
