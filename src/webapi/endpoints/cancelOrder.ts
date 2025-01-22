import type { CancelOrderRequestDataCommon } from '../../common/endpoints/cancelOrder.js'
import type { ResponseData } from '../types.js'

/* RequestData */

export interface CancelOrderRequestData extends CancelOrderRequestDataCommon {
  rating: number
}

/* ResponseData */

export type CancelOrderResponseData = ResponseData
