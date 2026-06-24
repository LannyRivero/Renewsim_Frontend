import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import * as authService from '../services/authService'

vi.mock('../services/authService')

const mockLogin = vi.mocked(authService.login)

function renderForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <LoginForm onSuccess={onSuccess} />
    </MemoryRouter>
  )
}

beforeEach(() => vi.clearAllMocks())

describe('LoginForm', () => {
  it('renders email, password and submit button', () => {
    renderForm()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows link to register page', () => {
    renderForm()
    expect(screen.getByRole('link', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('calls login service with email payload', async () => {
    mockLogin.mockResolvedValueOnce({ token: 'tok456' })
    const onSuccess = vi.fn()
    renderForm(onSuccess)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Pass1!' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'Pass1!',
      })
      expect(onSuccess).toHaveBeenCalledWith('tok456')
    })
  })

  it('shows error alert when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Unauthorized'))
    renderForm()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'bad@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Wrong1!' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('disables button while loading', async () => {
    mockLogin.mockImplementationOnce(() => new Promise(() => {}))
    renderForm()

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'u@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Pass1!' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /iniciando sesión|loading/i })).toBeDisabled()
    })
  })
})
