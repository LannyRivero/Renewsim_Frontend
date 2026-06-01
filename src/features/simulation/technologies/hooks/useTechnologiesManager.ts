import { useState } from 'react'
import { isAxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { technologySchema } from '../schemas/technologySchema'
import { createTechnology, deleteTechnologyById, getAllTechnologies, updateTechnologyById } from '../services/technologyService'
import type { TechnologyItem } from '@/shared/types'
import { useTechnologyStore } from '@/stores/technologyStore'
import { useToastStore } from '@/stores/toastStore'

export function useTechnologiesManager() {
  const queryClient = useQueryClient()
  const draft = useTechnologyStore((state) => state.draft)
  const setDraftField = useTechnologyStore((state) => state.setDraftField)
  const resetDraft = useTechnologyStore((state) => state.resetDraft)
  const [formError, setFormError] = useState<string | null>(null)
  const [editingTechnologyId, setEditingTechnologyId] = useState<string | null>(null)
  const [technologyToDelete, setTechnologyToDelete] = useState<{ id: string; name: string } | null>(null)

  const {
    data: technologies = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['technologies'],
    queryFn: getAllTechnologies,
  })

  function getErrorStatusCode(error: unknown): number | undefined {
    if (isAxiosError(error)) return error.response?.status
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as { response?: { status?: unknown } }).response
      return typeof response?.status === 'number' ? response.status : undefined
    }
    return undefined
  }

  const createOrUpdateMutation = useMutation({
    mutationFn: async (payload: {
      technologyId: string | null
      values: Parameters<typeof createTechnology>[0]
    }) => {
      if (payload.technologyId) {
        return updateTechnologyById(payload.technologyId, payload.values)
      }

      return createTechnology(payload.values)
    },
    onSuccess: () => {
      resetDraft()
      setEditingTechnologyId(null)
      setFormError(null)
      queryClient.invalidateQueries({ queryKey: ['technologies'] })
      useToastStore.getState().pushToast({
        title: editingTechnologyId ? 'Tecnología Actualizada' : 'Tecnología Creada',
        description: editingTechnologyId
          ? 'La tecnología se actualizó correctamente.'
          : 'La tecnología se creó correctamente.',
        variant: 'success',
      })
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: editingTechnologyId ? 'Error al Actualizar' : 'Error al Crear',
        description: editingTechnologyId
          ? 'No se pudo actualizar la tecnología. Por favor, revise los campos.'
          : 'No se pudo crear la tecnología. Por favor, revise los campos.',
        variant: 'error',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTechnologyById,
    onMutate: async (technologyId) => {
      await queryClient.cancelQueries({ queryKey: ['technologies'] })
      const previousTechnologies = queryClient.getQueryData<TechnologyItem[]>(['technologies'])

      queryClient.setQueryData<TechnologyItem[]>(['technologies'], (previous = []) =>
        previous.filter((technology) => technology.id !== technologyId),
      )

      return { previousTechnologies }
    },
    onSuccess: () => {
      setTechnologyToDelete(null)
      useToastStore.getState().pushToast({
        title: 'Tecnología Eliminada',
        description: 'La tecnología se eliminó correctamente.',
        variant: 'success',
      })
    },
    onError: (error, technologyId, context) => {
      const statusCode = getErrorStatusCode(error)
      const notFound = statusCode === 404
      const blockedByRelation = statusCode === 409 || statusCode === 422

      if (notFound) {
        setTechnologyToDelete(null)
        useToastStore.getState().pushToast({
          title: 'Tecnología ya eliminada',
          description: 'La tecnología no existía en el servidor y se sincronizó el listado.',
          variant: 'success',
        })
        return
      }

      if (context?.previousTechnologies) {
        queryClient.setQueryData<TechnologyItem[]>(['technologies'], context.previousTechnologies)
      }

      useToastStore.getState().pushToast({
        title: blockedByRelation ? 'Eliminación Bloqueada' : 'Error al Eliminar',
        description: blockedByRelation
          ? 'Esta tecnología se utiliza en una o más simulaciones y no se puede eliminar.'
          : 'No se pudo eliminar la tecnología.',
        variant: 'error',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] })
    },
  })

  function requestDeleteTechnology(technologyId: string, technologyName: string) {
    setTechnologyToDelete({ id: technologyId, name: technologyName })
  }

  function confirmDeleteTechnology() {
    if (!technologyToDelete) return
    deleteMutation.mutate(technologyToDelete.id)
  }

  function cancelDeleteTechnology() {
    if (deleteMutation.isPending) return
    setTechnologyToDelete(null)
  }

  function startEditingTechnology(technology: TechnologyItem) {
    setEditingTechnologyId(technology.id)
    setDraftField('name', technology.name)
    setDraftField('energyType', technology.energyType as 'SOLAR' | 'WIND' | 'HYDRO')
    setDraftField('installedPower', technology.installedPower || 1)
    setDraftField('capacityFactor', technology.capacityFactor)
    setDraftField('efficiency', technology.efficiency <= 1 ? Math.round(technology.efficiency * 100) : technology.efficiency)
    setDraftField('co2Reduction', technology.co2Reduction)
    setDraftField('installationCost', technology.installationCost)
    setDraftField('maintenanceCost', technology.maintenanceCost)
    setDraftField('environmentalImpact', technology.environmentalImpact)
    setFormError(null)
  }

  function cancelEditingTechnology() {
    setEditingTechnologyId(null)
    setFormError(null)
    resetDraft()
  }

  function submitTechnology(event: React.FormEvent) {
    event.preventDefault()
    const parsed = technologySchema.safeParse(draft)
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Valores inválidos.')
      return
    }

    setFormError(null)

    const { installedPower, capacityFactor, ...rest } = parsed.data

    createOrUpdateMutation.mutate({
      technologyId: editingTechnologyId,
      values: {
        ...rest,
        installedPower,
        capacityFactor,
        efficiency: rest.efficiency / 100,
      },
    })
  }

  return {
    draft,
    setDraftField,
    technologies,
    isLoading,
    isError,
    error,
    formError,
    submitTechnology,
    createOrUpdateMutation,
    deleteMutation,
    technologyToDelete,
    requestDeleteTechnology,
    confirmDeleteTechnology,
    cancelDeleteTechnology,
    editingTechnologyId,
    startEditingTechnology,
    cancelEditingTechnology,
  }
}
