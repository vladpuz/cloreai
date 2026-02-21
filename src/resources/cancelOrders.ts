import type { ResponseData } from '../types.ts'

export interface CancelOrdersRequestData {
  order_ids: number[]
}

export interface CancelOrdersResponseData extends ResponseData {
  failed_to_cancel: string[]
}
