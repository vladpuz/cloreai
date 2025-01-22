import type { Currency, Specs } from '../types.js'

/* ResponseData */

export interface MyOrdersResponseDataOrderCommon {
  auto_login: string
  id: number
  fee: number
  creation_fee: number
  price: number
  mrl: number
  online: boolean
  image: string
  mon_container: number
  currency: Currency
  spend: number
  ct: number
  p: number
  specs: Specs
  si: number
  spot: boolean
  expired: boolean
  pub_cluster: string[]
  tcp_ports: string[]
  http_port: string
}
