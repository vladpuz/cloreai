import type { SetSpotPriceRequestDataCommon, SetSpotPriceResponseDataCommon } from '../../common/endpoints/setSpotPrice.js'
import type { ResponseData } from '../types.js'

/* RequestData */

export type SetSpotPriceRequestData = SetSpotPriceRequestDataCommon

/* ResponseData */

export type SetSpotPriceResponseData =
  & SetSpotPriceResponseDataCommon
  & ResponseData
