import type { Pricing, Specs, Visibility } from '../../common/index.js'
import type { Output } from '../types.js'

/* Output */

export interface MyServersServer {
  name: string
  connected: boolean
  visibility: Visibility
  pricing: Pricing
  online: boolean
  min_spot_pricing: Pricing
  init_token: string
  specs: Specs
}

export interface MyServersOutput extends Output {
  servers: MyServersServer[]
  limit: number
}
