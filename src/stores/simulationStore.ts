import { create } from 'zustand'
import {
  DEFAULT_SIMULATION_FORM_VALUES,
  type SimulationCreateFormInput,
  type SimulationCreateFormValues,
} from '@/features/simulation/schemas/simulationSchema'
import type { SimulationResult } from '@/shared/types'

interface SimulationState {
  draft: SimulationCreateFormInput
  lastResult: SimulationResult | null
  lastRunInput: SimulationCreateFormValues | null
  setDraftField: <K extends keyof SimulationCreateFormInput>(field: K, value: SimulationCreateFormInput[K]) => void
  setLastResult: (result: SimulationResult) => void
  setLastRunInput: (payload: SimulationCreateFormValues) => void
  resetDraft: () => void
}

const DEFAULT_DRAFT = DEFAULT_SIMULATION_FORM_VALUES

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
