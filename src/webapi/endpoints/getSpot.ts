import type { Currency, Pricing, Visibility } from '../../common/index.js'
import type { Output } from '../types.js'

/* Body */

export interface GetSpotBody {
  id: number
}

/* Output */

export interface GetSpotDataOffer {
  offer_id: number
  bid: number
  active: boolean
  my: boolean
  currency: Currency
}

export interface GetSpotDataServer {
  min_pricing: Pricing
  mrl: number
  visibility: Visibility
  online: boolean
}

export interface GetSpotData {
  currency_rates_in_usd: Pricing
  offers: GetSpotDataOffer[]
  server: GetSpotDataServer
}

export interface GetSpotOutput extends Output {
  data: GetSpotData
}
