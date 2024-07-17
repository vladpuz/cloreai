import { type WebOutput } from '../output.js'

/* Body */

export interface WebSetSpotPriceBody {
  desired_price: number
  order_id: number
}

/* Output */

export interface WebSetSpotPriceMaxStep extends WebOutput {
  error: 'exceeded_max_step'
  max_step: number
}

export interface WebSetSpotPriceTimeToLowering extends WebOutput {
  error: 'can_lower_every_600_seconds'
  time_to_lowering: number
}

export interface WebSetSpotPriceSuccess extends WebOutput {
  error: undefined
}

export type WebSetSpotPriceOutput = WebSetSpotPriceMaxStep | WebSetSpotPriceTimeToLowering | WebSetSpotPriceSuccess
