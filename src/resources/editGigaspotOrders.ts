import type { GigaspotOverclock, ResponseData } from '../types.ts'

export type EditGigaspotOrdersRequestData = EditGigaspotOrdersOrder[]

export interface EditGigaspotOrdersOrder {
  order_id: number
  price: number
  oc: GigaspotOverclock[]
}

export interface EditGigaspotOrdersResponseData extends ResponseData {
  success_to_update_ids: number[]
  failed_to_update_ids: number[]
  too_low_bid_ids: number[]
}
