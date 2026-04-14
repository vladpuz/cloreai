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
  allowed_currencies: Currency[]
  init_token?: string
  specs?: Specs
}
