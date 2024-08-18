import type { Price, Specs } from '../../common/index.js'
import type { Output } from '../types.js'

/* Output */

export interface MarketplaceServer {
  id: number
  owner: number
  mrl: number
  price: Price
  rented: boolean
  specs: Specs
}

export interface MarketplaceOutput extends Output {
  servers: MarketplaceServer[]
  my_servers: number[]
}
