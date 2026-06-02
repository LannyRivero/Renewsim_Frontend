import { cn } from '@/lib/utils'

type RouteSkeletonType = 'dashboard' | 'admin' | 'history' | 'new-simulation' | 'generic'

interface RouteSkeletonProps {
  type?: RouteSkeletonType
}

export function RouteSkeleton({ type = 'generic' }: RouteSkeletonProps) {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="animate-pulse space-y-4 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#0f1a16]">
        <div className="h-4 w-40 rounded bg-slate-200/80 dark:bg-white/15" />
        <div className="h-8 w-72 rounded bg-slate-200/80 dark:bg-white/15" />

        {type === 'admin' ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
            </div>
            <div className="h-14 rounded-md bg-slate-200/70 dark:bg-white/10" />
            <div className="h-64 rounded-md bg-slate-200/70 dark:bg-white/10" />
          </>
        ) : type === 'history' ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="h-8 w-48 rounded bg-slate-200/70 dark:bg-white/10" />
              <div className="h-10 w-36 rounded bg-slate-200/70 dark:bg-white/10" />
            </div>
            <div className="h-72 rounded-md bg-slate-200/70 dark:bg-white/10" />
          </>
        ) : type === 'new-simulation' ? (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="h-12 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-12 rounded-md bg-slate-200/70 dark:bg-white/10" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="h-12 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-12 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-12 rounded-md bg-slate-200/70 dark:bg-white/10" />
            </div>
            <div className="h-44 rounded-md bg-slate-200/70 dark:bg-white/10" />
          </>
        ) : type === 'dashboard' ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
              <div className="h-20 rounded-md bg-slate-200/70 dark:bg-white/10" />
            </div>
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="h-44 rounded-md bg-slate-200/70 dark:bg-white/10 lg:col-span-2" />
              <div className="h-44 rounded-md bg-slate-200/70 dark:bg-white/10" />
            </div>
          </>
        ) : (
          <div className={cn('h-40 rounded-md bg-slate-200/70 dark:bg-white/10')} />
        )}
      </div>
    </div>
  )
}
