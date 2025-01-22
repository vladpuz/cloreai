import type { Pricing, Specs, Visibility } from '../../common/types.js'
import type { ResponseData } from '../types.js'

/* ResponseData */

export interface MyServersResponseDataServer {
  name: string
  connected: boolean
  visibility: Visibility
  pricing: Pricing
  online: boolean
  min_spot_pricing: Pricing
  init_token: string
  specs: Specs
}

export interface MyServersResponseData extends ResponseData {
  servers: MyServersResponseDataServer[]
  limit: number
}
