import type { CreateAxiosDefaults } from 'axios'
import type { Options, Queue, QueueAddOptions } from 'p-queue'

export type PQueueOptions = Options<
  Queue<() => Promise<unknown>, QueueAddOptions>,
  QueueAddOptions
>

export interface CommonConfig {
  axiosConfig?: CreateAxiosDefaults
  rateLimitQueueOptions?: PQueueOptions
  rateLimitQueueOptionsCreateOrder?: PQueueOptions
}

export interface CommonResponseData {
  error?: string
}

export type OrderType = 'on-demand' | 'spot'
export type Visibility = 'public' | 'hidden'
export type Currency = 'CLORE-Blockchain' | 'bitcoin'

export interface Pricing {
  'CLORE-Blockchain': number
  'bitcoin': number
  'usd'?: number
}

export interface PricingInUSD {
  on_demand_btc: number
  on_demand_clore: number
  spot: number
}

export interface Price {
  on_demand: Pricing
  spot: Pricing
  usd?: PricingInUSD
}

export interface Net {
  cc: string
  down: number
  up: number
  test_history: string[]
}

export interface Overclock {
  model: string
  core_offset: number | null
  mem_offset: number | null
  core_lock: number | null
  mem_lock: number | null
}

export interface Specs {
  backend_version: number
  cpu: string
  cpus: string
  disk: string
  disk_speed: number
  gpu: string
  gpuram: number
  mb: string
  net: Net
  pcie_rev: number
  pcie_width: number
  pl: number[]
  ram: number
  stock_oc: Overclock[] | 'default'
  stock_oc_override: boolean
  stock_pl: number[]
  xfs: number
}
