import type { Currency } from '../common.js'
import type { WebOutput } from '../output.js'

/* Body */

export interface WebCreateOrderCommon {
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
}

export interface WebCreateOrderOnDemand extends WebCreateOrderCommon {
  type: 'on-demand'
}

export interface WebCreateOrderSpot extends WebCreateOrderCommon {
  type: 'spot'
  spotprice: number
}

export type WebCreateOrderBody = WebCreateOrderOnDemand | WebCreateOrderSpot

/* Output */

export interface WebCreateOrderOutput extends WebOutput {

}
