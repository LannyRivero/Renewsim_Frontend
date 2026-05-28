import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTechnology, deleteTechnologyById, getAllTechnologies } from './services/technologyService'
import { technologySchema } from './schemas/technologySchema'
import { useTechnologyStore } from '@/stores/technologyStore'
import { useToastStore } from '@/stores/toastStore'

export function TechnologiesPage() {
  const queryClient = useQueryClient()
  const draft = useTechnologyStore((state) => state.draft)
  const setDraftField = useTechnologyStore((state) => state.setDraftField)
  const resetDraft = useTechnologyStore((state) => state.resetDraft)
  const [formError, setFormError] = useState<string | null>(null)

  const { data: technologies = [] } = useQuery({
    queryKey: ['technologies'],
    queryFn: getAllTechnologies,
  })

  const createMutation = useMutation({
    mutationFn: createTechnology,
    onSuccess: () => {
      resetDraft()
      setFormError(null)
      queryClient.invalidateQueries({ queryKey: ['technologies'] })
      useToastStore.getState().pushToast({
        title: 'Technology Created',
        description: 'The technology was created successfully.',
        variant: 'success',
      })
    },
    onError: () => {
      useToastStore.getState().pushToast({
        title: 'Create Error',
        description: 'Could not create technology. Please check the fields.',
        variant: 'error',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTechnologyById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technologies'] })
      useToastStore.getState().pushToast({
        title: 'Technology Deleted',
        description: 'The technology was deleted successfully.',
        variant: 'success',
      })
    },
  })

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const parsed = technologySchema.safeParse(draft)
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? 'Invalid values.')
      return
    }
    setFormError(null)
    createMutation.mutate({
      ...parsed.data,
      efficiency: parsed.data.efficiency / 100,
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <section className="rounded-xl border border-outline-variant bg-surface p-6 dark:border-white/10 dark:bg-[#111d18]">
        <h1 className="text-2xl font-extrabold text-on-surface dark:text-content-dark">Technologies</h1>
        <p className="mt-2 text-sm text-on-surface-variant dark:text-content-dark/60">Create and manage renewable technologies.</p>

        <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input value={draft.name} onChange={(e) => setDraftField('name', e.target.value)} placeholder="Technology name" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
          <select value={draft.energyType} onChange={(e) => setDraftField('energyType', e.target.value as 'SOLAR' | 'WIND' | 'HYDRO')} className="rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]">
            <option value="SOLAR">Solar</option>
            <option value="WIND">Wind</option>
            <option value="HYDRO">Hydro</option>
          </select>
          <input type="number" value={draft.efficiency} onChange={(e) => setDraftField('efficiency', Number(e.target.value))} placeholder="Efficiency (0-100)" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
          <input type="number" value={draft.co2Reduction} onChange={(e) => setDraftField('co2Reduction', Number(e.target.value))} placeholder="CO2 reduction" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
          <input type="number" value={draft.installationCost} onChange={(e) => setDraftField('installationCost', Number(e.target.value))} placeholder="Installation cost" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
          <input type="number" value={draft.maintenanceCost} onChange={(e) => setDraftField('maintenanceCost', Number(e.target.value))} placeholder="Maintenance cost" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18]" />
          <input type="number" value={draft.environmentalImpact} onChange={(e) => setDraftField('environmentalImpact', Number(e.target.value))} placeholder="Environmental impact (0-100)" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 dark:border-white/10 dark:bg-[#111d18] md:col-span-2" />

          {formError ? <p role="alert" className="text-sm text-red-500 md:col-span-2">{formError}</p> : null}

          <div className="md:col-span-2">
            <button type="submit" disabled={createMutation.isPending} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-black transition hover:opacity-90">
              {createMutation.isPending ? 'Creating...' : 'Create Technology'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-outline-variant bg-surface p-6 dark:border-white/10 dark:bg-[#111d18]">
        <h2 className="text-xl font-bold text-on-surface dark:text-content-dark">Registered Technologies</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline-variant dark:border-white/10">
                <th className="py-2">Name</th>
                <th className="py-2">Type</th>
                <th className="py-2">Efficiency</th>
                <th className="py-2">CO2</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {technologies.map((tech) => (
                <tr key={tech.id} className="border-b border-outline-variant/60 dark:border-white/10">
                  <td className="py-2">{tech.name}</td>
                  <td className="py-2">{tech.energyType}</td>
                  <td className="py-2">{Math.round(tech.efficiency * 100) / 100}</td>
                  <td className="py-2">{tech.co2Reduction}</td>
                  <td className="py-2">
                    <button type="button" onClick={() => deleteMutation.mutate(tech.id)} className="rounded-md bg-red-500/10 px-3 py-1 text-red-600 hover:bg-red-500/20">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
