export interface CommonOutput<T = string> {
  error?: T | undefined
}

export interface Output<T = string> extends CommonOutput<T> {
  code: number
}

export interface WebOutput<T = string> extends CommonOutput<T> {
  status: string
}
