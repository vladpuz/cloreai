import type { AutoPrice, Currency, Pricing, PricingInOriginalUsd, ResponseData, Specs, Visibility } from '../types.ts'

export interface ServerConfigRequestData {
  server_name: string
}

export interface ServerConfigResponseData extends ResponseData {
  config: ServerConfig
  creation_completed: boolean
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
  partial_rental_enabled: boolean
  specs: Specs
  background_job: ServerConfigBackgroundJob
  init_communication_token: string
  allowed_coins: Currency[]
  autoprice: AutoPrice
  usd_pricing: PricingInOriginalUsd
  remaining_time: number
  rental_state: string
  rented_gpus: number
  total_gpus: number
  update_channel: string
  requested_channel: string
  target_backend_version: number
  driver: ServerConfigDriver
  rented_price_by_currency: Pricing
  tenants: ServerConfigTenant[]
}

export interface ServerConfigBackgroundJob {
  times_updated: number
  image: string
  command: string
  env: Record<string, string>
}

export interface ServerConfigDriver {
  version: string
  status: string
  latest: string
}

export interface ServerConfigTenant {
  rental_type: string
  currency: Currency
  price: number
  remaining_time: number
  gpu_count: number
}
