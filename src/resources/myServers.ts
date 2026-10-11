import type { Currency, Pricing, ResponseData, Specs, Visibility } from '../types.ts'

export interface MyServersResponseData extends ResponseData {
  servers: MyServersServer[]
  limit: number
}

export interface MyServersServer {
  name: string
  connected: boolean
  visibility: Visibility
  pricing: Pricing
  online: boolean
  min_spot_pricing: Pricing
  init_token?: string
  specs: Specs
  allowed_currencies: Currency[]
  rented: boolean
  remaining_time: number
  rented_currency: Currency
  rented_price: number
  rental_state: string
  rented_gpus: number
  total_gpus: number
  rented_price_by_currency: Pricing
}
