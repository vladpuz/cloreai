export const RATE_LIMIT = 1000
export const RATE_LIMIT_CREATE_ORDER = 5000

export const statusCodes = Object.freeze({
  NORMAL: 0,
  DATABASE_ERROR: 1,
  INVALID_INPUT_DATA: 2,
  INVALID_API_TOKEN: 3,
  INVALID_ENDPOINT: 4,
  EXCEEDED: 5,
  CUSTOM: 6,
})

export const priorityLevels = Object.freeze({
  NORMAL: 0,
  HIGH: 1,
  HIGHEST: 2,
})
