import type { Output } from '../types.js'

/* Body */

export interface SetServerSettingsBody {
  name: string
  availability: boolean
  mrl: number
  on_demand: number
  spot: number
}

/* Output */

export interface SetServerSettingsOutput extends Output {

}
