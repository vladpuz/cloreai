import type { CommonConfig, CommonOutput } from '../common/types.js'

export interface Config extends CommonConfig {
  token: string
}

export interface Output<T = string> extends CommonOutput<T> {
  status: string
}
