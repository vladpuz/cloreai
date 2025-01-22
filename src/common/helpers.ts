import type { AxiosRequestConfig } from 'axios'
import type { QueueAddOptions } from 'p-queue'

export function getErrorMessage(
  statusCode?: number | string,
  errorField?: string,
): string {
  const messages: string[] = []

  if (statusCode != null) {
    messages.push(`Status code "${statusCode}".`)
  }

  if (errorField != null) {
    messages.push(`Error field "${errorField}".`)
  }

  return messages.join(' ')
}

export function getQueueOptions(
  priority: number,
  config?: AxiosRequestConfig,
): QueueAddOptions & { throwOnTimeout: true } {
  const defaultQueueOptions: QueueAddOptions & { throwOnTimeout: true } = {
    throwOnTimeout: true,
    priority,
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- GenericAbortSignal
  const signal = config?.signal as AbortSignal | undefined

  if (signal == null) {
    return defaultQueueOptions
  }

  return {
    ...defaultQueueOptions,
    signal,
  }
}
