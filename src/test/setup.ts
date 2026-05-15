import '@testing-library/jest-dom'
import { createElement } from 'react'
import { vi } from 'vitest'

vi.mock('react-chartjs-2', () => {
  const CanvasMock = ({ 'aria-label': ariaLabel }: { 'aria-label'?: string }) =>
    createElement('canvas', {
      'aria-label': ariaLabel,
      role: 'img',
      'data-testid': 'chart-canvas',
    })

  return {
    Bar: CanvasMock,
    Doughnut: CanvasMock,
    Line: CanvasMock,
    Pie: CanvasMock,
  }
})
