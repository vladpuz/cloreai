import type { Currency, Price, Specs } from '../../common/index.js'
import type { Output } from '../types.js'

/* Body */

export interface OrdersBody {
  rc: boolean
}

/* Output */

export interface OrdersOrder {
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
  mon_container: number
  online: boolean
  spot: boolean
  pub_cluster: string[]
  tcp_ports: string[]
  http_port: string
}

export interface OrdersOutput extends Output {
  orders: OrdersOrder[]
  ol: number
  eo: boolean
  http_endpoint_by_proxy: Record<string, string>
  PoH_rates: Record<string, Record<string, Price>>
  PoH_active: boolean
  allowed_features: string[]
}
