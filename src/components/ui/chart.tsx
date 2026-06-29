import * as React from "react"
import { Tooltip as RechartsTooltip } from "recharts"

import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    color?: string
  }
>

function ChartContainer({
  config = {},
  className,
  children,
}: React.ComponentProps<"div"> & { config?: ChartConfig }) {
  const chartStyle = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value.color) {
      acc[`--color-${key}`] = value.color
    }

    return acc
  }, {})

  return (
    <div
      data-slot="chart"
      className={cn("h-full w-full [&_.recharts-surface]:outline-none", className)}
      style={chartStyle}
    >
      {children}
    </div>
  )
}

const ChartTooltip = RechartsTooltip

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  labelFormatter,
  formatter,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>
  label?: string | number
  className?: string
  labelFormatter?: (value: string | number | undefined) => React.ReactNode
  formatter?: (value: number | string | undefined, name: string | undefined) => React.ReactNode
}) {
  if (!active || !payload?.length) return null

  return (
    <div className={cn("min-w-[180px] rounded-lg border border-[#d9e1d8] bg-white px-3 py-2 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.22)] dark:border-white/10 dark:bg-[#16201d]", className)}>
      {label !== undefined ? (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-content-dark/60">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      ) : null}
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={`${entry.dataKey}-${entry.name}`} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-content-dark/70">
              <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span>{entry.name}</span>
            </div>
            <span className="font-medium text-[#1c2a22] dark:text-content-dark">
              {formatter ? formatter(entry.value, entry.name) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
