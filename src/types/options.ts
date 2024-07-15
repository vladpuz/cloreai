import { type CreateAxiosDefaults } from 'axios'

export interface CommonOptions {
  axiosConfig?: CreateAxiosDefaults
}

export interface Options extends CommonOptions {
  apiKey: string
}

export interface WebOptions extends CommonOptions {
  token: string
}
