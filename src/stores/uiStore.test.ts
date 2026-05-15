import { useUiStore } from './uiStore'

beforeEach(() => {
  useUiStore.setState({ locale: 'es', isChatOpen: false })
})

describe('uiStore', () => {
  describe('initial state', () => {
    it('has locale set to es', () => {
      expect(useUiStore.getState().locale).toBe('es')
    })

    it('has chat closed by default', () => {
      expect(useUiStore.getState().isChatOpen).toBe(false)
    })
  })

  describe('setLocale', () => {
    it('sets locale to en', () => {
      useUiStore.getState().setLocale('en')
      expect(useUiStore.getState().locale).toBe('en')
    })

    it('sets locale back to es', () => {
      useUiStore.getState().setLocale('en')
      useUiStore.getState().setLocale('es')
      expect(useUiStore.getState().locale).toBe('es')
    })
  })

  describe('toggleChat', () => {
    it('opens chat when initially closed', () => {
      useUiStore.getState().toggleChat()
      expect(useUiStore.getState().isChatOpen).toBe(true)
    })

    it('closes chat when toggled twice', () => {
      useUiStore.getState().toggleChat()
      useUiStore.getState().toggleChat()
      expect(useUiStore.getState().isChatOpen).toBe(false)
    })
  })
})
