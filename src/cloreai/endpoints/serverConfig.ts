import type { Pricing, Specs, Visibility } from '../../common/types.js'
import type { ResponseData } from '../types.js'

/* RequestData */

export interface ServerConfigRequestData {
  server_name: string
}

/* ResponseData */

export interface ServerConfigResponseDataConfigBackgroundJob {
  times_updated: number
  image: string
  command: string
  env: Record<string, string>
}

export interface ServerConfigResponseDataConfig {
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
  background_job: ServerConfigResponseDataConfigBackgroundJob
}

export interface ServerConfigResponseData extends ResponseData {
  config: ServerConfigResponseDataConfig
  creation_completed: boolean
}
