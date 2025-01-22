export const RATE_LIMIT = 1_800
export const RATE_LIMIT_CREATE_ORDER = 5_000

export const statusCodes = {
  NORMAL: 0,
  DATABASE_ERROR: 1,
  INVALID_INPUT_DATA: 2,
  INVALID_API_TOKEN: 3,
  INVALID_ENDPOINT: 4,
  EXCEEDED: 5,
  OTHER: 6,
}

export const priorityLevels = {
  NORMAL: 0,
  HIGH: 1,
  HIGHEST: 2,
}

export const gigaspotBaseImages = {
  ubuntu: 'a3f9c4d7e5b088d8a0bff880',
  hiveos: 'c9a4e2f6b7d488d8f0bab0ff',
}
