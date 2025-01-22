import type { CancelOrderRequestDataCommon } from '../../common/endpoints/cancelOrder.js'
import type { ResponseData } from '../types.js'

/* RequestData */

export interface CancelOrderRequestData extends CancelOrderRequestDataCommon {
  issue?: string
}

/* ResponseData */

export type CancelOrderResponseData = ResponseData
