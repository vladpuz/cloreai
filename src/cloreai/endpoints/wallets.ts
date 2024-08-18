import type { Currency } from '../../common/index.js'
import type { Output } from '../types.js'

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
