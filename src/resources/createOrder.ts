import type { Currency, OrderType, ResponseData } from '../types.ts'

export interface CreateOrderRequestData {
  currency: Currency
  image: string
  renting_server: number
  type: OrderType
  spotprice?: number
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
  gpu_count?: number
  gpu_indices?: number[]
  rental_hours?: number
  auto_renew?: boolean
  auto_renew_max_price?: number
}

export type CreateOrderResponseData = ResponseData
