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
  oc_price: number
  original_price_usd?: number
  mrl: number
  image: string
  currency: Currency
  spend: number
  ct: number
  p: number
  specs: Specs
  gpu_count: number
  total_gpus: number
  gpu_array: string[]
  si: number
  my_past_rating?: number
  auto_login: string
  mon_container: number
  pub_cluster: string[]
  tcp_ports: string[]
  http_port: string
  http_pub: string
  rating: Rating
  reliability: number
  owner: number
  cuda_version: string
  spot?: boolean
  expired?: boolean
  paused?: boolean
  online: boolean
}
