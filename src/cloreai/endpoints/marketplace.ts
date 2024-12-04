import type { MarketplaceResponseDataServerCommon } from '../../common/endpoints/marketplace.js'
import type { ResponseData } from '../types.js'

/* ResponseData */

export interface MarketplaceResponseData extends ResponseData {
  servers: MarketplaceResponseDataServerCommon[]
  my_servers: number[]
}
