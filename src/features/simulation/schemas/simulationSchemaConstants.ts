export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 120
export const LOCATION_QUERY_MIN_LENGTH = 2
export const LOCATION_LABEL_MIN_LENGTH = 2
export const COUNTRY_CODE_MIN_LENGTH = 2
export const MONTHS_PER_YEAR = 12

export const LATITUDE_RANGE = {
  min: -90,
  max: 90,
} as const

export const LONGITUDE_RANGE = {
  min: -180,
  max: 180,
} as const

export const PERFORMANCE_RATIO_RANGE = {
  minExclusive: 0,
  maxInclusive: 1,
} as const

export const DEGRADATION_RATE_RANGE = {
  minInclusive: 0,
  maxInclusive: 5,
} as const

export const AVAILABILITY_RANGE = {
  minExclusive: 0,
  maxInclusive: 100,
} as const

export const PROJECT_LIFETIME_MIN_YEARS = 5

export const DEFAULT_COORDINATE = 0
export const DEFAULT_PERFORMANCE_RATIO = 0.81
export const DEFAULT_DEGRADATION_RATE_ANNUAL_PCT = 0.5
export const DEFAULT_AVAILABILITY_PCT = 99

export const DEFAULT_SYSTEM_LOSSES_PCT = {
  inverter: 2,
  temperature: 6,
  wiring: 1,
  soiling: 3,
  other: 1,
} as const

export const DEFAULT_OPEX_ANNUAL = 7200
export const DEFAULT_EXPORT_PRICE_PER_KWH = 0.07
export const DEFAULT_DISCOUNT_RATE_PCT = 8
export const DEFAULT_PROJECT_LIFETIME_YEARS = 20
