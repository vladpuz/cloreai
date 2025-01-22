import type { MarketplaceResponseDataServerCommon } from '../../common/endpoints/marketplace.js'
import type { Price } from '../../common/types.js'
import type { ResponseData } from '../types.js'

/* ResponseData */

export interface MarketplaceResponseData extends ResponseData {
  all_servers: MarketplaceResponseDataServerCommon[]
  creation_fees: Price
  disable_usd: boolean
  my_servers: MarketplaceResponseDataServerCommon[]
  not_rented_available_servers: MarketplaceResponseDataServerCommon[]
}
