import type { Pricing, ResponseData } from '../types.ts'

export interface RenterFeesResponseData extends ResponseData {
  renter_fees: RenterFees
  poh_config: RenterFeesPohConfig
  creation_fees: RenterFeesCreationFees
  creation_fee_delay_minutes: number
  minimal_balance_when_creating_order: RenterFeesMinimalBalance
  terminate_order_when_customer_has_less_balance_than_for_minutes: number
  poh_balance: number
}

export interface RenterFees {
  on_demand: RenterFee
  spot: RenterFee
}

export interface RenterFee {
  base: Pricing
  extra: Pricing
}

export interface RenterFeesPohConfig {
  max_reduction_percent: number
  max_poh_amount: number
}

export interface RenterFeesCreationFees {
  on_demand: Pricing
  spot: Pricing
}

export interface RenterFeesMinimalBalance {
  on_demand: Pricing
  spot: Pricing
}
