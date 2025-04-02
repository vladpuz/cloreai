import type { ResponseData } from '../types.js'

/* RequestData */

export interface CancelOrdersRequestData {
  order_ids: number[]
}

/* ResponseData */

export interface CancelOrdersResponseData extends ResponseData {
  failed_to_cancel: string[]
}
