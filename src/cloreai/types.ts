import type { CommonConfig, CommonResponseData } from '../common/types.js'

export interface Config extends CommonConfig {
  apiKey: string
}

export interface ResponseData extends CommonResponseData {
  code: number
}
