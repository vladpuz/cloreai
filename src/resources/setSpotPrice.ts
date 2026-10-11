import type { ResponseData } from '../types.ts'

export interface SetSpotPriceRequestData {
  order_id: number
  desired_price: number
}

export interface SetSpotPriceResponseData extends ResponseData {
  max_step?: number
  time_to_lowering?: number
  min_price?: number
}
