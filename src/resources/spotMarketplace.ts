import type { Currency, Pricing, ResponseData, Visibility } from '../types.js'

/* RequestParams */

export interface SpotMarketplaceRequestParams {
  market: number
}

/* ResponseData */

export interface SpotMarketplaceResponseDataOffer {
  active: boolean
  bid: number
  currency: Currency
  my: boolean
  offer_id: number
}

export interface SpotMarketplaceResponseDataServer {
  min_pricing: Pricing
  mrl: number
  online: boolean
  visibility: Visibility
}

export interface SpotMarketplaceResponseDataMarket {
  currency_rates_in_usd: Pricing
  offers: SpotMarketplaceResponseDataOffer[]
  server: SpotMarketplaceResponseDataServer
}

export interface SpotMarketplaceResponseData extends ResponseData {
  market: SpotMarketplaceResponseDataMarket
  exists: boolean
}
