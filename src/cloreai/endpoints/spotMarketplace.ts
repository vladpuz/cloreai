import type { Pricing, Visibility } from '../../common/index.js'
import type { Output } from '../types.js'

/* Params */

export interface SpotMarketplaceParams {
  market: number
}

/* Output */

export interface SpotMarketplaceMarketOffer {
  offer_id: number
  bid: number
  active: boolean
  my: boolean
}

export interface SpotMarketplaceMarketServer {
  min_pricing: Pricing
  mrl: number
  visibility: Visibility
  online: boolean
}

export interface SpotMarketplaceMarket {
  offers: SpotMarketplaceMarketOffer[]
  server: SpotMarketplaceMarketServer
}

export interface SpotMarketplaceOutput extends Output {
  market: SpotMarketplaceMarket
  exists: boolean
}
