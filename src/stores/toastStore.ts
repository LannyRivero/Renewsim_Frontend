import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastItem[]
  pushToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const TOAST_TIMEOUT_MS = 4000

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  pushToast: (toast) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))

    setTimeout(() => {
      const stillExists = get().toasts.some((item) => item.id === id)
      if (stillExists) {
        get().removeToast(id)
      }
    }, TOAST_TIMEOUT_MS)
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}))
