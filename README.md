# cloreai

> CLORE.AI API client

Features:

- Based on [axios](https://github.com/axios/axios)
- Protects from rate limit exceeded (429 errors) via
  [p-queue](https://github.com/sindresorhus/p-queue)
- User-friendly error handling
- Full typing
- Supports GigaSPOT

Official documentation: [clore.ai/api-docs](https://clore.ai/api-docs)

Official GigaSPOT documentation:
[gigaspot-api-docs.clore.ai](https://gigaspot-api-docs.clore.ai)

## Installation

```shell
npm install cloreai
```

## Usage

### Creating an instance

```typescript
import Cloreai from 'cloreai'

const cloreai = new Cloreai('API_KEY', {
  axiosOptions: {}, // (optional) Axios instance options https://github.com/axios/axios
  queueOptions: {}, // (optional) Queue instance options https://github.com/sindresorhus/p-queue
  queueCreateOrderOptions: {}, // (optional) Create order queue instance options https://github.com/sindresorhus/p-queue
  queueGigaspotOptions: {}, //  (optional) Gigaspot queue instance options https://github.com/sindresorhus/p-queue
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

### 10. create_order

```typescript
await cloreai.createOrder({
  type: 'on-demand',
  currency: 'CLORE-Blockchain',
  image: 'cloreai/jupyter:ubuntu24.04-v2',
  renting_server: 5738,
  ports: { 22: 'tcp', 8888: 'http' },
  env: { SSH_PASSWORD: 'SSH_PASSWORD', JUPYTER_TOKEN: 'JUPYTER_TOKEN' },
  jupyter_token: 'JUPYTER_TOKEN',
  ssh_password: 'SSH_PASSWORD',
  required_price: 50,
  remember_password: true,
})
```

### 11. PoH Info

```typescript
const pohBalance = await cloreai.pohBalance()
```

### 12. renter_fees

```typescript
const renterFees = await cloreai.renterFees()
```

### GigaSPOT

#### getGigaspot

```typescript
const gigaspot = await cloreai.gigaspot.getGigaspot()
```

#### createGigaspotOrders

```typescript
import { gigaspotBaseImages } from 'cloreai'

await cloreai.gigaspot.createGigaspotOrders([
  {
    currency: 'CLORE-Blockchain',
    image: gigaspotBaseImages.UBUNTU, // Use the base image constant
    renting_server: 5941,
    price: 50,
    oc: [
      {
        pl: 150,
      },
    ],
  },
])
```

#### editGigaspotOrders

```typescript
await cloreai.gigaspot.editGigaspotOrders([
  {
    order_id: 58991,
    price: 50,
    oc: [
      {
        pl: 150,
      },
    ],
  },
])
```

#### cancelOrders

```typescript
await cloreai.gigaspot.cancelOrders({
  order_ids: [8383],
})
```

### Request Configuration

All methods accept an optional request configuration for axios as the last
parameter, for example:

```typescript
const marketplace = await cloreai.marketplace({
  // axios config
})
```

### Access to axios instance

Use the field `cloreai.axios`.

Refer to the documentation [axios](https://github.com/axios/axios).

### Access to p-queue instances

Use the fields:

- `cloreai.queue` - for the main request queue
- `cloreai.queueCreateOrder` - for the createOrder request queue
- `cloreai.gigaspot.queue` - for the gigaspot request queue

Refer to the documentation [p-queue](https://github.com/sindresorhus/p-queue).

### Error Handling

Use the `CloreaiError` class for error handling.

This class inherits from `AxiosError` and has additional fields with error
information `error.code` and `error.error`.

To check the error type use the constant `statusCodes`.

```typescript
import { CloreaiError, statusCodes } from 'cloreai'

try {
  const marketplace = await cloreai.marketplace()
} catch (error) {
  if (error instanceof CloreaiError) {
    console.log(error.code, error.error)

    if (error.code === statusCodes.EXCEEDED) {
      console.log('Rate limit exceeded error')
    }
  } else {
    throw error
  }
}
```

### Rate limit

All methods are protected from rate limit exceeded via
[p-queue](https://github.com/sindresorhus/p-queue), they automatically delay for
the required time to avoid exceeding the limit.

Default rate limit values are available as constants:

```typescript
import {
  RATE_LIMIT,
  RATE_LIMIT_CREATE_ORDER,
  RATE_LIMIT_GIGASPOT,
} from 'cloreai'

console.log(RATE_LIMIT)
console.log(RATE_LIMIT_CREATE_ORDER)
console.log(RATE_LIMIT_GIGASPOT)
```

You can set custom rate limit values for each request queue:

```typescript
import Cloreai from 'cloreai'

const cloreai = new Cloreai('API_KEY', {
  queueOptions: {
    interval: 2000, // For example 2 seconds
  },
  queueCreateOrderOptions: {
    interval: 6000, // For example 6 seconds
  },
  queueGigaspotOptions: {
    interval: 2000, // For example 2 seconds
  },
})
```
