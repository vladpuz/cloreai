import type { MyOrdersResponseDataOrderCommon } from '../../common/endpoints/myOrders.js'
import type { ResponseData } from '../types.js'

/* RequestParams */

export interface MyOrdersRequestParams {
  return_completed?: boolean
}

/* ResponseData */

export interface MyOrdersResponseData extends ResponseData {
  orders: MyOrdersResponseDataOrderCommon[]
  limit: number
}
