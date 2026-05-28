import { Check, Loader2, Trash2 } from 'lucide-react'
import type { AdminUser } from '@/shared/types'

interface AdminUsersTableProps {
  users: AdminUser[]
  allRoles: string[]
  getDraftRoles: (userId: string, currentRoles: string[]) => string[]
  onToggleRole: (userId: string, currentRoles: string[], role: string, checked: boolean) => void
  onSaveRoles: (userId: string, roles: string[]) => void
  onRequestDelete: (userId: string, username: string) => void
  savingUserId: string | null
  deletingUserId: string | null
}

export function AdminUsersTable({
  users,
  allRoles,
  getDraftRoles,
  onToggleRole,
  onSaveRoles,
  onRequestDelete,
  savingUserId,
  deletingUserId,
}: AdminUsersTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white dark:border-white/10 dark:bg-[#111d18]">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/10">
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Username</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Current Roles</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Edit Roles</th>
            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-content-dark/75">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const editableRoles = Array.from(new Set(['USER', 'ADMIN', ...allRoles, ...user.roles]))
            const draftRoles = getDraftRoles(user.id, user.roles)

            return (
              <tr key={user.id} className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/10">
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-content-dark">{user.username}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {(user.roles.length ? user.roles : ['NONE']).map((role) => (
                      <span
                        key={`${user.id}-current-${role}`}
                        className="rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-white/15 dark:bg-white/15 dark:text-content-dark"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    {editableRoles.map((role) => {
                      const checkboxId = `user-${user.id}-role-${role}`
                      const isChecked = draftRoles.includes(role)

                      return (
                        <label key={role} htmlFor={checkboxId} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-content-dark">
                          <input
                            id={checkboxId}
                            type="checkbox"
                            checked={isChecked}
                            onChange={(event) => onToggleRole(user.id, user.roles, role, event.target.checked)}
                            className="h-4 w-4 rounded border-outline-variant"
                          />
                          <span>{role}</span>
                        </label>
                      )
                    })}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1 divide-x divide-slate-200 dark:divide-white/10">
                    <button
                      type="button"
                      onClick={() => onSaveRoles(user.id, draftRoles)}
                      disabled={savingUserId === user.id}
                      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
                    >
                      {savingUserId === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      {savingUserId === user.id ? 'Saving...' : 'Save Roles'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestDelete(user.id, user.username)}
                      disabled={deletingUserId === user.id}
                      className="ml-1 inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-500/10"
                    >
                      {deletingUserId === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      {deletingUserId === user.id ? 'Deleting...' : 'Delete User'}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
