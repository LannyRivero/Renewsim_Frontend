import { create } from 'zustand'
import type { TechnologyFormValues } from '@/features/simulation/technologies/schemas/technologySchema'

interface TechnologyState {
  draft: TechnologyFormValues
  setDraftField: <K extends keyof TechnologyFormValues>(field: K, value: TechnologyFormValues[K]) => void
  resetDraft: () => void
}

const DEFAULT_DRAFT: TechnologyFormValues = {
  name: '',
  energyType: 'SOLAR',
  installedPower: 1,
  capacityFactor: 18,
  efficiency: 50,
  co2Reduction: 0,
  installationCost: 1000,
  maintenanceCost: 0,
  environmentalImpact: 50,
}

export const useTechnologyStore = create<TechnologyState>()((set) => ({
  draft: DEFAULT_DRAFT,
  setDraftField: (field, value) => set((state) => ({ draft: { ...state.draft, [field]: value } })),
  resetDraft: () => set({ draft: DEFAULT_DRAFT }),
}))
