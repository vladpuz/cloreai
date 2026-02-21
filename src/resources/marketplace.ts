import type { Currency, Price, Rating, ResponseData, Specs } from '../types.ts'

export interface MarketplaceServer {
  id: number
  owner: number
  autoprice?: string
  mrl: number
  price: Price
  rented: boolean
  specs: Specs
  reliability: number
  allowed_coins: Currency[]
  rating: Rating
  gpu_array: string[]
  gigaspot?: boolean
  oc?: boolean
  cuda_version: string
}

export interface MarketplaceResponseData extends ResponseData {
  servers: MarketplaceServer[]
}
