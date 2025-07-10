import type { ResponseData } from '../types.js'

/* RequestData */

export interface EditGigaspotOrdersRequestDataOrderOverclock {
  pl: number
  core_offset?: number
  mem_offset?: number
  core_lock?: number
  mem_lock?: number
}

export interface EditGigaspotOrdersRequestDataOrder {
  order_id: number
  price: number
  oc: EditGigaspotOrdersRequestDataOrderOverclock[]
}

export type EditGigaspotOrdersRequestData
    = EditGigaspotOrdersRequestDataOrder[]

/* ResponseData */

export interface EditGigaspotOrdersResponseData extends ResponseData {
  success_to_update_ids: number[]
  failed_to_update_ids: number[]
  too_low_bid_ids: number[]
}
