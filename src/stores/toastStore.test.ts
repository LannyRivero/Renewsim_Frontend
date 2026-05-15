import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToastStore } from './toastStore'

beforeEach(() => {
  useToastStore.setState({ toasts: [] })
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('toastStore', () => {
  it('adds a toast', () => {
    useToastStore.getState().pushToast({
      title: 'Guardado',
      description: 'Cambios guardados.',
      variant: 'success',
    })

    const { toasts } = useToastStore.getState()
    expect(toasts).toHaveLength(1)
    expect(toasts[0].title).toBe('Guardado')
    expect(toasts[0].variant).toBe('success')
  })

  it('removes a toast by id', () => {
    useToastStore.getState().pushToast({ title: 'A', variant: 'info' })
    const id = useToastStore.getState().toasts[0].id

    useToastStore.getState().removeToast(id)

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('auto-dismisses toast after timeout', () => {
    useToastStore.getState().pushToast({ title: 'Temp', variant: 'warning' })
    expect(useToastStore.getState().toasts).toHaveLength(1)

    vi.advanceTimersByTime(4000)

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
