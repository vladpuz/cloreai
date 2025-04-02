import type { Currency, Price, ResponseData, Specs } from '../types.js'

/* ResponseData */

export interface MarketplaceResponseDataServerRating {
  avg: number
  cnt: number
}

export interface MarketplaceResponseDataServer {
  id: number
  owner: number
  mrl: number
  price: Price
  rented: boolean
  specs: Specs
  reliability: number
  allowed_coins: Currency[]
  rating: MarketplaceResponseDataServerRating
  gpu_array: string[]
  gigaspot: boolean
  oc?: boolean
  cuda_version: string
}

export interface MarketplaceResponseData extends ResponseData {
  servers: MarketplaceResponseDataServer[]
  my_servers: number[]
}
