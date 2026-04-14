import type { Currency, GigaspotOverclock, ResponseData } from '../types.ts'

export type CreateGigaspotOrdersRequestData = CreateGigaspotOrdersOrder[]

export interface CreateGigaspotOrdersOrder {
  currency: Currency
  image: string
  renting_server: number
  price: number
  oc: GigaspotOverclock[]
  env?: Record<string, string>
}

export interface CreateGigaspotOrdersResponseData extends ResponseData {
  failed_to_oc_servers: number[]
  failed_to_rent_servers: number[]
  too_low_bids_servers: number[]
}
