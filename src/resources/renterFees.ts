import type { Pricing, ResponseData } from '../types.ts'

export interface RenterFeesPohConfig {
  max_reduction_percent: number
  max_poh_amount: number
}

export interface RenterFeesCreationFees {
  on_demand: Pricing
  spot: Pricing
}

export interface RenterFees {
  on_demand: RenterFee
  spot: RenterFee
}

export interface RenterFee {
  base: Pricing
}

export interface RenterFeesResponseData extends ResponseData {
  renter_fees: RenterFees
  poh_config: RenterFeesPohConfig
  creation_fees: RenterFeesCreationFees
  poh_balance: number
}
