import type { ResponseData } from '../types.js'

/* RequestData */

export interface SetServerSettingsRequestData {
  'name': string
  'availability': boolean
  'mrl': number
  'on_demand': number
  'spot': number
  'CLORE-Blockchain_on_demand': number
  'CLORE-Blockchain_spot': number
}

/* ResponseData */

export type SetServerSettingsResponseData = ResponseData
