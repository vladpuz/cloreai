import type { ResponseData } from '../types.js'

/* ResponseData */

export interface PohBalanceResponseDataBalanceOffers {
  rented_amount: number
  rented_on_marketplace_amount: number
  rented_finished_amount: number
  leased_amount: number
  leased_finished_amount: number
}

export interface PohBalanceResponseDataBalance {
  total: number
  free_amount: number
  reward_amount: number
  offers: PohBalanceResponseDataBalanceOffers
}

export interface PohBalanceResponseDataItem {
  user: number
  address: string
  signature: string
  message: string
  created: number
  unique: string
  remove: number
  status: string
  balance: number
  last_check: number
}

export interface PohBalanceResponseData extends ResponseData {
  items: PohBalanceResponseDataItem[]
  balance: PohBalanceResponseDataBalance
  count: number
}
