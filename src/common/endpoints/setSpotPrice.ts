/* RequestData */

export interface SetSpotPriceRequestDataCommon {
  order_id: number
  desired_price: number
}

/* ResponseData */

export interface SetSpotPriceResponseDataMaxStep {
  error: 'exceeded_max_step'
  max_step: number
}

export interface SetSpotPriceResponseDataTimeToLowering {
  error: 'can_lower_every_600_seconds'
  time_to_lowering: number
}

export interface SetSpotPriceResponseDataNormal {
  error: undefined
}

export type SetSpotPriceResponseDataCommon =
  | SetSpotPriceResponseDataMaxStep
  | SetSpotPriceResponseDataTimeToLowering
  | SetSpotPriceResponseDataNormal
