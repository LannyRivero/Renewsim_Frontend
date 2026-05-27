import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteUser, getAllUsers, updateUserRoles } from './services/userService'
import { useToastStore } from '@/stores/toastStore'

export function AdminPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [roleDrafts, setRoleDrafts] = useState<Record<string, string>>({})
  const usersPerPage = 10

  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  })

  const updateRolesMutation = useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: string[] }) => updateUserRoles(userId, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      useToastStore.getState().pushToast({
        title: 'Roles Updated',
        description: 'User roles were updated successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Update Error',
        description: 'Could not update roles for this user.',
        variant: 'error',
      })
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      useToastStore.getState().pushToast({
        title: 'User Deleted',
        description: 'The user was deleted successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Delete Error',
        description: 'Could not delete user.',
        variant: 'error',
      })
    },
  })

  const filteredUsers = users
    .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
    .filter((user) => roleFilter === 'ALL' || user.roles.includes(roleFilter))

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage))
  const start = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(start, start + usersPerPage)

  const allRoles = Array.from(new Set(users.flatMap((user) => user.roles))).sort()

  function parseRoles(input: string): string[] {
    return input
      .split(',')
      .map((role) => role.trim().toUpperCase())
      .filter(Boolean)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-xl border border-outline-variant bg-surface p-8 dark:border-white/10 dark:bg-surface-dark">
        <h1 className="text-2xl font-extrabold text-on-surface dark:text-content-dark">Admin Panel</h1>
        <p className="mt-2 text-sm text-on-surface-variant dark:text-content-dark/60">Manage users and roles.</p>

        {isLoading ? (
          <p className="mt-4 text-sm text-on-surface-variant dark:text-content-dark/70">Loading users...</p>
        ) : null}

        {isError ? (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            {error instanceof Error ? error.message : 'Could not load users.'}
          </p>
        ) : null}

        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setCurrentPage(1)
          }}
          placeholder="Search by username"
          className="mt-6 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 md:max-w-md dark:border-white/10 dark:bg-surface-dark"
        />

        <div className="mt-4 flex items-center gap-3">
          <label htmlFor="admin-role-filter" className="text-sm text-on-surface-variant dark:text-content-dark/70">
            Filter by role
          </label>
          <select
            id="admin-role-filter"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value)
              setCurrentPage(1)
            }}
            className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm dark:border-white/10 dark:bg-surface-dark"
          >
            <option value="ALL">ALL</option>
            {allRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant dark:border-white/10">
                <th className="py-2">Username</th>
                <th className="py-2">Current Roles</th>
                <th className="py-2">Edit Roles (comma separated)</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => {
                const currentRoles = user.roles.join(', ')
                const draftValue = roleDrafts[user.id] ?? currentRoles

                return (
                  <tr key={user.id} className="border-b border-outline-variant/60 dark:border-white/10">
                    <td className="py-2">{user.username}</td>
                    <td className="py-2">{currentRoles || 'NONE'}</td>
                    <td className="py-2">
                      <input
                        value={draftValue}
                        onChange={(event) =>
                          setRoleDrafts((prev) => ({ ...prev, [user.id]: event.target.value }))
                        }
                        className="w-full rounded-md border border-outline-variant bg-surface px-2 py-1 dark:border-white/10 dark:bg-surface-dark"
                      />
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateRolesMutation.mutate({ userId: user.id, roles: parseRoles(draftValue) })
                          }
                          className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-black hover:opacity-90"
                        >
                          Save Roles
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteUserMutation.mutate(user.id)}
                          className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500/20"
                        >
                          Delete User
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant dark:text-content-dark/70">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-outline-variant px-3 py-1 disabled:opacity-50 dark:border-white/10"
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
