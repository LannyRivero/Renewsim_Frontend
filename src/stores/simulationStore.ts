import { create } from 'zustand'
import type { SimulationFormValues } from '@/features/simulation/schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

interface SimulationState {
  draft: SimulationFormValues
  lastResult: SimulationResult | null
  setDraftField: <K extends keyof SimulationFormValues>(field: K, value: SimulationFormValues[K]) => void
  setLastResult: (result: SimulationResult) => void
  resetDraft: () => void
}

const DEFAULT_DRAFT: SimulationFormValues = {
  location: '',
  energyType: 'solar',
  projectSize: 500,
  budget: 1_000_000,
}

export const useSimulationStore = create<SimulationState>()((set) => ({
  draft: DEFAULT_DRAFT,
  lastResult: null,
  setDraftField: (field, value) =>
    set((state) => ({ draft: { ...state.draft, [field]: value } })),
  setLastResult: (result) => set({ lastResult: result }),
  resetDraft: () => set({ draft: DEFAULT_DRAFT }),
}))
