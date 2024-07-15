import { type Price, type Specs } from '../common.js'
import { type Output } from '../output.js'

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
