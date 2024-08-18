import type { Output } from '../types.js'

/* Body */

export interface SetSpotPriceBody {
  order_id: number
  desired_price: number
}

/* Output */

export interface SetSpotPriceMaxStep extends Output {
  error: 'exceeded_max_step'
  max_step: number
}

export interface SetSpotPriceTimeToLowering extends Output {
  error: 'can_lower_every_600_seconds'
  time_to_lowering: number
}

export interface SetSpotPriceSuccess extends Output {
  error: undefined
}

export type SetSpotPriceOutput =
  | SetSpotPriceMaxStep
  | SetSpotPriceTimeToLowering
  | SetSpotPriceSuccess
