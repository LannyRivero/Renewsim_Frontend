import { fireEvent, render, screen } from '@testing-library/react'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ChatWidget } from './ChatWidget'
import { useUiStore } from '@/stores/uiStore'

beforeEach(() => {
  useUiStore.setState({ locale: 'es', isChatOpen: false })
})

describe('uiStore integration', () => {
  it('shares locale state between component and store', () => {
    render(<LocaleSwitcher />)

    fireEvent.change(screen.getByLabelText('Idioma'), { target: { value: 'en' } })

    expect(useUiStore.getState().locale).toBe('en')
    expect(screen.getByLabelText('Idioma')).toHaveValue('en')
  })

  it('shares chat visibility state between component and store', () => {
    render(<ChatWidget />)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir chat' }))
    expect(useUiStore.getState().isChatOpen).toBe(true)
    expect(screen.getByRole('dialog', { name: 'Panel de chat' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar chat' }))
    expect(useUiStore.getState().isChatOpen).toBe(false)
    expect(screen.queryByRole('dialog', { name: 'Panel de chat' })).not.toBeInTheDocument()
  })

  it('keeps independent slices in sync across mounted components', () => {
    render(
      <>
        <LocaleSwitcher />
        <ChatWidget />
      </>,
    )

    fireEvent.change(screen.getByLabelText('Idioma'), { target: { value: 'en' } })
    fireEvent.click(screen.getByRole('button', { name: 'Abrir chat' }))

    const state = useUiStore.getState()
    expect(state.locale).toBe('en')
    expect(state.isChatOpen).toBe(true)
    expect(screen.getByRole('dialog', { name: 'Panel de chat' })).toBeInTheDocument()
  })
})
