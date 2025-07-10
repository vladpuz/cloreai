import type { CreateAxiosDefaults } from 'axios'
import type { Options as PQueueOptions, Queue, QueueAddOptions } from 'p-queue'

export type QueueOptions = PQueueOptions<
  Queue<() => Promise<unknown>, QueueAddOptions>,
  QueueAddOptions
>

export interface Options {
  axiosOptions?: CreateAxiosDefaults
  queueOptions?: QueueOptions
  queueOptionsCreateOrder?: QueueOptions
  queueOptionsGigaspot?: QueueOptions
}

export interface ResponseData {
  code: number
  error?: string | null
}

export type OrderType = 'on-demand' | 'spot'
export type Visibility = 'public' | 'hidden'
export type Currency = 'CLORE-Blockchain' | 'bitcoin'

export interface Pricing {
  'CLORE-Blockchain': number
  'bitcoin': number
  'usd'?: number
}

export interface PricingInUsd {
  on_demand_btc: number
  on_demand_clore: number
  spot: number
}

export interface PricingInOriginalUsd {
  on_demand: number
  spot: number
}

export interface Price {
  on_demand: Pricing
  spot: Pricing
  usd?: PricingInUsd
  original_usd?: PricingInOriginalUsd
}

export interface Net {
  cc: string
  down: number
  up: number
  test_history: string[]
}

export interface Gpu {
  type: string
  mem: number
  pcie_gen: number
  pcie_width: number
}

export interface Overclock {
  model: string
  core_offset: number | null
  mem_offset: number | null
  core_lock: number | null
  mem_lock: number | null
}

export interface Specs {
  mb: string
  cpu: string
  cpus: string
  ram: number
  gpu: string
  gpuram: number
  disk: string
  disk_speed: number
  net: Net
  backend_version: number
  pcie_rev: number
  pcie_width: number
  xfs?: number
  stock_oc_override?: boolean
  pl: number[]
  gpus?: Gpu[]
  stock_pl: number[]
  stock_oc: Overclock[] | 'default'
}

export interface Rating {
  avg: number
  cnt: number
}
