import type { MyOrdersResponseDataOrderCommon } from '../../common/endpoints/myOrders.js'
import type { Currency, Price } from '../../common/types.js'
import type { ResponseData } from '../types.js'

/* RequestData */

export interface MyOrdersRequestData {
  rc: boolean
}

/* ResponseData */

export interface MyOrdersResponseData extends ResponseData {
  PoH_active: boolean
  PoH_rates: Record<Currency, Record<string, Price>>
  allowed_features: string[]
  eo: boolean
  http_endpoint_by_proxy: Record<string, string>
  ol: number
  orders: MyOrdersResponseDataOrderCommon[]
}
