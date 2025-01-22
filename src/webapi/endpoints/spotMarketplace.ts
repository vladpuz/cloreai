import type { SpotMarketplaceResponseDataCommon } from '../../common/endpoints/spotMarketplace.js'
import type { ResponseData } from '../types.js'

/* RequestData */

export interface SpotMarketplaceRequestData {
  id: number
}

/* ResponseData */

export interface SpotMarketplaceResponseData extends ResponseData {
  data: SpotMarketplaceResponseDataCommon
}
