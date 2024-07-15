import { type Currency, type Price, type Specs } from '../common.js'
import { type WebOutput } from '../output.js'

/* Output */

export interface WebMarketplaceServersServerRating {
  avg: number
  cnt: number
}

export interface WebMarketplaceServersServer {
  id: number
  owner: number
  mrl: number
  price: Price
  rented: boolean
  specs: Specs
  reliability: number
  allowed_coins: Currency[]
  rating: WebMarketplaceServersServerRating
  cuda_version: string
}

export interface WebMarketplaceServersOutput extends WebOutput {
  all_servers: WebMarketplaceServersServer[]
  creation_fees: number
  disable_usd: number
  my_servers: number
  not_rented_available_servers: number
}
