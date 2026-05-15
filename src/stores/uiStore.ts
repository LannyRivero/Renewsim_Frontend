import { create } from 'zustand'

type Locale = 'es' | 'en'

interface UiState {
  locale: Locale
  isChatOpen: boolean
  setLocale: (locale: Locale) => void
  toggleChat: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  locale: 'es',
  isChatOpen: false,
  setLocale: (locale) => set({ locale }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
}))
