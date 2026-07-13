import type { DetailSectionContent } from './simulationDetailsTypes'

export function buildClimateSection({
  energyType,
  irradiance,
  windSpeed,
  hydrology,
  averageTemperature,
  climateSource,
  climatePeriod,
}: {
  energyType: string
  irradiance: string | number
  windSpeed: string | number
  hydrology: string | number
  averageTemperature: string
  climateSource: string
  climatePeriod: string
}): DetailSectionContent {
  const normalized = energyType.trim().toUpperCase()
  const primaryResource =
    normalized === 'WIND'
      ? { label: 'Velocidad del viento', value: windSpeed === 'N/D' ? 'N/D' : `${windSpeed} m/s`, helper: 'Variable principal para leer la consistencia del recurso eolico.' }
      : normalized === 'HYDRO'
        ? { label: 'Condicion hidrologica', value: String(hydrology), helper: 'Variable principal para interpretar disponibilidad y estabilidad del recurso hidraulico.' }
        : { label: 'Irradiancia utilizable', value: irradiance === 'N/D' ? 'N/D' : `${irradiance} kWh/m2/día`, helper: 'Variable principal para interpretar el potencial solar del escenario.' }

  const climateRead =
    normalized === 'WIND'
      ? 'La lectura climatica debe concentrarse en estabilidad de viento, temperatura de operacion y ventana de datos usada para la simulacion.'
      : normalized === 'HYDRO'
        ? 'La lectura climatica debe concentrarse en condicion hidrologica, contexto de temperatura y trazabilidad temporal del recurso.'
        : 'La lectura climatica debe concentrarse en irradiancia, temperatura operativa y ventana temporal usada para estimar el recurso.'

  return {
    sectionLabel: 'Clima',
    title: 'Lectura climatica del recurso',
    summary: climateRead,
    primaryMetrics: [
      primaryResource,
      { label: 'Temperatura promedio', value: averageTemperature, helper: 'Ayuda a contextualizar operacion esperada y condiciones ambientales del escenario.' },
      { label: 'Ventana de datos', value: climatePeriod, helper: 'Periodo de referencia usado para sostener la lectura del recurso.' },
    ],
    supportingMetrics: [
      { label: 'Fuente climatica', value: climateSource, helper: 'Proveedor o fuente usada para la trazabilidad del dato.' },
      { label: 'Irradiancia reportada', value: irradiance === 'N/D' ? 'N/D' : `${irradiance} kWh/m2/día` },
      { label: 'Viento reportado', value: windSpeed === 'N/D' ? 'N/D' : `${windSpeed} m/s` },
      { label: 'Hidrologia reportada', value: String(hydrology) },
    ],
  }
}
