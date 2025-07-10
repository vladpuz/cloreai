import type { ResponseData } from '../types.js'

/* RequestData */

export interface CancelOrderRequestData {
  id: number
  issue?: string
}

/* ResponseData */

export type CancelOrderResponseData = ResponseData
