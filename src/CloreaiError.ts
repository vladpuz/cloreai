import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

export interface CloreaiErrorOptions<
  T = unknown,
  D = unknown,
> extends ErrorOptions {
  code?: string
  config?: InternalAxiosRequestConfig<D>
  request?: unknown
  response?: AxiosResponse<T, D>
  error?: string
}

export class CloreaiError<
  T = unknown,
  D = unknown,
> extends AxiosError<T, D> {
  error?: string

  constructor(
    message?: string,
    options: CloreaiErrorOptions<T, D> = {},
  ) {
    super(
      message,
      options.code,
      options.config,
      options.request,
      options.response,
    )

    this.name = 'CloreaiError'

    if (options.cause != null) {
      this.cause = (options.cause instanceof Error)
        ? options.cause
        : new Error(String(options.cause as unknown))
    }

    if (options.error != null) {
      this.error = options.error
    }
  }
}
