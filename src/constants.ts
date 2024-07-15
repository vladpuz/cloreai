export const GLOBAL_RATE_LIMIT = 1_000
export const CREATE_ORDER_RATE_LIMIT = 5_000

export const statusCodes: Record<string, number> = {
  NORMAL: 0,
  DATABASE_ERROR: 1,
  INVALID_INPUT_DATA: 2,
  INVALID_API_TOKEN: 3,
  INVALID_ENDPOINT: 4,
  EXCEEDED: 5,
  ERROR: 6,
}

export const webStatusCodes: Record<string, string> = {
  NORMAL: 'ok',
}
