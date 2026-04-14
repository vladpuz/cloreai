import PQueue, { type Options as PQueueOptions, type Queue, type QueueAddOptions } from 'p-queue'

import type { CancelOrderRequestData, CancelOrderResponseData } from './resources/cancelOrder.ts'
import type { CreateOrderRequestData, CreateOrderResponseData } from './resources/createOrder.ts'
import type { MarketplaceResponseData } from './resources/marketplace.ts'
import type { MyOrdersRequestParams, MyOrdersResponseData } from './resources/myOrders.ts'
import type { MyServersResponseData } from './resources/myServers.ts'
import type { PohBalanceResponseData } from './resources/pohBalance.ts'
import type { RenterFeesResponseData } from './resources/renterFees.ts'
import type { ServerConfigRequestData, ServerConfigResponseData } from './resources/serverConfig.ts'
import type { SetServerSettingsRequestData, SetServerSettingsResponseData } from './resources/setServerSettings.ts'
import type { SetSpotPriceRequestData, SetSpotPriceResponseData } from './resources/setSpotPrice.ts'
import type { SpotMarketplaceRequestParams, SpotMarketplaceResponseData } from './resources/spotMarketplace.ts'
import type { WalletsResponseData } from './resources/wallets.ts'
import type { ResponseData } from './types.ts'

import { CloreaiError } from './CloreaiError.ts'
import { priorityLevels, RATE_LIMIT, RATE_LIMIT_CREATE_ORDER, statusCodes } from './constants.ts'
import Gigaspot from './Gigaspot.ts'

/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */

export interface Options {
  baseURL?: string
  fetch?: typeof fetch
  fetchOptions?: RequestInit
  queueOptions?: QueueOptions
  queueCreateOrderOptions?: QueueOptions
}

export type QueueOptions = PQueueOptions<
  Queue<() => Promise<unknown>, QueueAddOptions>,
  QueueAddOptions
>

class Cloreai {
  queue: PQueue
  queueCreateOrder: PQueue
  gigaspot: Gigaspot

  #baseURL: string
  #fetch: typeof fetch

  constructor(apiKey: string, options: Options = {}) {
    this.#baseURL = options.baseURL ?? 'https://api.clore.ai/v1'

    const fetchFunction = options.fetch ?? fetch
    const fetchOptions = options.fetchOptions ?? {}

    this.#fetch = async (input, init = {}) => {
      if (input instanceof Request) {
        throw new TypeError('Input must be a string or URL')
      }

      const headers = new Headers({
        'Content-Type': 'application/json',
        'auth': apiKey,
      })

      for (const [key, value] of new Headers(fetchOptions.headers)) {
        headers.set(key, value)
      }

      for (const [key, value] of new Headers(init.headers)) {
        headers.set(key, value)
      }

      const signal = AbortSignal.any([
        ...(fetchOptions.signal ? [fetchOptions.signal] : []),
        ...(init.signal ? [init.signal] : []),
      ])

      const mergedInit: RequestInit = {
        ...fetchOptions,
        ...init,
        headers,
        signal,
      }

      const url = new URL(input)
      const request = new Request(url, mergedInit)
      let response: Response

      try {
        response = await fetchFunction(request)
      } catch (error) {
        throw new CloreaiError(
          error instanceof Error ? error.message : String(error),
          {
            cause: error,
            init: mergedInit,
            request,
          },
        )
      }

      const originalJson = response.json

      // @ts-expect-error: json is readonly
      response.json = async () => {
        let data: ResponseData

        try {
          data = await originalJson.call(response) as ResponseData
        } catch (error) {
          throw new CloreaiError(
            error instanceof Error ? error.message : String(error),
            {
              cause: error,
              init: mergedInit,
              request,
              response,
            },
          )
        }

        if (data.code === statusCodes.NORMAL) {
          return data
        }

        const hasError = Boolean(data.error)
        const errorMessage = hasError
          ? `Code "${data.code}, error "${data.error}"`
          : `Code "${data.code}"`

        throw new CloreaiError(errorMessage, {
          init: mergedInit,
          request,
          response,
          statusCode: data.code,
          description: data.error ?? '',
          data,
        })
      }

      return response
    }

    this.queue = new PQueue({
      interval: RATE_LIMIT,
      intervalCap: 1,
      concurrency: 1,
      ...options.queueOptions,
    })

    this.queueCreateOrder = new PQueue({
      interval: RATE_LIMIT_CREATE_ORDER,
      intervalCap: 1,
      concurrency: 1,
      ...options.queueCreateOrderOptions,
    })

    this.gigaspot = new Gigaspot(this.queue, this.#baseURL, this.#fetch)
  }

  async wallets(
    init: RequestInit = {},
  ): Promise<WalletsResponseData> {
    const url = new URL(this.#baseURL + '/wallets')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as WalletsResponseData
  }

  async myServers(
    init: RequestInit = {},
  ): Promise<MyServersResponseData> {
    const url = new URL(this.#baseURL + '/my_servers')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as MyServersResponseData
  }

  async serverConfig(
    data: ServerConfigRequestData,
    init: RequestInit = {},
  ): Promise<ServerConfigResponseData> {
    const url = new URL(this.#baseURL + '/server_config')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as ServerConfigResponseData
  }

  async marketplace(
    init: RequestInit = {},
  ): Promise<MarketplaceResponseData> {
    const url = new URL(this.#baseURL + '/marketplace')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as MarketplaceResponseData
  }

  async myOrders(
    params: MyOrdersRequestParams = {},
    init: RequestInit = {},
  ): Promise<MyOrdersResponseData> {
    const url = new URL(this.#baseURL + '/my_orders')

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as MyOrdersResponseData
  }

  async spotMarketplace(
    params: SpotMarketplaceRequestParams,
    init: RequestInit = {},
  ): Promise<SpotMarketplaceResponseData> {
    const url = new URL(this.#baseURL + '/spot_marketplace')

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value))
    }

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as SpotMarketplaceResponseData
  }

  async setServerSettings(
    data: SetServerSettingsRequestData,
    init: RequestInit = {},
  ): Promise<SetServerSettingsResponseData> {
    const url = new URL(this.#baseURL + '/set_server_settings')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.HIGH,
      signal: init.signal ?? undefined,
    })

    return await response.json() as SetServerSettingsResponseData
  }

  async setSpotPrice(
    data: SetSpotPriceRequestData,
    init: RequestInit = {},
  ): Promise<SetSpotPriceResponseData> {
    const url = new URL(this.#baseURL + '/set_spot_price')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.HIGH,
      signal: init.signal ?? undefined,
    })

    return await response.json() as SetSpotPriceResponseData
  }

  async cancelOrder(
    data: CancelOrderRequestData,
    init: RequestInit = {},
  ): Promise<CancelOrderResponseData> {
    const url = new URL(this.#baseURL + '/cancel_order')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.HIGH,
      signal: init.signal ?? undefined,
    })

    return await response.json() as CancelOrderResponseData
  }

  async createOrder(
    data: CreateOrderRequestData,
    init: RequestInit = {},
  ): Promise<CreateOrderResponseData> {
    const url = new URL(this.#baseURL + '/create_order')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'POST',
        body: JSON.stringify(data),
      })
    }, {
      priority: priorityLevels.HIGHEST,
      signal: init.signal ?? undefined,
    })

    return await response.json() as CreateOrderResponseData
  }

  async pohBalance(
    init: RequestInit = {},
  ): Promise<PohBalanceResponseData> {
    const url = new URL(this.#baseURL + '/poh_balance')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as PohBalanceResponseData
  }

  async renterFees(
    init: RequestInit = {},
  ): Promise<RenterFeesResponseData> {
    const url = new URL(this.#baseURL + '/renter_fees')

    const response = await this.queue.add(async () => {
      return await this.#fetch(url, {
        ...init,
        method: 'GET',
      })
    }, {
      priority: priorityLevels.NORMAL,
      signal: init.signal ?? undefined,
    })

    return await response.json() as RenterFeesResponseData
  }
}

export default Cloreai
