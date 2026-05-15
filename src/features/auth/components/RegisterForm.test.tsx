import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'
import * as authService from '../services/authService'

vi.mock('../services/authService')

const mockRegister = vi.mocked(authService.register)

function renderForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <RegisterForm onSuccess={onSuccess} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('RegisterForm', () => {
  it('renders all fields and submit button', () => {
    renderForm()
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument()
  })

  it('shows link to login page', () => {
    renderForm()
    expect(screen.getByRole('link', { name: /inicia sesión/i })).toBeInTheDocument()
  })

  it('shows password validation errors when submitting weak password', async () => {
    renderForm()
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'ana@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'weak' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

    expect(await screen.findByText('Mínimo 8 caracteres')).toBeInTheDocument()
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('calls register service with email as username on valid submit', async () => {
    mockRegister.mockResolvedValueOnce({ token: 'tok123' })
    const onSuccess = vi.fn()
    renderForm(onSuccess)

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana López' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'ana@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Secure1!' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'ana@test.com',
        password: 'Secure1!',
      })
      expect(onSuccess).toHaveBeenCalledWith('tok123')
    })
  })

  it('shows error message when register fails', async () => {
    mockRegister.mockRejectedValueOnce(new Error('El usuario ya existe'))
    renderForm()

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'dup@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Secure1!' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('disables submit button while loading', async () => {
    mockRegister.mockImplementationOnce(() => new Promise(() => {}))
    renderForm()

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'ana@test.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'Secure1!' } })
    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registrando|cargando/i })).toBeDisabled()
    })
  })
})
