import type { Currency, ResponseData } from '../types.ts'

export interface Wallet {
  name: Currency
  deposit: string
  balance: number
  withdrawal_fee: number
}

export interface WalletsResponseData extends ResponseData {
  wallets: Wallet[]
}
