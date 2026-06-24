import { Clock3, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getSimulationHistory } from '../services/simulationService'
import {
  SimulationActionButton,
  SimulationPageContent,
  SimulationPageShell,
  SimulationSectionHeader,
} from '@/shared/components'
import { SimulationHistoryTable } from './SimulationHistoryTable'
import { useSimulationHistoryDelete } from './useSimulationHistoryDelete'

export function SimulationHistoryPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation-history'],
    queryFn: getSimulationHistory,
  })

  const deleteMutation = useSimulationHistoryDelete()

  const rows = data ?? []

  return (
    <SimulationPageShell>
      <SimulationPageContent>
        <SimulationSectionHeader
          eyebrow="Archivo de simulaciones"
          eyebrowIcon={<Clock3 className="h-3.5 w-3.5" />}
          title="Historial de simulaciones"
          description="SeguÍ ejecuciones anteriores, reabrí escenarios clave y gestioná el análisis histórico sin salir del espacio de trabajo."
          actions={
            <Link to="/simulador/nueva">
              <SimulationActionButton type="button" variant="primary">
                <Plus className="h-4 w-4" />
                Nueva simulación
              </SimulationActionButton>
            </Link>
          }
        />

        <SimulationHistoryTable
          rows={rows}
          isLoading={isLoading}
          isError={isError}
          isDeleting={deleteMutation.isPending}
          onDelete={(simulationId) => deleteMutation.mutate(simulationId)}
        />
      </SimulationPageContent>
    </SimulationPageShell>
  )
}
