import type { ComponentPropsWithoutRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function SimulationTextInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return (
    <Input
      className={cn(
        'h-9 w-full rounded border border-[#cfd8ce] bg-[#fafcf9] px-3.5 py-2.5 text-sm text-[#415447] shadow-[0_8px_20px_-20px_rgba(89,103,92,0.14)] outline-none placeholder:text-[#8c9e92] focus:border-[#9fb49f] focus:ring-4 focus:ring-[#dfe8de] dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:placeholder:text-content-dark/45 dark:focus:border-white/20 dark:focus:ring-white/10',
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
        'h-9 w-full rounded border border-[#cfd8ce] bg-[#fafcf9] px-3.5 py-2.5 text-sm text-[#415447] shadow-[0_8px_20px_-20px_rgba(89,103,92,0.14)] outline-none focus:border-[#9fb49f] focus:ring-4 focus:ring-[#dfe8de] dark:border-white/10 dark:bg-[#111d18] dark:text-content-dark dark:focus:border-white/20 dark:focus:ring-white/10',
        className,
      )}
      {...props}
    />
  )
}

export function SimulationReadonlyInput({ className, ...props }: ComponentPropsWithoutRef<'input'>) {
  return (
    <Input
      readOnly
      className={cn(
        'h-9 w-full rounded border border-[#cfd8ce] bg-[#e7ede7] px-3 text-sm text-[#587063] cursor-not-allowed dark:border-white/10 dark:bg-white/5 dark:text-content-dark/70',
        className,
      )}
      {...props}
    />
  )
}
