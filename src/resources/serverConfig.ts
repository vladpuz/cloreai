import type { AutoPrice, Currency, Pricing, PricingInOriginalUsd, ResponseData, Specs, Visibility } from '../types.ts'

export interface ServerConfigRequestData {
  server_name: string
}

export interface ServerConfigBackgroundJob {
  times_updated: number
  image: string
  command: string
  env: Record<string, string>
}

export interface ServerConfig {
  name: string
  connected: boolean
  visibility: Visibility
  pricing: Pricing
  spot_pricing: Pricing
  mrl: number
  online: boolean
  initialized: boolean
  id: number
  rental_status: number
  specs: Specs
  background_job: ServerConfigBackgroundJob
  allowed_coins: Currency[]
  autoprice: AutoPrice
  usd_pricing: PricingInOriginalUsd
}

export interface ServerConfigResponseData extends ResponseData {
  config: ServerConfig
  creation_completed: boolean
}
