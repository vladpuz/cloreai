import type { Currency, Pricing, Visibility } from '../common.js'
import type { WebOutput } from '../output.js'

/* Body */

export interface WebGetSpotBody {
  id: number
}

/* Output */

export interface WebGetSpotDataOffer {
  offer_id: number
  bid: number
  active: boolean
  my: boolean
  currency: Currency
}

export interface WebGetSpotDataServer {
  min_pricing: Pricing
  mrl: number
  visibility: Visibility
  online: boolean
}

export interface WebGetSpotData {
  currency_rates_in_usd: Pricing
  offers: WebGetSpotDataOffer[]
  server: WebGetSpotDataServer
}

export interface WebGetSpotOutput extends WebOutput {
  data: WebGetSpotData
}
