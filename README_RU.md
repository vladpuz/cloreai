# cloreai

> CLORE.AI API client

Особенности:

- Базируется на [axios](https://github.com/axios/axios)
- Защищает от превышения rate limit (ошибки 429) через
  [p-queue](https://github.com/sindresorhus/p-queue)
- Удобная обработка ошибок
- Полная типизация
- Поддерживает GigaSPOT

Официальная документация: [clore.ai/api-docs](https://clore.ai/api-docs)

Официальная документация GigaSPOT:
[gigaspot-api-docs.clore.ai](https://gigaspot-api-docs.clore.ai)

## Установка

```shell
npm install cloreai
```

## Использование

### Создание экземпляра

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

### Конфигурация запросов

Все методы принимают опциональную конфигурацию запроса для axios последним
параметром, например:

```typescript
const marketplace = await cloreai.marketplace({
  // axios config
})
```

### Доступ к экземпляру axios

Используйте поле `cloreai.axios`.

Обратитесь к документации [axios](https://github.com/axios/axios).

### Доступ к экземплярам p-queue

Используйте поля:

- `cloreai.queue` - для основной очереди запросов
- `cloreai.queueCreateOrder` - для очереди запросов createOrder
- `cloreai.gigaspot.queue` - для очереди запросов gigaspot

Обратитесь к документации [p-queue](https://github.com/sindresorhus/p-queue).

### Обработка ошибок

Используйте класс `CloreaiError` для обработки ошибок.

Этот класс наследуется от `AxiosError` и имеет дополнительные поля с информацией
об ошибке `error.code` и `error.error`.

Для проверки типа ошибки используйте константу `statusCodes`.

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

Все методы защищены от превышения rate limit через
[p-queue](https://github.com/sindresorhus/p-queue), они автоматически
задерживаются на нужное время, чтобы избежать превышения лимита.

Значения rate limit по умолчанию доступны как константы:

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

Можно задать собственные значение rate limit для каждой очереди запросов:

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
