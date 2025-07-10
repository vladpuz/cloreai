import type { Currency, OrderType, ResponseData } from '../types.js'

/* RequestData */

export interface CreateOrderRequestDataBase {
  type: OrderType
  currency: Currency
  image: string
  renting_server: number
  ports?: Record<string, string>
  env?: Record<string, string>
  jupyter_token?: string
  ssh_key?: string
  ssh_password?: string
  command?: string
  required_price?: number
  autossh_entrypoint?: boolean
  remember_password?: boolean
  dockerhub_auth?: string
}

export interface CreateOrderRequestDataOnDemand
  extends CreateOrderRequestDataBase {
  type: 'on-demand'
}

export interface CreateOrderRequestDataSpot
  extends CreateOrderRequestDataBase {
  type: 'spot'
  spotprice: number
}

export type CreateOrderRequestData
  = | CreateOrderRequestDataOnDemand
    | CreateOrderRequestDataSpot

/* ResponseData */

export type CreateOrderResponseData = ResponseData
