# cloreai

> CLORE.AI API client

Особенности:

- Базируется на нативном fetch
- Удобная обработка ошибок
- Полная типизация

Официальная документация: [clore.ai/api-docs](https://clore.ai/api-docs)

Официальный журнал изменений: [clore.ai/changelog](https://clore.ai/changelog)

## Установка

```shell
npm install cloreai
```

## Использование

### Создание экземпляра

```typescript
import Cloreai from 'cloreai'

const cloreai = new Cloreai('API_KEY', {
  baseURL: 'https://api.clore.ai/v1', // (optional) Override the default base URL for the API
  fetchOptions: {}, // (optional) Additional `RequestInit` options to be passed to `fetch` calls
  fetch: globalThis.fetch, // (optional) Specify a custom `fetch` function implementation
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

## Опции fetch

Все методы принимают опции для fetch последним параметром, например:

```typescript
const marketplace = await cloreai.marketplace({
  // `RequestInit` options
})
```

## Обработка ошибок

Используйте класс `CloreaiError` для обработки ошибок.

Для проверки типа ошибки по коду используйте константу `statusCodes`.

Ошибки имеют поле `error.data`, которое содержит ответ сервера с кодом,
описанием ошибки и возможно, дополнительные поля с деталями ошибки в некоторых
случаях.

Этот класс перехватывает ошибки только когда ответ был успешно получен, но код
ответа не равен `statusCodes.NORMAL` (0). Обязательно используйте паттерн
проброса неизвестных исключений (например ошибки соединения и тд.) как в примере
ниже.

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

Для rate limit рекомендуется использовать
[p-queue](https://github.com/sindresorhus/p-queue):

```typescript
import PQueue from 'p-queue'

const queue = new PQueue({
  interval: 2000, // 2 seconds
  intervalCap: 1,
  concurrency: 1,
})

const marketplace = await queue.add(async () => {
  return await cloreai.marketplace()
})
```

Очередь автоматически задерживает выполнение на нужное время, чтобы избежать
превышения лимита (ошибок 429). Рекомендуемая задержка 1-2 секунды.

## Retries

Для повторных попыток рекомендуется использовать
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

Используйте `AbortSignal.timeout`:

```typescript
const marketplace = await cloreai.marketplace({
  signal: AbortSignal.timeout(5000),
})
```

Комбинируйте сигналы с помощью `AbortSignal.any`. В следующем примере запрос
будет прерван через 5 секунд, но так же может быть прерван раньше при вызове
`controller.abort()`:

```typescript
const controller = new AbortController()

// You can abort by event
// controller.abort()

const marketplace = await cloreai.marketplace({
  signal: AbortSignal.any([AbortSignal.timeout(5000), controller.signal]),
})
```
