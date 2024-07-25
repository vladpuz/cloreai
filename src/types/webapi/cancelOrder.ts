import type { WebOutput } from '../output.js'

/* Body */

export interface WebCancelOrderBody {
  id: number
  rating: number
}

/* Output */

export interface WebCancelOrderOutput extends WebOutput {

}
