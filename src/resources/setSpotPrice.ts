import type { ResponseData } from '../types.ts'

export interface SetSpotPriceRequestData {
  order_id: number
  desired_price: number
}

export type SetSpotPriceResponseData
  = | SetSpotPriceMaxStep
    | SetSpotPriceTimeToLowering
    | SetSpotPriceNormal

export interface SetSpotPriceMaxStep extends ResponseData {
  error: 'exceeded_max_step'
  max_step: number
}

export interface SetSpotPriceTimeToLowering extends ResponseData {
  error: 'can_lower_every_600_seconds'
  time_to_lowering: number
}

export type SetSpotPriceNormal = Omit<ResponseData, 'error'>
