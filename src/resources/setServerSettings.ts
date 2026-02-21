import type { AutoPrice, PricingInOriginalUsd, ResponseData } from '../types.ts'

export interface SetServerSettingsRequestData {
  'name': string
  'availability': boolean
  'mrl': number
  'bitcoin_on_demand': number
  'bitcoin_spot': number
  'CLORE-Blockchain_on_demand'?: number
  'CLORE-Blockchain_spot'?: number
  'USD-Blockchain_on_demand'?: number
  'USD-Blockchain_spot'?: number
  'enabled-USD-Blockchain'?: boolean
  'enabled-CLORE-Blockchain'?: boolean
  'enabled-bitcoin'?: boolean
  'autoprice'?: AutoPrice
  'usd_pricing'?: PricingInOriginalUsd
}

export type SetServerSettingsResponseData = ResponseData
