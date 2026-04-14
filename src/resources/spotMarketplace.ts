import type { Currency, Pricing, ResponseData, Visibility } from '../types.ts'

export interface SpotMarketplaceRequestParams {
  market: number
}

export interface SpotMarketplaceResponseData extends ResponseData {
  market: SpotMarketplaceMarket
  exists: boolean
}

export interface SpotMarketplaceMarket {
  currency_rates_in_usd: Pricing
  offers: SpotMarketplaceMarketOffer[]
  server: SpotMarketplaceMarketServer
}

export interface SpotMarketplaceMarketOffer {
  offer_id: number
  bid: number
  active: boolean
  my: boolean
  currency: Currency
}

export interface SpotMarketplaceMarketServer {
  min_pricing: Pricing
  mrl: number
  online: boolean
  visibility: Visibility
}
