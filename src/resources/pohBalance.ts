import type { ResponseData } from '../types.ts'

export interface PohBalanceResponseData extends ResponseData {
  items: PohBalanceItem[]
  balance: PohBalance
  count: number
}

export interface PohBalanceItem {
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

export interface PohBalance {
  total: number
  free_amount: number
  reward_amount: number
  offers: PohBalanceOffers
}

export interface PohBalanceOffers {
  rented_amount: number
  rented_on_marketplace_amount: number
  rented_finished_amount: number
  leased_amount: number
  leased_finished_amount: number
}
