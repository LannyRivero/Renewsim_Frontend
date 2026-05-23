import { fireEvent, render, screen } from '@testing-library/react'
import { LocaleSwitcher } from './LocaleSwitcher'
import { useUiStore } from '@/stores/uiStore'

beforeEach(() => {
  useUiStore.setState({ locale: 'es', isChatOpen: false })
})

describe('LocaleSwitcher', () => {
  it('shows current locale from store', () => {
    render(<LocaleSwitcher />)
    expect(screen.getByLabelText('Language')).toHaveValue('es')
  })

  it('updates locale in store when user selects en', () => {
    render(<LocaleSwitcher />)
    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'en' } })
    expect(useUiStore.getState().locale).toBe('en')
  })
})
