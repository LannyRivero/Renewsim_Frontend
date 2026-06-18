import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDashboardData } from './dashboardService'
import { httpClient } from '@/services/httpClient'

vi.mock('@/services/httpClient', () => ({
  httpClient: {
    get: vi.fn(),
  },
}))

const mockedGet = vi.mocked(httpClient.get)

describe('dashboardService.getDashboardData', () => {
  beforeEach(() => {
    mockedGet.mockReset()
  })

  it('maps valid backend dashboard data', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        stats: {
          totalSimulations: 12,
          totalEnergyGeneratedKwh: 25000,
          totalCo2SavedKg: 5000,
          averageRoiPercent: 15.2,
        },
        energyBySource: [
          { label: 'Solar', kwh: 12000 },
        ],
        efficiencyMetrics: [
          { label: 'Factor de capacidad', value: '82.4%', hint: 'Utilizacion promedio del sistema' },
        ],
        targetVsActual: [
          { label: 'ROI', actual: 15.2, target: 16, unit: '%' },
        ],
      },
    })

    const result = await getDashboardData()

    expect(mockedGet).toHaveBeenCalledWith('/simulations/dashboard')
    expect(result).toEqual({
      stats: [
        { label: 'Simulaciones totales', value: '12', icon: 'insights' },
        { label: 'CO2 evitado', value: '5,000 kg', icon: 'eco' },
        { label: 'ROI promedio', value: '15.2%', icon: 'trending_up' },
        { label: 'Energía generada', value: '25,000 kWh', icon: 'bolt' },
      ],
      energyBySource: [{ label: 'Solar', kwh: 12000 }],
      distribution: [{ label: 'Solar', kwh: 12000 }],
      efficiencyMetrics: [
        { label: 'Factor de capacidad', value: '82.4%', hint: 'Utilizacion promedio del sistema' },
      ],
      targetVsActual: [{ label: 'ROI', actual: 15.2, target: 16, unit: '%' }],
    })
  })

  it('drops malformed backend rows instead of coercing them', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        stats: {
          totalSimulations: 3,
          totalEnergyGeneratedKwh: 25000,
          totalCo2SavedKg: 5000,
          averageRoiPercent: 15.2,
        },
        energyBySource: [
          { label: 'Solar', kwh: 12000 },
          { label: '', kwh: 3000 },
          { label: 'Wind', kwh: 'bad' },
        ],
        efficiencyMetrics: [
          { label: 'Disponibilidad', value: '99.2%', hint: 'Tiempo operativo del sistema' },
          { label: 'Costo por kWh', value: '', hint: 'Costo medio' },
        ],
        targetVsActual: [
          { label: 'ROI', actual: 15.2, target: 16, unit: '%' },
          { label: 'CO2', actual: 4800, target: 'bad', unit: 'kg' },
          { label: 'Energia', actual: 20000, target: 22000, unit: 'MWh' },
        ],
      },
    })

    const result = await getDashboardData()

    expect(result.energyBySource).toEqual([{ label: 'Solar', kwh: 12000 }])
    expect(result.distribution).toEqual([{ label: 'Solar', kwh: 12000 }])
    expect(result.efficiencyMetrics).toEqual([
      { label: 'Disponibilidad', value: '99.2%', hint: 'Tiempo operativo del sistema' },
    ])
    expect(result.targetVsActual).toEqual([
      { label: 'ROI', actual: 15.2, target: 16, unit: '%' },
    ])
  })

  it('returns empty dashboard data on 404', async () => {
    mockedGet.mockRejectedValueOnce({ response: { status: 404 } })

    const result = await getDashboardData()

    expect(result).toEqual({
      stats: [
        { label: 'Simulaciones totales', value: '0', icon: 'insights' },
        { label: 'CO2 evitado', value: 'N/D', icon: 'eco' },
        { label: 'ROI promedio', value: 'N/D', icon: 'trending_up' },
        { label: 'Energía generada', value: 'N/D', icon: 'bolt' },
      ],
      energyBySource: [],
      distribution: [],
      efficiencyMetrics: [],
      targetVsActual: [],
    })
  })
})
