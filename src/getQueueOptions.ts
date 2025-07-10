import type { AxiosRequestConfig } from 'axios'
import type { QueueAddOptions } from 'p-queue'

export function getQueueOptions(
  priority: number,
  config?: AxiosRequestConfig,
): QueueAddOptions & { throwOnTimeout: true } {
  const defaultQueueOptions: QueueAddOptions & { throwOnTimeout: true } = {
    throwOnTimeout: true,
    priority,
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const signal = config?.signal as AbortSignal | undefined

  if (signal == null) {
    return defaultQueueOptions
  }

  return {
    ...defaultQueueOptions,
    signal,
  }
}
