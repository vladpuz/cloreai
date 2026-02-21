import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { QueueAddOptions } from 'p-queue'

export function getQueueOptions(
  priority: number,
  axios: AxiosInstance,
  config: AxiosRequestConfig = {},
): QueueAddOptions {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const signal = (
    config.signal ?? axios.defaults.signal
  ) as AbortSignal | undefined

  return {
    priority,
    signal,
  }
}
