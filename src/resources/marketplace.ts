import type { Currency, Price, Rating, ResponseData, Specs } from '../types.ts'

export interface MarketplaceResponseData extends ResponseData {
  servers: MarketplaceServer[]
}

export interface MarketplaceServer {
  id: number
  owner: number
  autoprice?: string
  mrl: number
  price: Price
  rented: boolean
  specs: Specs
  partial_gpu_rental: false | MarketplaceServerPartialGpuRental
  reliability: number
  allowed_coins: Currency[]
  rating: Rating
  gpu_array: string[]
  oc?: boolean
  cuda_version: string
}

export interface MarketplaceServerPartialGpuRental {
  total_gpus: number
  available_gpus: number
  free_indices: number[]
}
