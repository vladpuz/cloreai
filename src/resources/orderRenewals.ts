import type { ResponseData } from '../types.ts'

export interface OrderRenewalsRequestData {
  order_id: number
}

export interface OrderRenewalsResponseData extends ResponseData {
  renewals: OrderRenewal
}

export interface OrderRenewal {
  order_id: number
  renewal_no: number
  outcome: string
  reason: string
  decided_at: number
  applied_at: number
  old_price: number
  new_price: number
  cap: number
  term_seconds: number
  term_start: number
  term_end: number
}
