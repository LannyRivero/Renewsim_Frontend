# Code Smells Analysis

## Metodologia
- Fecha: 2026-05-29
- Scope: `src/components/`, `src/features/` (foco en New Simulation, Admin Page y Dashboard)
- Criterios: Martin Fowler (Refactoring) + React antipatterns
- Herramientas: Inspeccion manual + ESLint (SonarJS no configurado en este repo)

## 🚨 Code Smells Identificados

### Magic Numbers - Severidad: 🟡
**Ubicacion:** `src/features/simulation/dashboard/services/dashboardService.ts:121`, `src/features/simulation/dashboard/services/dashboardService.ts:139`, `src/features/simulation/dashboard/services/dashboardService.ts:141`, `src/features/simulation/new-simulation/hooks/useLocationSuggestions.ts:14`, `src/features/simulation/new-simulation/hooks/useClimatePreview.ts:40`

**Codigo:**
```typescript
const estimatedKwh = explicitKwh ?? Math.max(1500, Math.round((efficiency ?? 75) * 90))
const avgRoi = roiCount > 0 ? totalRoi / roiCount : 15
const avgEfficiency = efficiencyCount > 0 ? totalEfficiency / efficiencyCount : 82.4
const co2SavedKg = Math.round(totalKwh * 0.2)

if (currentQuery.length < 2) return
}, 300)

if (trimmedLocation.length < 2) return
}, 450)
```

**Problema:** Hay constantes de negocio y UX hardcodeadas sin nombre semantico.

**Impacto:** Cambios de reglas (umbral de busqueda, debounce, estimaciones) requieren rastreo manual y generan riesgo de inconsistencias.

**Refactor sugerido:** Extraer constantes nombradas (`MIN_LOCATION_QUERY_LENGTH`, `LOCATION_SEARCH_DEBOUNCE_MS`, `DEFAULT_AVG_ROI`, `CO2_FACTOR`) en `constants.ts` por dominio.

### Duplicate Code - Severidad: 🟡
**Ubicacion:** `src/features/simulation/dashboard/data/dashboardMock.ts:37`, `src/features/simulation/dashboard/data/dashboardMock.ts:44`

**Codigo:**
```typescript
export const ENERGY_BY_SOURCE: EnergySource[] = [
  { label: 'Solar', kwh: 4000 },
  { label: 'Wind', kwh: 3000 },
  { label: 'Hydroelectric', kwh: 5000 },
  { label: 'Biomasa', kwh: 8000 },
]

export const DISTRIBUTION: DistributionSlice[] = [
  { label: 'Solar', kwh: 4000 },
  { label: 'Wind', kwh: 3000 },
  { label: 'Hydroelectric', kwh: 5000 },
  { label: 'Biomasa', kwh: 8000 },
]
```

**Problema:** Misma estructura y valores duplicados para dos datasets.

**Impacto:** Alto riesgo de drift (editar uno y olvidar el otro), ruido cognitivo en mantenimiento.

**Refactor sugerido:** Definir una sola fuente (`BASE_SOURCE_DISTRIBUTION`) y derivar `ENERGY_BY_SOURCE` y `DISTRIBUTION` desde esa base con mapeo tipado.

### Primitive Obsession - Severidad: 🟡
**Ubicacion:** `src/features/simulation/dashboard/data/dashboardMock.ts:17`, `src/features/simulation/dashboard/services/dashboardService.ts:146`, `src/features/simulation/dashboard/services/dashboardService.ts:154`

**Codigo:**
```typescript
export interface EfficiencyMetric {
  label: string
  value: string
  hint: string
}

{ label: 'CO2 Saved', value: `${co2SavedKg.toLocaleString('en-US')} kg`, icon: 'eco' }
{ label: 'Cost per kWh', value: '$0.073', hint: 'Blended production cost' }
```

**Problema:** Valores de negocio se modelan como `string` formateado (unidades y moneda embebidas), en lugar de tipos de dominio.

**Impacto:** Dificulta i18n, validacion, comparaciones numericas y reutilizacion de formateadores.

**Refactor sugerido:** Usar value objects (`{ amount: number, unit: 'kg' | 'kWh' }`, `{ amount: number, currency: 'USD' }`) y centralizar formato en helpers de presentacion.

### Long Parameter List - Severidad: 🟡
**Ubicacion:** `src/features/simulation/new-simulation/hooks/useSimulationSubmission.ts:14`, `src/features/simulation/admin/hooks/useAdminUsersTableState.ts:40`

**Codigo:**
```typescript
interface UseSimulationSubmissionParams {
  draft: SimulationFormValues
  resolvedClimate: ResolvedClimate | null
  setResolvedClimate: (value: ResolvedClimate) => void
  setClimatePreview: (value: ReturnType<typeof toClimatePreview>) => void
  setLastResult: (result: Awaited<ReturnType<typeof createSimulation>>) => void
  setLastRunInput: (payload: Parameters<typeof createSimulation>[0]) => void
}

const toggleRole = useCallback((
  userId: string,
  currentRoles: string[],
  role: string,
  checked: boolean,
) => {
  // ...
}, [getDraftRoles])
```

**Problema:** Demasiados parametros primitivos/callbacks acoplados al contrato del hook/funcion.

**Impacto:** Menor legibilidad, mayor fragilidad de API interna y mas costo al testear/mokear.

**Refactor sugerido:** Agrupar en objetos de contexto (`submissionDeps`, `roleToggleCommand`) o encapsular parte del estado dentro del hook.

### Dead Code / Unused API Surface - Severidad: ⚠
**Ubicacion:** `src/features/simulation/new-simulation/hooks/useClimatePreview.ts:55`

**Codigo:**
```typescript
return {
  isRefreshingClimate,
  displayedClimatePreview,
  resolvedClimate,
  setResolvedClimate,
  setClimatePreview,
  canReuseResolvedClimate,
}
```

**Problema:** `canReuseResolvedClimate` se expone en el retorno del hook pero no se consume desde `NewSimulationPage`.

**Impacto:** API mas grande de lo necesario, confusion sobre responsabilidades, deuda menor pero acumulativa.

**Refactor sugerido:** Quitar `canReuseResolvedClimate` del retorno de `useClimatePreview` o mover esa regla a un hook/servicio donde realmente se use.

## Observaciones React (complementarias)
- La pantalla `NewSimulationPage` mejoro mucho tras separar hooks/componentes, pero sigue con props wiring intensivo entre bloques.
- En `DashboardPage`, el fallback a mock cuando hay error puede ocultar fallos reales de backend y confundir diagnostico manual.
