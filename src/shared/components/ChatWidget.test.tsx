import { fireEvent, render, screen } from '@testing-library/react'
import { ChatWidget } from './ChatWidget'
import { useUiStore } from '@/stores/uiStore'

beforeEach(() => {
  useUiStore.setState({ locale: 'es', isChatOpen: false })
})

describe('ChatWidget', () => {
  it('renders floating chat button', () => {
    render(<ChatWidget />)
    expect(screen.getByRole('button', { name: 'Open chat' })).toBeInTheDocument()
  })

  it('opens chat panel when floating button is clicked', () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }))

    expect(screen.getByRole('dialog', { name: 'Chat panel' })).toBeInTheDocument()
    expect(useUiStore.getState().isChatOpen).toBe(true)
  })

  it('closes chat panel when close button is clicked', () => {
    render(<ChatWidget />)
    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }))

    expect(screen.queryByRole('dialog', { name: 'Chat panel' })).not.toBeInTheDocument()
    expect(useUiStore.getState().isChatOpen).toBe(false)
  })
})
