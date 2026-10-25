import type { ResponseData } from './types.ts'

export interface ErrorData extends ResponseData {
  max_step?: number
  time_to_lowering?: number
  min_price?: number
  [key: string]: unknown
}

export interface CloreaiErrorOptions extends ErrorOptions {
  request: Request
  response: Response
  data: ErrorData
}

export class CloreaiError extends Error {
  request: Request
  response: Response
  data: ErrorData

  constructor(message: string, options: CloreaiErrorOptions) {
    super(message, options)
    this.name = 'CloreaiError'

    this.request = options.request
    this.response = options.response
    this.data = options.data
  }
}
