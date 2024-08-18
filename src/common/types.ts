import type { AxiosError, CreateAxiosDefaults } from 'axios'

export type AxiosErrorParameters = ConstructorParameters<typeof AxiosError>

export interface CommonConfig {
  axiosConfig?: CreateAxiosDefaults
}

export interface CommonOutput<T = string> {
  error?: T | undefined
}
