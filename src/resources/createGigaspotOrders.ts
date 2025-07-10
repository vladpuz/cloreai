import type { Currency, ResponseData } from '../types.js'

/* RequestData */

export interface CreateGigaspotOrdersRequestDataOrderOverclock {
  pl: number
  core_offset?: number
  mem_offset?: number
  core_lock?: number
  mem_lock?: number
}

export interface CreateGigaspotOrdersRequestDataOrder {
  currency: Currency
  image: string
  renting_server: number
  price: number
  oc: CreateGigaspotOrdersRequestDataOrderOverclock[]
  env?: Record<string, string>
}

export type CreateGigaspotOrdersRequestData
    = CreateGigaspotOrdersRequestDataOrder[]

/* ResponseData */

export interface CreateGigaspotOrdersResponseData extends ResponseData {
  failed_to_oc_servers: number[]
  failed_to_rent_servers: number[]
  too_low_bids_servers: number[]
}
