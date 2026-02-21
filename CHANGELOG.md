## 3.0.0

- Changed typing to support payments in USDT and BTC.
- Added endpoint `/renter_fees`.
- The default rate limit is set to 1000ms.
- Error classes `DatabaseError`, `InvalidInputDataError`,
  `InvalidApiTokenError`, `InvalidEndpointError`, `ExceededError`,
  `CustomError`, `UnknownError` has been removed. Use new class `CloreaiError`
  with property `error.code` and constant `statusCodes` instead of this.
- Renamed `options.queueOptionsCreateOrder` and `options.queueOptionsGigaspot`
  to `options.queueCreateOrderOptions` and `options.queueGigaspotOptions`.

## 2.0.0

- Changed arguments of the CloreAI class constructor. Now apiKey is passed as
  the first argument, options as the second argument. Previously, one argument
  was passed - a configuration object including apiKey.
- Renamed some TypeScript interfaces.
- Available new constants statusCodes and priorityLevels.
