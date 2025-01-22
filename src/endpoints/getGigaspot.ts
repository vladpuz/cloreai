import type { Currency, Pricing, ResponseData } from '../types.js'

/* ResponseData */

export interface GetGigaspotResponseDataSnapshotServerBid {
  owner: number
  id: number
  active: boolean
  to_cache: boolean
  cached: boolean
  price: number
  currency: Currency
  pl: number
}

export interface GetGigaspotResponseDataSnapshotServerGpu {
  pl: [number, number]
  mem_lock: [number, number]
  core_lock: [number, number]
  mem_offset: [number, number]
  core_offset: [number, number]
  model: string
}

export interface GetGigaspotResponseDataSnapshotServer {
  bids: GetGigaspotResponseDataSnapshotServerBid[]
  on_demand_rented: boolean
  online: boolean
  cpu: string
  cores: number
  threads: number
  ram: number
  gpus: GetGigaspotResponseDataSnapshotServerGpu[]
  working_properly: boolean
  cuda: string
  max_rental_length: number
  cc: string
  host: number
  reliability: number
  min_bid: number
  energy_price: number
}

export type GetGigaspotResponseDataSnapshot = Record<
  string,
  GetGigaspotResponseDataSnapshotServer
>

export interface GetGigaspotResponseDataBase extends ResponseData {
  my_user_id: number
  v1_snapshot_url: string
  creation_fees: Pricing
}

export interface GetGigaspotResponseData extends GetGigaspotResponseDataBase {
  snapshot: GetGigaspotResponseDataSnapshot
}
