export interface CloreaiErrorOptions extends ErrorOptions {
  init?: RequestInit
  request?: Request
  response?: Response
  statusCode?: number
  description?: string
  data?: unknown
}

export class CloreaiError extends Error {
  init?: RequestInit
  request?: Request
  response?: Response
  statusCode?: number
  description?: string
  data?: unknown

  constructor(message?: string, options?: CloreaiErrorOptions) {
    super(message)
    this.name = 'CloreaiError'
    Object.assign(this, options)
  }
}
