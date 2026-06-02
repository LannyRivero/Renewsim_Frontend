import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteUser, getAllUsers, updateUserRoles } from '../services/userService'
import { useToastStore } from '@/stores/toastStore'

export function useAdminUsersData() {
  const queryClient = useQueryClient()
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null)
  const [savingUserId, setSavingUserId] = useState<string | null>(null)

  const { data: users = [], isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const updateRolesMutation = useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: string[] }) => updateUserRoles(userId, roles),
    onMutate: ({ userId }) => {
      setSavingUserId(userId)
    },
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
    onSettled: () => {
      setSavingUserId(null)
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

  const requestDeleteUser = useCallback((userId: string, username: string) => {
    setUserToDelete({ id: userId, username })
  }, [])

  const confirmDeleteUser = useCallback(() => {
    if (!userToDelete) return
    deleteUserMutation.mutate(userToDelete.id, {
      onSettled: () => {
        setUserToDelete(null)
      },
    })
  }, [deleteUserMutation, userToDelete])

  const saveRoles = useCallback((userId: string, roles: string[]) => {
    updateRolesMutation.mutate({ userId, roles })
  }, [updateRolesMutation])

  return {
    users,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    savingUserId,
    deletingUserId: deleteUserMutation.isPending ? userToDelete?.id ?? null : null,
    userToDelete,
    setUserToDelete,
    requestDeleteUser,
    confirmDeleteUser,
    saveRoles,
    isDeletePending: deleteUserMutation.isPending,
  }
}
