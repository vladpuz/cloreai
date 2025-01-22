import type { Currency, ResponseData } from '../types.js'

/* ResponseData */

export interface WalletsResponseDataWallet {
  name: Currency
  deposit: string
  balance: number
  withdrawal_fee: number
}

export interface WalletsResponseData extends ResponseData {
  wallets: WalletsResponseDataWallet[]
}
