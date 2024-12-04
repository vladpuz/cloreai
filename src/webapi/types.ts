import type { CommonConfig, CommonResponseData } from '../common/types.js'

export interface Config extends CommonConfig {
  token: string
}

export interface ResponseData extends CommonResponseData {
  status: string
}
