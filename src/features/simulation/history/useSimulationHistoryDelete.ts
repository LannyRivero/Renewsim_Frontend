import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSimulationById } from '../services/simulationService'
import { useToastStore } from '@/stores/toastStore'
import type { ListUserSimulationsResponse } from '@/shared/types'

export function useSimulationHistoryDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSimulationById,
    onMutate: async (simulationId) => {
      await queryClient.cancelQueries({ queryKey: ['simulation-history'] })

      const previousHistory = queryClient.getQueryData<ListUserSimulationsResponse>(['simulation-history'])

      queryClient.setQueryData<ListUserSimulationsResponse>(['simulation-history'], (current) => {
        if (!current) return current
        return {
          ...current,
          items: current.items.filter((item) => item.id !== simulationId),
          total: Math.max(0, current.total - (current.items.some((item) => item.id === simulationId) ? 1 : 0)),
        }
      })

      return { previousHistory }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulation-history'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
      useToastStore.getState().pushToast({
        title: 'Simulación eliminada',
        description: 'La simulación se eliminó correctamente.',
        variant: 'success',
      })
    },
    onError: (_error, _simulationId, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['simulation-history'], context.previousHistory)
      }

      useToastStore.getState().pushToast({
        title: 'Error al eliminar',
        description: 'No se pudo eliminar la simulación. Intentá nuevamente.',
        variant: 'error',
      })
    },
  })
}
