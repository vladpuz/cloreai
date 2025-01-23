import type { Currency, Price, ResponseData, Specs } from '../types.js'

/* ResponseData */

export interface MarketplaceResponseDataServerRating {
  avg: number
  cnt: number
}

export interface MarketplaceResponseDataServer {
  allowed_coins: Currency[]
  cuda_version: string
  gigaspot: boolean
  gpu_array: string[]
  id: number
  mrl: number
  oc: boolean
  owner: number
  price: Price
  rating: MarketplaceResponseDataServerRating
  reliability: number
  rented: boolean
  specs: Specs
}

export interface MarketplaceResponseData extends ResponseData {
  servers: MarketplaceResponseDataServer[]
  my_servers: number[]
}
