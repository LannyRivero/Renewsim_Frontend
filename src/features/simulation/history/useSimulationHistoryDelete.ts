import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSimulationById } from '../services/simulationService'
import { useToastStore } from '@/stores/toastStore'
import type { SimulationHistoryItem } from '@/shared/types'

export function useSimulationHistoryDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSimulationById,
    onMutate: async (simulationId) => {
      await queryClient.cancelQueries({ queryKey: ['simulation-history'] })

      const previousHistory = queryClient.getQueryData<SimulationHistoryItem[]>(['simulation-history'])

      queryClient.setQueryData<SimulationHistoryItem[]>(['simulation-history'], (current) => {
        if (!current) return current
        return current.filter((item) => item.id !== simulationId)
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
