import type { Currency } from '../common.js'
import type { Output } from '../output.js'

/* Output */

export interface WalletsWallet {
  name: Currency
  deposit: string
  balance: number
  withdrawal_fee: number
}

export interface WalletsOutput extends Output {
  wallets: WalletsWallet[]
}
