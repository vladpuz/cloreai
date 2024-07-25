import type { Output } from '../output.js'

/* Body */

export interface CancelOrderBody {
  id: number
  issue?: string
}

/* Output */

export interface CancelOrderOutput extends Output {

}
