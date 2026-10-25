import type { ResponseData } from '../types.ts'

export interface SetOrderAutoRenewRequestData {
  order_id: number
  rental_hours?: number | null
  auto_renew?: boolean
  auto_renew_max_price?: number
}

export type SetOrderAutoRenewResponseData = ResponseData
