export class LocationServiceError extends Error {
  cause?: unknown

  constructor(message: string, cause?: unknown) {
    super(message)
    this.name = 'LocationServiceError'
    this.cause = cause
  }
}

export class InvalidLocationPayloadError extends LocationServiceError {
  constructor(message: string, cause?: unknown) {
    super(message, cause)
    this.name = 'InvalidLocationPayloadError'
  }
}
