import type { AxiosRequestConfig } from 'axios'
import type { QueueAddOptions } from 'p-queue'

export const statusCodes = {
  NORMAL: 0,
  DATABASE_ERROR: 1,
  INVALID_INPUT_DATA: 2,
  INVALID_API_TOKEN: 3,
  INVALID_ENDPOINT: 4,
  EXCEEDED: 5,
  OTHER: 6,
}

export const priorityLevels = {
  NORMAL: 0,
  HIGH: 1,
  HIGHEST: 2,
}

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
