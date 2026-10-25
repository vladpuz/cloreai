import type { ResponseData } from '../types.ts'

export interface SetSpotPriceRequestData {
  order_id: number
  desired_price: number
}

export type SetSpotPriceResponseData = ResponseData
