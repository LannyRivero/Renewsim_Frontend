import { create } from 'zustand'
import type { SimulationCreateFormValues, SimulationFormValues } from '@/features/simulation/schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

interface SimulationState {
  draft: SimulationFormValues
  lastResult: SimulationResult | null
  lastRunInput: SimulationCreateFormValues | null
  setDraftField: <K extends keyof SimulationFormValues>(field: K, value: SimulationFormValues[K]) => void
  setLastResult: (result: SimulationResult) => void
  setLastRunInput: (payload: SimulationCreateFormValues) => void
  resetDraft: () => void
}

const DEFAULT_DRAFT: SimulationFormValues = {
  location: '',
  energyType: 'solar',
  projectSize: 500,
  budget: 1_000_000,
  energyConsumption: 1_000,
}

export const useSimulationStore = create<SimulationState>()((set) => ({
  draft: DEFAULT_DRAFT,
  lastResult: null,
  lastRunInput: null,
  setDraftField: (field, value) =>
    set((state) => ({ draft: { ...state.draft, [field]: value } })),
  setLastResult: (result) => set({ lastResult: result }),
  setLastRunInput: (payload) => set({ lastRunInput: payload }),
  resetDraft: () => set({ draft: DEFAULT_DRAFT }),
}))
