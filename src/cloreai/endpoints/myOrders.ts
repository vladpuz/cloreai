import type { Currency, Specs } from '../../common/index.js'
import type { Output } from '../types.js'

/* Params */

export interface MyOrdersParams {
  return_completed?: boolean
}

/* Output */

export interface MyOrdersOrder {
  id: number
  fee: number
  creation_fee: number
  price: number
  mrl: number
  image: string
  currency: Currency
  spend: number
  ct: number
  p: number
  specs: Specs
  si: number
  pub_cluster: string[]
  tcp_ports: string[]
  http_port: string
  spot: boolean
  expired: boolean
}

export interface MyOrdersOutput extends Output {
  orders: MyOrdersOrder[]
  limit: number
}
