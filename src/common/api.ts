export type OrderType = 'on-demand' | 'spot'
export type Visibility = 'public' | 'hidden'
export type Currency = 'CLORE-Blockchain' | 'bitcoin'
export type Pricing = Record<Currency, number>

export interface Price {
  on_demand: Pricing
  spot: Pricing
}

export interface Net {
  cc: string
  down: number
  up: number
}

export interface Specs {
  mb: string
  cpu: string
  cpus: string
  ram: number
  disk: string
  disk_speed: number
  gpu: string
  gpuram: number
  net: Net
  backend_version: number
  pcie_rev: number
  pcie_width: number
  pl: number[]
  stock_oc_override: boolean
  stock_pl: number[]
}
