import type { CommonConfig, CommonOutput } from '../common/types.js'

export interface Config extends CommonConfig {
  apiKey: string
}

export interface Output<T = string> extends CommonOutput<T> {
  code: number
}
