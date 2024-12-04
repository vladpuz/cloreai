import type { Currency, Pricing, Visibility } from '../../common/types.js'

/* ResponseData */

export interface SpotMarketplaceResponseDataOfferCommon {
  active: boolean
  bid: number
  currency: Currency
  my: boolean
  offer_id: number
}

export interface SpotMarketplaceResponseDataServerCommon {
  min_pricing: Pricing
  mrl: number
  online: boolean
  visibility: Visibility
}

export interface SpotMarketplaceResponseDataCommon {
  currency_rates_in_usd: Pricing
  offers: SpotMarketplaceResponseDataOfferCommon[]
  server: SpotMarketplaceResponseDataServerCommon
}
