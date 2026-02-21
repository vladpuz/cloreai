import type { ResponseData } from '../types.ts'

export interface CancelOrderRequestData {
  id: number
  issue?: string
}

export type CancelOrderResponseData = ResponseData
