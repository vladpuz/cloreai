import type { Pricing, Specs, Visibility } from '../../common/index.js'
import type { Output } from '../types.js'

/* Body */

export interface ServerConfigBody {
  server_name: string
}

/* Output */

export interface ServerConfigConfigBackgroundJob {
  times_updated: number
  image: string
  command: string
  env: Record<string, string>
}

export interface ServerConfigConfig {
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
  background_job: ServerConfigConfigBackgroundJob
}

export interface ServerConfigOutput extends Output {
  config: ServerConfigConfig
  creation_completed: boolean
}
