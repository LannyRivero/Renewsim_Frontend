import { UserCheck, Users } from 'lucide-react'

interface AdminStatsCardsProps {
  usersCount: number
  adminUsersCount: number
  activeRoleCount: number
  filteredUsersCount: number
}

export function AdminStatsCards({
  usersCount,
  adminUsersCount,
  activeRoleCount,
  filteredUsersCount,
}: AdminStatsCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Total users</p>
        <p className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">
          <Users className="h-5 w-5 text-primary" />
          {usersCount}
        </p>
      </article>
      <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Admin users</p>
        <p className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">
          <UserCheck className="h-5 w-5 text-primary" />
          {adminUsersCount}
        </p>
      </article>
      <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Active roles</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">{activeRoleCount}</p>
      </article>
      <article className="rounded-md border border-black/10 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-[#15241e]">
        <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-content-dark/70">Records shown</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-content-dark">{filteredUsersCount}</p>
      </article>
    </div>
  )
}
