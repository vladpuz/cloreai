import type { Currency, Price, Specs } from '../common.js'
import type { WebOutput } from '../output.js'

/* Output */

export interface WebServersServerRating {
  avg: number
  cnt: number
}

export interface WebServersServer {
  id: number
  owner: number
  mrl: number
  price: Price
  rented: boolean
  specs: Specs
  reliability: number
  allowed_coins: Currency[]
  rating: WebServersServerRating
  cuda_version: string
}

export interface WebServersOutput extends WebOutput {
  all_servers: WebServersServer[]
  creation_fees: number
  disable_usd: number
  my_servers: number
  not_rented_available_servers: number
}
