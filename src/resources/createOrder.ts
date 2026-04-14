import type { Currency, OrderType, ResponseData } from '../types.ts'

export type CreateOrderRequestData = CreateOrderOnDemand | CreateOrderSpot

export interface CreateOrderOnDemand extends CreateOrderBase {
  type: 'on-demand'
}

export interface CreateOrderSpot extends CreateOrderBase {
  type: 'spot'
  spotprice: number
}

export interface CreateOrderBase {
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

export type CreateOrderResponseData = ResponseData
