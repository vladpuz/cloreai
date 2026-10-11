## 4.1.0

- GigaSPOT has been completely removed. This is not a breaking change, as it had
  been disabled and non-functional for several months.
- A new method, `cancelOrders`, has been added (ported from GigaSPOT).
- The `createOrder` method now uses a dedicated queue for requests (previously,
  it used a shared queue by mistake).
- All interfaces have been updated (partial GPU rental, etc.).
- CloreaiError now passes options to the constructor of the Error class it
  extends.

## 4.0.2

- Class field `apiKey` are now public and can be changed at runtime.

## 4.0.1

- Class fields `baseURL`, `fetchOptions`, `fetch` are now public and can be
  changed at runtime.

## 4.0.0

- Axios has been removed and replaced with the native fetch! Class options have
  been changed:
  - Instead of `axiosOptions?: CreateAxiosDefaults`, now
    `fetchOptions?: RequestInit`.
  - New option `baseURL?: string`.
  - New option `fetch?: typeof fetch`.
- CloreaiError fields `error.code` and `error.error` renamed to
  `error.statusCode` and `error.description`.
- The gigaspot request queue has been removed. Now, gigaspot requests are
  processed within the general queue:
  - Option `queueGigaspotOptions?: QueueOptions` removed.
  - Constant `RATE_LIMIT_GIGASPOT` removed.
  - Field `gigaspot.queue` removed.

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
