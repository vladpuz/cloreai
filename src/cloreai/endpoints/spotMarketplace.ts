import type { SpotMarketplaceResponseDataCommon } from '../../common/endpoints/spotMarketplace.js'
import type { ResponseData } from '../types.js'

/* RequestParams */

export interface SpotMarketplaceRequestParams {
  market: number
}

/* ResponseData */

export interface SpotMarketplaceResponseData extends ResponseData {
  market: SpotMarketplaceResponseDataCommon
  exists: boolean
}
