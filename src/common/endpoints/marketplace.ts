import type { Currency, Price, Specs } from '../types.js'

/* ResponseData */

export interface MarketplaceResponseDataServerRatingCommon {
  avg: number
  cnt: number
}

export interface MarketplaceResponseDataServerCommon {
  allowed_coins: Currency[]
  cuda_version: string
  gpu_array: string[]
  id: number
  mrl: number
  oc: boolean
  owner: number
  price: Price
  rating: MarketplaceResponseDataServerRatingCommon
  reliability: number
  rented: boolean
  specs: Specs
}
