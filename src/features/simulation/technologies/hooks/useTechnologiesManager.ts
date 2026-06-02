import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { technologySchema } from '../schemas/technologySchema'
import {
  createTechnology,
  deleteTechnologyById,
  getAllTechnologies,
  type TechnologyEnergyTypeFilter,
  type TechnologySortBy,
  type TechnologySortDirection,
  updateTechnologyById,
  type TechnologiesPageResult,
} from '../services/technologyService'
import type { TechnologyItem } from '@/shared/types'
import { useTechnologyStore } from '@/stores/technologyStore'
import { useToastStore } from '@/stores/toastStore'

export function useTechnologiesManager() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [size] = useState(20)
  const [energyTypeFilter, setEnergyTypeFilter] = useState<TechnologyEnergyTypeFilter>('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<TechnologySortBy>('name')
  const [sortDirection, setSortDirection] = useState<TechnologySortDirection>('asc')
  const draft = useTechnologyStore((state) => state.draft)
  const setDraftField = useTechnologyStore((state) => state.setDraftField)
  const resetDraft = useTechnologyStore((state) => state.resetDraft)
  const [formError, setFormError] = useState<string | null>(null)
  const [editingTechnologyId, setEditingTechnologyId] = useState<string | null>(null)
  const [technologyToDelete, setTechnologyToDelete] = useState<{ id: string; name: string } | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(0)
    }, 300)

    return () => {
      window.clearTimeout(timer)
    }
  }, [searchTerm])

  const {
    data: technologiesPage,
    isLoading,
    isError,
    error,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['technologies', page, size, energyTypeFilter, debouncedSearchTerm, sortBy, sortDirection],
    queryFn: () => getAllTechnologies(page, size, energyTypeFilter, debouncedSearchTerm, sortBy, sortDirection),
    placeholderData: keepPreviousData,
  })

  const technologies = technologiesPage?.items ?? []
  const totalElements = technologiesPage?.totalElements ?? 0
  const totalPages = technologiesPage?.totalPages ?? 1
  const visiblePage = technologiesPage?.page ?? page
  const visibleSize = technologiesPage?.size ?? size
  const visibleSortBy = technologiesPage?.sortBy ?? sortBy
  const visibleSortDirection = technologiesPage?.sortDirection ?? sortDirection

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
    onSuccess: (_data, variables) => {
      const wasEditing = Boolean(variables.technologyId)
      resetDraft()
      setEditingTechnologyId(null)
      setIsFormOpen(false)
      setFormError(null)
      queryClient.invalidateQueries({ queryKey: ['technologies'] })
      useToastStore.getState().pushToast({
        title: wasEditing ? 'Tecnología Actualizada' : 'Tecnología Creada',
        description: wasEditing
          ? 'La tecnología se actualizó correctamente.'
          : 'La tecnología se creó correctamente.',
        variant: 'success',
      })
    },
    onError: (_error, variables) => {
      const wasEditing = Boolean(variables.technologyId)
      useToastStore.getState().pushToast({
        title: wasEditing ? 'Error al Actualizar' : 'Error al Crear',
        description: wasEditing
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
      const previousPages = queryClient.getQueriesData<TechnologiesPageResult>({ queryKey: ['technologies'] })

      queryClient.setQueriesData<TechnologiesPageResult>({ queryKey: ['technologies'] }, (previous) => {
        if (!previous) return previous
        return {
          ...previous,
          items: previous.items.filter((technology) => technology.id !== technologyId),
          totalElements: Math.max(0, previous.totalElements - 1),
        }
      })

      return {
        previousPages,
        shouldMoveToPreviousPage: page > 0 && technologies.length === 1,
      }
    },
    onSuccess: (_data, _technologyId, context) => {
      if (context?.shouldMoveToPreviousPage) {
        setPage((current) => Math.max(0, current - 1))
      }

      setTechnologyToDelete(null)
      useToastStore.getState().pushToast({
        title: 'Tecnología Eliminada',
        description: 'La tecnología se eliminó correctamente.',
        variant: 'success',
      })
    },
    onError: (error, _technologyId, context) => {
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

      if (context?.previousPages) {
        for (const [queryKey, queryData] of context.previousPages) {
          queryClient.setQueryData(queryKey, queryData)
        }
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

  function goToPreviousPage() {
    if (isPlaceholderData) return
    setPage((current) => Math.max(0, current - 1))
  }

  function goToNextPage() {
    if (isPlaceholderData) return
    setPage((current) => Math.min(totalPages - 1, current + 1))
  }

  function setTechnologyEnergyTypeFilter(filter: TechnologyEnergyTypeFilter) {
    setEnergyTypeFilter(filter)
    setPage(0)
  }

  function setTechnologySearchTerm(search: string) {
    setSearchTerm(search)
  }

  function setTechnologySort(sortField: TechnologySortBy) {
    if (isPlaceholderData) return
    setPage(0)
    if (sortBy === sortField) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(sortField)
    setSortDirection('asc')
  }

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
    setIsFormOpen(true)
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
    if (createOrUpdateMutation.isPending) return
    setEditingTechnologyId(null)
    setFormError(null)
    setIsFormOpen(false)
    resetDraft()
  }

  function openCreateTechnologyForm() {
    cancelEditingTechnology()
    setIsFormOpen(true)
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
    isFormOpen,
    openCreateTechnologyForm,
    page: visiblePage,
    size: visibleSize,
    totalElements,
    totalPages,
    energyTypeFilter,
    setTechnologyEnergyTypeFilter,
    searchTerm,
    setTechnologySearchTerm,
    sortBy: visibleSortBy,
    sortDirection: visibleSortDirection,
    setTechnologySort,
    goToPreviousPage,
    goToNextPage,
    isLoading,
    isTableUpdating: isPlaceholderData,
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
