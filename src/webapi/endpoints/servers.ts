import type { Currency, Price, Specs } from '../../common/index.js'
import type { Output } from '../types.js'

/* Output */

export interface ServersServerRating {
  avg: number
  cnt: number
}

export interface ServersServer {
  id: number
  owner: number
  mrl: number
  price: Price
  rented: boolean
  specs: Specs
  reliability: number
  allowed_coins: Currency[]
  rating: ServersServerRating
  cuda_version: string
}

export interface ServersOutput extends Output {
  all_servers: ServersServer[]
  creation_fees: number
  disable_usd: number
  my_servers: number
  not_rented_available_servers: number
}
