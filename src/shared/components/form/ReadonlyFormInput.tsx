import type { ComponentPropsWithoutRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ReadonlyFormInputProps extends ComponentPropsWithoutRef<'input'> {
  value: string
}

export function ReadonlyFormInput({ className, value, ...props }: ReadonlyFormInputProps) {
  return (
    <Input
      value={value}
      readOnly
      aria-readonly="true"
      className={cn(
        'h-9 w-full rounded border border-[#d5dbe5] bg-[#f3f5f8] px-4 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none dark:border-white/10 dark:bg-white/[0.04] dark:text-content-dark',
        className,
      )}
      {...props}
    />
  )
}
