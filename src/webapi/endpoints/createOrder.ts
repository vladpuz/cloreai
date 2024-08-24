import type { Currency } from '../../common/index.js'
import type { Output } from '../types.js'

/* Body */

export interface CreateOrderCommon {
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
}

export interface CreateOrderOnDemand extends CreateOrderCommon {
  type: 'on-demand'
}

export interface CreateOrderSpot extends CreateOrderCommon {
  type: 'spot'
  spotprice: number
}

export type CreateOrderBody = CreateOrderOnDemand | CreateOrderSpot

/* Output */

export interface CreateOrderOutput extends Output {

}
