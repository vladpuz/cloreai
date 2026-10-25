# cloreai

> CLORE.AI API client

Features:

- Based on native fetch
- Protects against rate limit exceeded (429 errors) through
  [p-queue](https://github.com/sindresorhus/p-queue)
- Convenient error handling
- Full type safety

Official documentation: [clore.ai/api-docs](https://clore.ai/api-docs)

Official changelog: [clore.ai/changelog](https://clore.ai/changelog)

## Installation

```shell
npm install cloreai
```

## Usage

### Creating an instance

```typescript
import Cloreai from 'cloreai'

const cloreai = new Cloreai('API_KEY', {
  baseURL: 'https://api.clore.ai/v1', // (optional) Override the default base URL for the API
  fetchOptions: {}, // (optional) Additional `RequestInit` options to be passed to `fetch` calls
  fetch: globalThis.fetch, // (optional) Specify a custom `fetch` function implementation
  queueOptions: {}, // (optional) Queue instance options https://github.com/sindresorhus/p-queue
  queueCreateOrderOptions: {}, // (optional) Create order queue instance options https://github.com/sindresorhus/p-queue
})
```

### 1. wallets

```typescript
const wallets = await cloreai.wallets()
```

### 2. my_servers

```typescript
const myServers = await cloreai.myServers()
```

### 3. server_config

```typescript
const serverConfig = await cloreai.serverConfig({
  server_name: 'SERVER_NAME',
})
```

### 4. marketplace

```typescript
const marketplace = await cloreai.marketplace()
```

### 5. my_orders

```typescript
const myOrders = await cloreai.myOrders() // Current orders
const allMyOrders = await cloreai.myOrders({ return_completed: true }) // All orders
```

### 6. spot_marketplace

```typescript
const spotMarketplace = await cloreai.spotMarketplace({
  market: 6718, // Server id
})
```

### 7. set_server_settings

```typescript
await cloreai.setServerSettings({
  'name': 'NAME', // Server name
  'availability': true,
  'mrl': 24,
  'bitcoin_on_demand': 1,
  'bitcoin_spot': 1,
  'CLORE-Blockchain_on_demand': 1,
  'CLORE-Blockchain_spot': 1,
  'USD-Blockchain_on_demand': 1,
  'USD-Blockchain_spot': 1,
  'enabled-USD-Blockchain': true,
  'enabled-CLORE-Blockchain': true,
  'enabled-bitcoin': true,
  'autoprice': {
    'CLORE-Blockchain': 'usd',
    'USD-Blockchain': 'usd',
    'bitcoin': 'usd',
  },
  'usd_pricing': {
    'CLORE-Blockchain': { on_demand: 1, spot: 1 },
    'USD-Blockchain': { on_demand: 1, spot: 1 },
    'bitcoin': { on_demand: 1, spot: 1 },
  },
  'auto_renew_allowed': true,
})
```

### 8. set_spot_price

```typescript
await cloreai.setSpotPrice({
  order_id: 38176,
  desired_price: 50,
})
```

### 9. cancel_order

```typescript
await cloreai.cancelOrder({
  id: 6718,
  issue: 'issue',
})
```

### 10. cancelOrders

```typescript
await cloreai.cancelOrders({
  order_ids: [8383],
})
```

### 11. create_order

```typescript
await cloreai.createOrder({
  currency: 'CLORE-Blockchain',
  image: 'cloreai/jupyter:ubuntu24.04-v2',
  renting_server: 5738,
  type: 'on-demand',
  ports: { 22: 'tcp', 8888: 'http' },
  env: { SSH_PASSWORD: 'SSH_PASSWORD', JUPYTER_TOKEN: 'JUPYTER_TOKEN' },
  jupyter_token: 'JUPYTER_TOKEN',
  ssh_password: 'SSH_PASSWORD',
  required_price: 50,
  remember_password: true,
  auto_renew: true,
  auto_renew_max_price: 50,
})
```

### 12. set_order_auto_renew

```typescript
await cloreai.setOrderAutoRenew({
  order_id: 38,
  rental_hours: null,
  auto_renew: true,
  auto_renew_max_price: 300,
})
```

### 13. order_renewals

```typescript
const orderRenewals = await cloreai.orderRenewals({ order_id: 38 })
```

### 14. poh_balance

```typescript
const pohBalance = await cloreai.pohBalance()
```

### 15. renter_fees

```typescript
const renterFees = await cloreai.renterFees()
```

## Fetch Options

All methods accept fetch options as the last parameter, for example:

```typescript
const marketplace = await cloreai.marketplace({
  // `RequestInit` options
})
```

## Error Handling

Use the `CloreaiError` class for error handling.

To check the error type based on its code, use the `statusCodes` constant.

Errors include an `error.data` field, which contains the server
response—including a code and a description of the error—and, in some cases,
additional fields with further error details.

This class only catches errors when a response has been successfully received,
but the response code is not equal to `statusCodes.NORMAL` (0). Be sure to
implement a pattern for propagating unknown exceptions (such as connection
errors, etc.), as shown in the example below.

```typescript
import { CloreaiError, statusCodes } from 'cloreai'

try {
  const marketplace = await cloreai.marketplace()
} catch (error) {
  if (error instanceof CloreaiError) {
    console.log('Error data:', error.data)

    if (error.data.code === statusCodes.EXCEEDED) {
      console.log('Rate limit exceeded error')
    }
  } else {
    throw error
  }
}
```

## Rate limit

All methods are protected from rate limit exceeded through
[p-queue](https://github.com/sindresorhus/p-queue), they automatically delay for
the needed time to avoid exceeding the limit.

Default rate limit values are available as constants:

```typescript
import { RATE_LIMIT, RATE_LIMIT_CREATE_ORDER } from 'cloreai'

console.log(RATE_LIMIT)
console.log(RATE_LIMIT_CREATE_ORDER)
```

You can set your own rate limit values for each request queue:

```typescript
const cloreai = new Cloreai('API_KEY', {
  queueOptions: {
    interval: 2000, // For example 2 seconds
  },
  queueCreateOrderOptions: {
    interval: 6000, // For example 6 seconds
  },
})
```

Access to p-queue instances:

- `cloreai.queue` - main request queue
- `cloreai.queueCreateOrder` - createOrder request queue

## Retries

For retrying, it's recommended to use
[p-retry](https://github.com/sindresorhus/p-retry):

```typescript
import pRetry from 'p-retry'

const marketplace = await pRetry(
  async () => {
    return await cloreai.marketplace()
  },
  {
    retries: 5,
  },
)
```

## Timeouts

Use `AbortSignal.timeout`:

```typescript
const marketplace = await cloreai.marketplace({
  signal: AbortSignal.timeout(5000),
})
```

Combine signals using `AbortSignal.any`. In the following example, the request
will be aborted after 5 seconds, but can also be aborted earlier by calling
`controller.abort()`:

```typescript
const controller = new AbortController()

// You can abort by event
// controller.abort()

const marketplace = await cloreai.marketplace({
  signal: AbortSignal.any([AbortSignal.timeout(5000), controller.signal]),
})
```
