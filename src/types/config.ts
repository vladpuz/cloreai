import { type CreateAxiosDefaults } from 'axios'

export interface CommonConfig {
  axiosConfig?: CreateAxiosDefaults
}

export interface Config extends CommonConfig {
  apiKey: string
}

export interface WebConfig extends CommonConfig {
  token: string
}
