import { fireEvent, render, screen } from '@testing-library/react'
import { ChatWidget } from './ChatWidget'
import { useUiStore } from '@/stores/uiStore'

beforeEach(() => {
  useUiStore.setState({ locale: 'es', isChatOpen: false })
})

describe('ChatWidget', () => {
  it('renders floating chat button', () => {
    render(<ChatWidget />)
    expect(screen.getByRole('button', { name: 'Abrir chat' })).toBeInTheDocument()
  })

  it('opens chat panel when floating button is clicked', () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir chat' }))

    expect(screen.getByRole('dialog', { name: 'Panel de chat' })).toBeInTheDocument()
    expect(useUiStore.getState().isChatOpen).toBe(true)
  })

  it('closes chat panel when close button is clicked', () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: 'Abrir chat' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar chat' }))

    expect(screen.queryByRole('dialog', { name: 'Panel de chat' })).not.toBeInTheDocument()
    expect(useUiStore.getState().isChatOpen).toBe(false)
  })
})
