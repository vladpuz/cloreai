import type { ResponseData } from '../types.js'

/* RequestData */

export interface SetServerSettingsRequestData {
  name: string
  availability: boolean
  mrl: number
  on_demand: number
  spot: number
}

/* ResponseData */

export type SetServerSettingsResponseData = ResponseData
