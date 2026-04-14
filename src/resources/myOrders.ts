import type { Currency, Rating, ResponseData, Specs } from '../types.ts'

export interface MyOrdersRequestParams {
  return_completed?: boolean
}

export interface MyOrdersResponseData extends ResponseData {
  orders: MyOrdersOrder[]
  limit: number
}

export interface MyOrdersOrder {
  id: number
  creation_fee: number
  price: number
  mrl: number
  image: string
  currency: Currency
  original_price_usd?: number
  spend: number
  ct: number
  specs: Specs
  si: number
  my_past_rating?: number
  auto_login: string
  mon_container: number
  online: boolean
  pub_cluster: string[]
  tcp_ports: string[]
  http_port: string
  http_pub: string
  rating: Rating
  reliability: number
  owner: number
  cuda_version: string
  gpu_array: string[]
  spot?: boolean
  expired?: boolean
}
