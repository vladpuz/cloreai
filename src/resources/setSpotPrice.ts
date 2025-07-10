/* RequestData */

import type { ResponseData } from '../types.js'

export interface SetSpotPriceRequestData {
  order_id: number
  desired_price: number
}

/* ResponseData */

export interface SetSpotPriceResponseDataMaxStep extends ResponseData {
  error: 'exceeded_max_step'
  max_step: number
}

export interface SetSpotPriceResponseDataTimeToLowering extends ResponseData {
  error: 'can_lower_every_600_seconds'
  time_to_lowering: number
}

export interface SetSpotPriceResponseDataNormal extends ResponseData {
  error: null
}

export type SetSpotPriceResponseData
  = | SetSpotPriceResponseDataMaxStep
    | SetSpotPriceResponseDataTimeToLowering
    | SetSpotPriceResponseDataNormal
